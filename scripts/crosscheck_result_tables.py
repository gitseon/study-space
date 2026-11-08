"""Cross-checks the result tables of the backend track on SQLite, without a MySQL server.

The tables shown in explanations come from the `show` steps of source/backend/backend-checks.json. Their rows are the
MySQL results that verify_backend_answers.py checks. This script runs the same setup and steps on SQLite and compares the
rows of every `show` step. It is only a second opinion: SQLite differs from MySQL (collation, NULL handling of some
functions, DECIMAL formatting, locking), so checks that need MySQL are skipped and named in the report. The final check is
verify_backend_answers.py on MySQL.

Usage: python scripts/crosscheck_result_tables.py
Exit code 1 means a mismatch in a step that SQLite can run.
"""
import json
import sqlite3
import sys
from pathlib import Path

CHECKS = Path(__file__).resolve().parents[1] / "source" / "backend" / "backend-checks.json"
# Statements that SQLite cannot run the way MySQL does.
MYSQL_ONLY = ("AUTO_INCREMENT", "TRUNCATE", "START TRANSACTION", "SAVEPOINT", "ENGINE", "<=>", "EXCEPT ALL", "INTERSECT ALL",
              "@@", "FOR UPDATE", "CONCAT_WS", "CHAR_LENGTH", "ISOLATION")

def cell(value):
    return "NULL" if value is None else str(value)

def same(expected, actual):
    """Rows compare as text; numbers compare by value because MySQL prints AVG as 150.0000 and SQLite as 150.0."""
    if len(expected) != len(actual):
        return False
    for e, a in zip(expected, actual):
        try:
            if float(e) == float(a):
                continue
        except ValueError:
            pass
        if e != a:
            return False
    return True

def rows_match(expected, actual, ordered):
    if ordered:
        return len(expected) == len(actual) and all(same(e, a) for e, a in zip(expected, actual))
    remaining = [list(r) for r in actual]
    for row in expected:
        hit = next((i for i, r in enumerate(remaining) if same(row, r)), None)
        if hit is None:
            return False
        remaining.pop(hit)
    return not remaining

def skip_reason(check):
    text = " ".join(check.get("setup", []) + [s["sql"] for s in check["steps"]]).upper()
    if any(s.get("session") for s in check["steps"]):
        return "needs several sessions"
    return next((f"MySQL-only syntax {word}" for word in MYSQL_ONLY if word in text), None)

def run(check):
    """Returns a list of problems for the show steps of one check."""
    db = sqlite3.connect(":memory:")
    problems = []
    try:
        for sql in check.get("setup", []):
            db.execute(sql)
        for number, step in enumerate(check["steps"]):
            cursor = db.execute(step["sql"])
            if "show" not in step:
                continue
            actual = [[cell(v) for v in row] for row in cursor.fetchall()]
            expect = step["expect"]
            if not rows_match(expect["rows"], actual, expect.get("ordered", False)):
                problems.append(f"step {number} '{step['show']['title']}': MySQL rows {expect['rows']} but SQLite {actual}")
    finally:
        db.close()
    return problems

def main():
    checks = [c for c in json.loads(CHECKS.read_text(encoding="utf-8")) if c.get("kind") == "sql" and any("show" in s for s in c["steps"])]
    matched = skipped = 0
    failed = []
    for check in checks:
        reason = skip_reason(check)
        if reason:
            skipped += 1
            print(f"skip   {check['questionId']}: {reason}")
            continue
        try:
            problems = run(check)
        except sqlite3.Error as error:
            skipped += 1
            print(f"skip   {check['questionId']}: SQLite cannot run it ({error})")
            continue
        if problems:
            failed.append(check["questionId"])
            for problem in problems:
                print(f"FAIL   {check['questionId']} {problem}")
        else:
            matched += 1
            print(f"ok     {check['questionId']}")
    print(f"\n{matched} matched, {skipped} skipped, {len(failed)} failed of {len(checks)} checks with result tables")
    return 1 if failed else 0

if __name__ == "__main__":
    sys.exit(main())
