import json
import re
from collections import Counter
from build_data import ROOT, build_data

def text_issues(text):
    prose=re.sub(r"```[\s\S]*?```|`[^`]*`","",text)
    issues=[]
    if prose.count("$")%2 or "$$" in prose:
        issues.append("math")
    prose=re.sub(r"\$[^$]*\$","",prose)
    if "\ufffd" in text or re.search(r"[\ud800-\udfff]",text):
        issues.append("encoding")
    for line in prose.splitlines():
        if re.search(r"[·,]{2,}|\.{3,}",line) or line.count("·")>2 or line.count(",")>4:
            issues.append("punctuation")
    return issues

def validate_bank(exams, scope):
    issues=[]; seen=set()
    def add(code,qid,message): issues.append({"code":code,"questionId":qid,"message":message,"severity":"error"})
    for exam in exams:
        expected={"mc":21,"short":9,"essay":2,"code":0} if exam["kind"]=="subject" else {"mc":0,"short":0,"essay":1,"code":3}
        if exam["counts"]!=expected: add("counts",exam["id"],str(exam["counts"]))
        covered=set()
        for q in exam["questions"]:
            qid=q["id"]
            if qid in seen: add("duplicate",qid,"duplicate bank ID")
            seen.add(qid); covered.update(q.get("topics",[]))
            for field in ("title","stem","solution"):
                if not isinstance(q.get(field),str) or not q[field].strip(): add("required",qid,field)
            for field in ("revision","difficulty"):
                if not isinstance(q.get(field),int) or q[field]<1: add("required",qid,field)
            if not q.get("sourceRefs") or not q.get("topics"): add("required",qid,"sourceRefs/topics")
            if set(q.get("topics",[]))-set(scope["topics"]): add("topic",qid,"unknown topic")
            prose=[q.get("stem",""),q.get("solution",""),q.get("title","")]
            prose += [c["text"] for c in q.get("choices",[])] + list(q.get("choiceExplanations",{}).values())
            for text in prose:
                for issue in text_issues(text): add(issue,qid,"Invalid text quality")
            if q["type"]=="short" and (not q.get("acceptedAnswers") or q.get("normalization") not in ("none","trim","caseFold")):
                add("short",qid,"answer normalization missing")
            if q["type"] in ("essay","code"):
                rubric=q.get("rubric",[])
                if not rubric or not q.get("modelAnswer") or len({r["id"] for r in rubric})!=len(rubric) or any(r.get("points",0)<=0 for r in rubric):
                    add("rubric",qid,"missing model/rubric")
            if q["type"]=="code":
                for field in ("constraints","examples","reviewCases","language","complexity"):
                    if not q.get(field): add("code",qid,field)
        if exam["kind"]=="subject":
            if set(scope["topics"])-covered: add("coverage",exam["id"],str(set(scope["topics"])-covered))
            for group,counts in scope["groups"].items():
                actual=Counter(q["type"] for q in exam["questions"] if q.get("group")==group)
                if any(actual[t]!=n for t,n in counts.items()): add("blueprint",exam["id"],group)
    return issues

if __name__=="__main__":
    exams=build_data(); scope=json.loads((ROOT/"source/scope.json").read_text(encoding="utf-8"))
    issues=validate_bank(exams,scope)
    for item in issues: print(json.dumps(item,ensure_ascii=True))
    print(f"Content validation: {len(issues)} errors")
    raise SystemExit(bool(issues))
