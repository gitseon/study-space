import argparse
import json
import re
import subprocess
import tempfile
from pathlib import Path
from build_data import ROOT, build_data

def java_source(model_answer):
    match=re.search(r"```java\n([\s\S]*?)```",model_answer)
    if not match: raise ValueError("modelAnswer has no java block")
    return match.group(1)

def normalize(output):
    return "\n".join(line.rstrip() for line in output.strip().splitlines())

def verify_question(q, timeout=10):
    results=[]
    with tempfile.TemporaryDirectory() as tmp:
        (Path(tmp)/"Main.java").write_text(java_source(q["modelAnswer"]),encoding="utf-8")
        compiled=subprocess.run(["javac","-encoding","UTF-8","Main.java"],cwd=tmp,capture_output=True,text=True)
        if compiled.returncode:
            return [{"questionId":q["id"],"case":"compile","passed":False,"detail":compiled.stderr[-500:]}]
        cases=[("example",c) for c in q["examples"]]+[("review",c) for c in q["reviewCases"]]
        for index,(kind,case) in enumerate(cases):
            run=subprocess.run(["java","-cp",tmp,"Main"],input=case["input"],capture_output=True,text=True,timeout=timeout)
            actual=normalize(run.stdout); expected=normalize(case["output"])
            results.append({"questionId":q["id"],"revision":q["revision"],"case":f"{kind}-{index}","passed":run.returncode==0 and actual==expected,
                "expected":expected,"actual":actual if actual==expected else actual[:200]})
    return results

if __name__=="__main__":
    parser=argparse.ArgumentParser(); parser.add_argument("--report",default="reports/code-verification.json"); args=parser.parse_args()
    results=[r for exam in build_data() for q in exam["questions"] if q["type"]=="code" for r in verify_question(q)]
    target=ROOT/args.report; target.parent.mkdir(parents=True,exist_ok=True)
    target.write_text(json.dumps(results,ensure_ascii=False,indent=2),encoding="utf-8")
    failed=[r for r in results if not r["passed"]]
    for r in failed: print(json.dumps(r,ensure_ascii=True))
    print(f"Code answers: {len(results)-len(failed)} passed / {len(results)} cases")
    raise SystemExit(bool(failed))
