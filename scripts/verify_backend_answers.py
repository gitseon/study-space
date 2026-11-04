"""Runs the executable answers of the backend track on a real MySQL server and Java, and checks the review records.

Connection details are never read from the repository. They come from the MYSQL_* environment variables or from the
git-ignored file private/backend-db/mysql-verify.env (override with --env). A missing server, missing connection details,
a mismatch, or a question without a current check or review record ends with exit code 1.
"""
import argparse
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
from collections import Counter
from pathlib import Path
from build_data import ROOT, build_data, track_of

SOURCE = ROOT / "source" / "backend"
DEFAULT_ENV = ROOT / "private" / "backend-db" / "mysql-verify.env"
ENV_KEYS = ("MYSQL_HOST", "MYSQL_USER", "MYSQL_PASSWORD", "MYSQL_DATABASE")
END = "@@END@@"

class VerifyError(Exception):
    pass

def load_env(path, environ=None):
    """Connection settings: environment variables win, the env file fills the gaps. Returns a dict with all four keys."""
    environ = os.environ if environ is None else environ
    found = {k: environ[k] for k in ENV_KEYS if environ.get(k)}
    if len(found) < len(ENV_KEYS) and path and Path(path).is_file():
        for line in Path(path).read_text(encoding="utf-8-sig").splitlines():
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                key, value = line.split("=", 1)
                key = key.strip()
                if key in ENV_KEYS and key not in found:
                    found[key] = value.strip().strip('"').strip("'")
    missing = [k for k in ENV_KEYS if k not in found]
    if missing:
        raise VerifyError("missing connection settings: " + ", ".join(missing))
    return found

def normalize_rows(rows, ordered):
    rows = [list(map(str, r)) for r in rows]
    return rows if ordered else sorted(rows)

def rows_match(actual, expected, ordered):
    return normalize_rows(actual, ordered) == normalize_rows(expected, ordered)

def error_code(output):
    found = re.search(r"ERROR (\d+)", "\n".join(output))
    return int(found.group(1)) if found else None

def coverage_issues(questions, checks, reviews):
    """Every backend question needs a check or a review at its current revision. Stale or unknown records are errors."""
    issues = []
    current = {q["id"]: q.get("revision") for q in questions}
    covered = Counter()
    for kind, records in (("check", checks), ("review", reviews)):
        for record in records:
            qid = record.get("questionId")
            if qid not in current:
                issues.append(f"{kind} for unknown question {qid}")
            elif record.get("revision") != current[qid]:
                issues.append(f"{kind} for {qid} is for revision {record.get('revision')} but the question is at {current[qid]}")
            else:
                covered[qid] += 1
    for qid in current:
        if covered[qid] == 0:
            issues.append(f"{qid} has no check or review at revision {current[qid]}")
    for review in reviews:
        if review.get("independent") not in (True, False) or not review.get("reviewer") or not review.get("reviewedAt") or not review.get("note"):
            issues.append(f"review for {review.get('questionId')} lacks reviewer, date, note or the independent flag")
    return issues

def mysql_binary():
    for candidate in (os.environ.get("MYSQL_BIN"), shutil.which("mysql"),
                      r"C:\Program Files\MySQL\MySQL Server 8.4\bin\mysql.exe"):
        if candidate and Path(candidate).is_file():
            return candidate
    raise VerifyError("mysql client not found (set MYSQL_BIN)")

class Session:
    """One persistent mysql client so that transactions and session settings span several statements."""
    def __init__(self, env):
        self.password = env["MYSQL_PASSWORD"]
        self.process = subprocess.Popen(
            [mysql_binary(), "-h", env["MYSQL_HOST"], "-u", env["MYSQL_USER"], env["MYSQL_DATABASE"],
             "--default-character-set=utf8mb4", "--force", "-B", "-N", "-n"],
            stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.STDOUT,
            env={**os.environ, "MYSQL_PWD": self.password}, text=True, encoding="utf-8", bufsize=1)

    def run(self, sql):
        self.process.stdin.write(sql.rstrip().rstrip(";") + f";\nSELECT '{END}';\n")
        self.process.stdin.flush()
        lines = []
        for line in self.process.stdout:
            if line.strip() == END:
                return lines
            lines.append(line.rstrip("\n"))
        raise VerifyError("mysql client ended unexpectedly: " + " | ".join(lines)[:300])

    def close(self):
        try:
            self.process.stdin.close()
            self.process.wait(timeout=10)
        except Exception:
            self.process.kill()
        finally:
            self.process.stdout.close()

def table_rows(output):
    return [line.split("\t") for line in output if line and not line.startswith("ERROR")]

def check_step(step, output):
    """Returns an error message or None for one executed step."""
    expect = step["expect"]
    code = error_code(output)
    if "error" in expect:
        return None if code == expect["error"] else f"expected error {expect['error']} but got {code}: {output[:2]}"
    if code is not None:
        return f"unexpected error {code}: {output[:2]}"
    if "rows" in expect and not rows_match(table_rows(output), expect["rows"], expect.get("ordered", False)):
        return f"expected {expect['rows']} but got {table_rows(output)}"
    return None

