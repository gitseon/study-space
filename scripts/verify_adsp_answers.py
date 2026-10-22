"""Executes the checks behind the ADsP track answers.

A question that computes a value is run from source/adsp/adsp-checks.json: the printed value must equal the
expected text and appear in the correct choice. The other questions need a re-solve record in adsp-reviews.json
for the current revision. The checks use only the Python standard library.
"""
import argparse
import json
import os
import re
import subprocess
import sys
import tempfile
from pathlib import Path
from build_data import ROOT, build_data

ADSP_DIR = ROOT / "source" / "adsp"
NOISE = re.compile(r"[\s,$_\\{}]")


def normalize(text):
    return NOISE.sub("", text)


def run_python(code, timeout=60):
    env = dict(os.environ, PYTHONHASHSEED="0", PYTHONIOENCODING="utf-8")
    with tempfile.TemporaryDirectory() as tmp:
        (Path(tmp) / "snippet.py").write_text(code, encoding="utf-8")
        return subprocess.run([sys.executable, "-I", "snippet.py"], cwd=tmp, env=env, capture_output=True,
                              text=True, encoding="utf-8", timeout=timeout)


def verify_exam(exam, checks, reviews):
    results = []
    by_id = {q["id"]: q for q in exam["questions"]}
    done = set()
    for check in checks:
        q = by_id.get(check["questionId"])
        if q is None:
            continue
        record = {"questionId": q["id"], "revision": check["revision"], "method": "run"}
        if q["revision"] != check["revision"]:
            record.update(passed=False, detail="question revision does not match the check")
        else:
            run = run_python(check["code"])
            actual = run.stdout.strip()
            right = next(c["text"] for c in q["choices"] if c["id"] == q["correctChoiceId"])
            in_choice = (not check.get("match", True)) or normalize(check["expect"]) in normalize(right)
            record.update(passed=run.returncode == 0 and actual == check["expect"] and in_choice,
                          expected=check["expect"], actual=actual, inCorrectChoice=in_choice)
            if run.returncode:
                record["detail"] = run.stderr[-300:]
        results.append(record)
        done.add(q["id"])
    for q in exam["questions"]:
        if q["id"] in done:
            continue
        review = next((r for r in reviews if r["questionId"] == q["id"] and r["revision"] == q["revision"]), None)
        results.append({"questionId": q["id"], "revision": q["revision"], "method": "review", "passed": bool(review),
                        "detail": review["note"] if review else "no re-solve record for this revision"})
    return results


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--report", default="reports/adsp-verification.json")
    args = parser.parse_args()
    exams = [e for e in build_data() if e.get("track") == "adsp"]
    checks = json.loads((ADSP_DIR / "adsp-checks.json").read_text(encoding="utf-8"))
    reviews = json.loads((ADSP_DIR / "adsp-reviews.json").read_text(encoding="utf-8"))
    results = []
    for exam in exams:
        results += verify_exam(exam, checks, reviews)
    target = ROOT / args.report
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(json.dumps(results, ensure_ascii=False, indent=2), encoding="utf-8")
    failed = [r for r in results if not r["passed"]]
    for r in failed:
        print(json.dumps(r, ensure_ascii=True))
    ran = sum(r["method"] == "run" for r in results)
    print(f"ADsP answers: {len(results) - len(failed)} passed / {len(results)} ({ran} executed, {len(results) - ran} re-solved)")
    raise SystemExit(bool(failed))
