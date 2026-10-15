"""Executes the checks behind the AI track answers.

Written exam: questions that compute a value are run from source/AI역량검사/ai-written-checks.json and the
printed value must appear in the correct choice. The other questions need a re-solve record in ai-reviews.json.
Practical exam: the model answer must pass every check, and the empty starter must fail them.
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

AI_DIR = ROOT / "source" / "AI역량검사"
NOISE = re.compile(r"[\s,$_\\{}]")


def normalize(text):
    return NOISE.sub("", text)


def run_python(code, timeout=120):
    env = dict(os.environ, MPLBACKEND="Agg", PYTHONHASHSEED="0", PYTHONIOENCODING="utf-8")
    with tempfile.TemporaryDirectory() as tmp:
        (Path(tmp) / "snippet.py").write_text(code, encoding="utf-8")
        run = subprocess.run([sys.executable, "snippet.py"], cwd=tmp, env=env, capture_output=True,
                             text=True, encoding="utf-8", timeout=timeout)
    return run


def verify_written(exam, checks, reviews):
    results = []
    by_id = {q["id"]: q for q in exam["questions"]}
    done = set()
    for check in checks:
        q = by_id.get(check["questionId"])
        record = {"questionId": check["questionId"], "revision": check["revision"], "method": "run"}
        if q is None or q["revision"] != check["revision"]:
            record.update(passed=False, detail="question or revision does not match the check")
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
        done.add(check["questionId"])
    for q in exam["questions"]:
        if q["id"] in done:
            continue
        review = next((r for r in reviews if r["questionId"] == q["id"] and r["revision"] == q["revision"]), None)
        results.append({"questionId": q["id"], "revision": q["revision"], "method": "review", "passed": bool(review),
                        "detail": review["note"] if review else "no re-solve record for this revision"})
    return results


def python_blocks(text):
    return re.findall(r"```python\n([\s\S]*?)```", text)


def verify_practical(exam):
    results = []
    for q in exam["questions"]:
        blocks = python_blocks(q["stem"])
        answer = python_blocks(q["modelAnswer"])
        record = {"questionId": q["id"], "revision": q["revision"], "method": "run"}
        if len(blocks) < 2 or not answer:
            record.update(passed=False, detail="stem needs a setup block and a starter block, and the model answer a code block")
            results.append(record)
            continue
        setup, starter = blocks[0], blocks[1]
        checks = "\n".join(q["checks"])
        model = run_python(f"{setup}\n{answer[0]}\n{checks}\n")
        empty = run_python(f"{setup}\n{starter}\n{checks}\n")
        again = run_python(f"{setup}\n{answer[0]}\n{checks}\n")
        record.update(modelAnswerPassed=model.returncode == 0, starterRejected=empty.returncode != 0,
                      repeatable=again.returncode == 0)
        record["passed"] = all(record[k] for k in ("modelAnswerPassed", "starterRejected", "repeatable"))
        if model.returncode:
            record["detail"] = model.stderr[-400:]
        results.append(record)
    return results


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--report", default="reports/ai-verification.json")
    args = parser.parse_args()
    exams = [e for e in build_data() if e.get("track") == "ai"]
    checks = json.loads((AI_DIR / "ai-written-checks.json").read_text(encoding="utf-8"))
    reviews = json.loads((AI_DIR / "ai-reviews.json").read_text(encoding="utf-8"))
    results = []
    for exam in exams:
        results += verify_written(exam, checks, reviews) if exam["kind"] == "written" else verify_practical(exam)
    target = ROOT / args.report
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(json.dumps(results, ensure_ascii=False, indent=2), encoding="utf-8")
    failed = [r for r in results if not r["passed"]]
    for r in failed:
        print(json.dumps(r, ensure_ascii=True))
    ran = sum(r["method"] == "run" for r in results)
    print(f"AI answers: {len(results) - len(failed)} passed / {len(results)} ({ran} executed, {len(results) - ran} re-solved)")
    raise SystemExit(bool(failed))