def run_sql_check(check, env):
    sessions, failures = {}, []
    def session(name):
        if name not in sessions:
            sessions[name] = Session(env)
        return sessions[name]
    try:
        for sql in check.get("setup", []):
            session("setup").run(sql)
        for number, step in enumerate(check["steps"], start=1):
            output = session(step.get("session", "main")).run(step["sql"])
            message = check_step(step, output)
            if message:
                failures.append(f"step {number}: {message}")
    finally:
        try:
            for sql in check.get("cleanup", []):
                session("setup").run(sql)
        finally:
            for s in sessions.values():
                s.close()
    return failures

def connector_jar():
    explicit = os.environ.get("MYSQL_CONNECTOR_JAR")
    jar = Path(explicit) if explicit else Path.home() / ".m2" / "repository" / "com" / "mysql" / "mysql-connector-j" / "8.4.0" / "mysql-connector-j-8.4.0.jar"
    if not jar.is_file():
        raise VerifyError("MySQL Connector/J 8.4.0 jar not found (set MYSQL_CONNECTOR_JAR)")
    return jar

def run_java_file(relative, env):
    result = subprocess.run(["java", "-cp", str(connector_jar()), str(SOURCE / relative)], capture_output=True, text=True,
                            encoding="utf-8", env={**os.environ, **env})
    if result.returncode != 0:
        raise VerifyError(f"{relative} failed: {(result.stderr or result.stdout)[:400]}".replace(env["MYSQL_PASSWORD"], "***"))
    return dict(line.split("=", 1) for line in result.stdout.splitlines() if "=" in line)

def run_node_file(relative):
    """Browser-level checks run with Node and Playwright; they need no database."""
    result = subprocess.run(["node", str(SOURCE / relative)], capture_output=True, text=True, encoding="utf-8", cwd=ROOT)
    if result.returncode != 0:
        raise VerifyError(f"{relative} failed: {(result.stderr or result.stdout)[:400]}")
    return dict(line.split("=", 1) for line in result.stdout.splitlines() if "=" in line)

def java_failures(check, outputs):
    produced = outputs[check["file"]]
    return [f"{k}: expected {v!r} but got {produced.get(k)!r}" for k, v in check["expect"].items() if produced.get(k) != v]

def environment(env):
    session = Session(env)
    try:
        output = session.run("SELECT VERSION(), @@version_comment, @@character_set_server, @@collation_server, @@transaction_isolation, "
                             "@@autocommit, @@sql_mode, @@time_zone")
    finally:
        session.close()
    keys = ("mysqlVersion", "mysqlEdition", "charset", "collation", "isolation", "autocommit", "sqlMode", "timeZone")
    info = dict(zip(keys, output[0].split("\t")))
    java = subprocess.run(["java", "-version"], capture_output=True, text=True, encoding="utf-8")
    info["java"] = (java.stderr or java.stdout).splitlines()[0] if (java.stderr or java.stdout) else "unknown"
    info["connector"] = connector_jar().parent.name
    return info

def main(argv=None):
    parser = argparse.ArgumentParser()
    parser.add_argument("--env", default=str(DEFAULT_ENV))
    parser.add_argument("--report", default="reports/backend-verification.json")
    args = parser.parse_args(argv)
    with tempfile.TemporaryDirectory() as tmp:
        exams = build_data(ROOT / "source", Path(tmp))
    questions = [q for e in exams if track_of(e) == "backend" for q in e["questions"]]
    checks = json.loads((SOURCE / "backend-checks.json").read_text(encoding="utf-8-sig"))
    reviews = json.loads((SOURCE / "backend-reviews.json").read_text(encoding="utf-8-sig"))
    failures = coverage_issues(questions, checks, reviews)
    results = []
    try:
        env = load_env(args.env)
        info = environment(env)
        java_outputs = {}
        for file in sorted({c["file"] for c in checks if c["kind"] == "java"}):
            java_outputs[file] = run_java_file(file, env)
        for file in sorted({c["file"] for c in checks if c["kind"] == "node"}):
            java_outputs[file] = run_node_file(file)
        for check in checks:
            if check["kind"] in ("java", "node"):
                found = java_failures(check, java_outputs)
            else:
                found = run_sql_check(check, env)
            results.append({"id": check["id"], "questionId": check["questionId"], "revision": check["revision"], "kind": check["kind"], "passed": not found, "failures": found})
            failures.extend(f"{check['id']}: {m}" for m in found)
    except VerifyError as err:
        failures.append(str(err))
        info = {}
    report = {"environment": info, "checks": results, "reviews": [{k: r[k] for k in ("questionId", "revision", "independent")} for r in reviews], "failures": failures}
    target = ROOT / args.report
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8", newline="\n")
    print(f"Backend verification: {len(results)} executed checks, {len(reviews)} review records, {len(failures)} failures")
    for message in failures:
        print("  " + message)
    return 1 if failures else 0

if __name__ == "__main__":
    sys.exit(main())
