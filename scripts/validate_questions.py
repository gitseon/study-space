import json
import re
from collections import Counter
from build_data import ROOT, build_data, track_of, load_scope, TRACKS, NOTES, CHOICE_KINDS, SW_TEST_DIR

MAX_FRONTEND_LINE=38
FRONTEND_LANGS=("html","css","js")
PYTHON_LANGS=("python",)

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

def diagram_issues(text):
    """Mirror of assets/diagram.js parsing rules so broken diagrams fail the build."""
    issues=[]
    for kind,body in re.findall(r"```(tree|graph)\n([\s\S]*?)```",text):
        lines=[l.strip() for l in body.strip().splitlines() if l.strip()]
        if kind=="tree":
            tokens=" ".join(lines[1:] if lines and lines[0]=="indexed" else lines).split()
            if not tokens or tokens[0]=="-" or any(t!="-" and i>0 and tokens[(i+1)//2-1]=="-" for i,t in enumerate(tokens)):
                issues.append("diagram")
        else:
            edges=[re.fullmatch(r"(\S+)\s*(->|-)\s*(\S+)",l) for l in (lines[1:] if lines and lines[0]=="direction: up" else lines)]
            kinds={m.group(2) for m in edges if m}
            if not lines or len(kinds)>1 or any(m is None and " " in l for m,l in zip(edges,lines)):
                issues.append("diagram")
    return issues

def frontend_code_issues(text):
    """Frontend snippets use 2-space indentation and short lines so they fit a 360px screen."""
    issues=[]
    for lang,body in re.findall(r"```(\w*)\n([\s\S]*?)```",text):
        if lang not in FRONTEND_LANGS: continue
        for line in body.splitlines():
            indent=len(line)-len(line.lstrip(" "))
            if "\t" in line or indent%2: issues.append("indent")
            if len(line)>MAX_FRONTEND_LINE: issues.append("line-length")
    return issues

def python_code_issues(text):
    """Python snippets use 4-space indentation and the same 38-column limit as the frontend snippets."""
    issues=[]
    for lang,body in re.findall(r"```(\w*)\n([\s\S]*?)```",text):
        if lang not in PYTHON_LANGS: continue
        for line in body.splitlines():
            indent=len(line)-len(line.lstrip(" "))
            if "\t" in line or indent%4: issues.append("indent")
            if len(line)>MAX_FRONTEND_LINE: issues.append("line-length")
    return issues

def validate_bank(exams, scope, scopes=None):
    scopes=scopes or {"algorithm":scope}
    issues=[]; seen=set(); tag_seen={}
    def add(code,qid,message): issues.append({"code":code,"questionId":qid,"message":message,"severity":"error"})
    for exam in exams:
        track=track_of(exam); scope=scopes[track]
        composition=scope.get("composition",{}).get(exam["kind"])
        expected=composition or ({"mc":21,"short":9,"essay":2,"code":0} if exam["kind"]=="subject" else {"mc":0,"short":0,"essay":1,"code":3})
        if exam["counts"]!=expected: add("counts",exam["id"],str(exam["counts"]))
        if exam["kind"]=="practical":
            total=sum(r["points"] for q in exam["questions"] for r in q.get("rubric",[]))
            if total!=scope.get("practicalPoints",100): add("points",exam["id"],f"rubric points sum to {total}")
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
            if "tags" in scope:
                allowed=set(scope["tags"].get(q.get("group"),[]))
                if q.get("topics")!=[q.get("group")]: add("topic",qid,"topics must be the single group ID")
                if not q.get("tags") or set(q["tags"])-allowed: add("tags",qid,"tags missing or outside the group")
                tag_seen.setdefault(track,set()).update(q.get("tags",[]))
                for text in [q.get("stem",""),q.get("solution","")]+[c["text"] for c in q.get("choices",[])]+list(q.get("choiceExplanations",{}).values()):
                    for issue in frontend_code_issues(text)+python_code_issues(text): add(issue,qid,"Code snippet format")
            prose=[q.get("stem",""),q.get("solution",""),q.get("title","")]
            prose += [c["text"] for c in q.get("choices",[])] + list(q.get("choiceExplanations",{}).values())
            for text in prose:
                for issue in text_issues(text): add(issue,qid,"Invalid text quality")
            for issue in diagram_issues(q.get("stem","")): add(issue,qid,"Invalid tree or graph diagram")
            if q["type"]=="short" and (not q.get("acceptedAnswers") or q.get("normalization") not in ("none","trim","caseFold")):
                add("short",qid,"answer normalization missing")
            if q["type"] in ("essay","code"):
                rubric=q.get("rubric",[])
                if not rubric or not q.get("modelAnswer") or len({r["id"] for r in rubric})!=len(rubric) or any(r.get("points",0)<=0 for r in rubric):
                    add("rubric",qid,"missing model/rubric")
            if q["type"]=="code":
                needed=("language","checks") if q.get("language")=="python" else ("constraints","examples","reviewCases","language","complexity")
                for field in needed:
                    if not q.get(field): add("code",qid,field)
        if exam["kind"] in CHOICE_KINDS:
            if set(scope["topics"])-covered: add("coverage",exam["id"],str(set(scope["topics"])-covered))
            for group,counts in scope["groups"].items():
                actual=Counter(q["type"] for q in exam["questions"] if q.get("group")==group)
                if any(actual[t]!=n for t,n in counts.items()): add("blueprint",exam["id"],group)
    for track,found in tag_seen.items():
        needed={t for tags in scopes[track]["tags"].values() for t in tags}
        if needed-found: add("tag-coverage",track,str(sorted(needed-found)))
    return issues

def validate_notes(source_root=ROOT/"source"):
    """Concept notes must be readable UTF-8 prose with a title, headings and no stray punctuation runs."""
    issues=[]
    for note_id,_,filename,_ in NOTES:
        if filename is None:
            continue
        text=(source_root/filename).read_text(encoding="utf-8-sig")
        prose=re.sub(r"```[\s\S]*?```|`[^`]*`","",text)
        if not text.startswith("# "): issues.append({"code":"note-title","questionId":note_id,"message":"missing title","severity":"error"})
        if len(re.findall(r"(?m)^## ",text))<3: issues.append({"code":"note-structure","questionId":note_id,"message":"too few sections","severity":"error"})
        if chr(0xFFFD) in text: issues.append({"code":"encoding","questionId":note_id,"message":"broken characters","severity":"error"})
        if re.search(r"[·,]{2,}|\.{3,}",prose): issues.append({"code":"punctuation","questionId":note_id,"message":"punctuation run","severity":"error"})
        for code in set(frontend_code_issues(text)+python_code_issues(text)): issues.append({"code":code,"questionId":note_id,"message":"note code format","severity":"error"})
        fences=re.findall(r"(?m)^```",text)
        if len(fences)%2: issues.append({"code":"fence","questionId":note_id,"message":"unclosed code fence","severity":"error"})
    return issues

SW_IDEA_SECTIONS=("## 문제 요약","## 발상","## 놓치기 쉬운 점","## 복잡도와 검증")

def validate_sw_test(source_root=ROOT/"source"):
    """SW역량테스트 problems need every idea section, a runnable Java class, readable text and no private links."""
    base=source_root/SW_TEST_DIR
    if not (base/"problems.json").exists():
        return []
    issues=[]
    def add(code,item,message): issues.append({"code":code,"questionId":item,"message":message,"severity":"error"})
    config=json.loads((base/"problems.json").read_text(encoding="utf-8-sig"))
    tier_order=[t["id"] for t in config["tiers"]]
    last_tier=-1
    for item in config["problems"]:
        pid=item["id"]
        tier=tier_order.index(item["tier"]) if item["tier"] in tier_order else -1
        if tier<0: add("sw-tier",pid,"unknown tier")
        elif tier<last_tier: add("sw-order",pid,"problems must follow the tier order")
        last_tier=max(last_tier,tier)
        for field in ("title","type","summary","basis","file"):
            if not str(item.get(field,"")).strip(): add("sw-field",pid,f"missing {field}")
        idea_path,code_path=base/pid/"idea.md",base/pid/item.get("file","")
        if not idea_path.is_file() or not code_path.is_file():
            add("sw-file",pid,"missing idea.md or code file"); continue
        idea=idea_path.read_text(encoding="utf-8-sig"); code=code_path.read_text(encoding="utf-8-sig")
        for heading in SW_IDEA_SECTIONS:
            if not re.search(r"(?m)^"+re.escape(heading)+r"\s*$",idea): add("sw-section",pid,f"missing {heading}")
        if len(re.findall(r"(?m)^```",idea))%2: add("fence",pid,"unclosed code fence")
        prose=re.sub(r"```[\s\S]*?```|`[^`]*`","",idea+" "+item.get("summary","")+" "+item.get("basis",""))
        if re.search(r"[·,]{2,}|\.{3,}",prose): add("punctuation",pid,"punctuation run")
        for text in (idea,code,json.dumps(item,ensure_ascii=False)):
            if chr(0xFFFD) in text: add("encoding",pid,"broken characters")
            if re.search(r"notion|\.pdf",text,re.I): add("sw-private",pid,"private link or course file name")
        if not re.search(r"public\s+class\s+"+re.escape(code_path.stem)+r"\b",code) or "static void main" not in code:
            add("sw-code",pid,"code must declare the public class and main")
    return issues

if __name__=="__main__":
    exams=build_data(); scopes={t:load_scope(ROOT/"source",t) for t in TRACKS if any(track_of(e)==t for e in exams)}
    issues=validate_bank(exams,scopes["algorithm"],scopes)+validate_notes()+validate_sw_test()
    for item in issues: print(json.dumps(item,ensure_ascii=True))
    print(f"Content validation: {len(issues)} errors")
    raise SystemExit(bool(issues))
