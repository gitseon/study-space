"""UTF-8 Markdown manuscripts are the only source of published questions."""
import hashlib
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

TRACKS={"algorithm":{"label":"자료구조와 알고리즘","scope":"scope.json"},"frontend":{"label":"프론트엔드","scope":"scope-frontend.json"}}

class ContentError(ValueError):
    pass

def track_of(exam):
    return exam.get("track","algorithm")

def load_scope(source_root,track):
    return json.loads((source_root/TRACKS[track]["scope"]).read_text(encoding="utf-8"))

def blocks(path):
    result, current, section, fenced = {}, None, None, False
    for line in path.read_text(encoding="utf-8-sig").splitlines():
        if line.startswith("```"):
            fenced = not fenced
        if not fenced and line.startswith("## question: "):
            key = line.removeprefix("## question: ").strip()
            if key in result:
                raise ContentError(f"{path.name}: duplicate {key}")
            current = result[key] = {"meta": []}
            section = "meta"
        elif not fenced and line.startswith("### "):
            section = line[4:].strip()
            if current is None or section in current:
                raise ContentError(f"{path.name}: invalid section {section}")
            current[section] = []
        elif current is not None:
            current[section].append(line)
    if fenced:
        raise ContentError(f"{path}: unclosed code fence")
    return {key: {s: "\n".join(lines).strip() for s, lines in value.items()} for key,value in result.items()}

def parse_exam(source_dir):
    exam = json.loads((source_dir/"exam.json").read_text(encoding="utf-8-sig"))
    raw, solutions = blocks(source_dir/"questions.md"), blocks(source_dir/"solutions.md")
    if set(raw) != set(solutions):
        raise ContentError(f"{exam['id']}: question/solution IDs differ")
    questions = []
    for qid, parts in raw.items():
        match = re.fullmatch(r"```json\s*([\s\S]+?)\s*```", parts["meta"])
        if not match:
            raise ContentError(f"{qid}: missing JSON metadata")
        q = json.loads(match[1])
        q.update(id=qid, stem=parts.get("stem",""), solution=solutions[qid].get("solution",""))
        q["choices"] = [{"id":key.split(": ",1)[1],"text":value} for key,value in parts.items() if key.startswith("choice: ")]
        q["choiceExplanations"] = {key.split(": ",1)[1]:value for key,value in solutions[qid].items() if key.startswith("choice-explanation: ")}
        if q.get("type") not in ("mc","short","essay","code") or not q["stem"] or not q["solution"]:
            raise ContentError(f"{qid}: missing type, stem or solution")
        if q["type"]=="mc":
            ids=[c["id"] for c in q["choices"]]
            if len(ids)!=4 or len(set(ids))!=4 or q.get("correctChoiceId") not in ids or set(ids)!=set(q["choiceExplanations"]):
                raise ContentError(f"{qid}: invalid choice/answer/explanation IDs")
        questions.append(q)
    exam["questions"]=questions
    exam["questionIds"]=[q["id"] for q in questions]
    exam["counts"]={t:sum(q["type"]==t for q in questions) for t in ("mc","short","essay","code")}
    exam["defaultChoiceOrders"]={q["id"]:[c["id"] for c in q["choices"]] for q in questions if q["type"]=="mc"}
    exam["contentVersion"]=hashlib.sha256(json.dumps(exam,ensure_ascii=False,sort_keys=True).encode()).hexdigest()[:16]
    return exam

def build_data(source_root=ROOT/"source", output_root=ROOT/"data"):
    output_root.mkdir(parents=True,exist_ok=True)
    exams=[parse_exam(p.parent) for p in sorted(source_root.glob("*/exam.json"))]
    if not exams:
        raise ContentError("No exam manuscripts found")
    for exam in exams:
        (output_root/f"{exam['id']}.json").write_text(json.dumps(exam,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    for e in exams:
        if track_of(e) not in TRACKS: raise ContentError(f"{e['id']}: unknown track {track_of(e)}")
    summary=[{**{k:v for k,v in e.items() if k not in ("questions","defaultChoiceOrders","questionIds")},"track":track_of(e)} for e in exams]
    scope=load_scope(source_root,"algorithm")
    def topic_counts(t): return {k:sum(k in q.get("topics",[]) for e in exams if track_of(e)==t and e["kind"]=="subject" for q in e["questions"]) for k in load_scope(source_root,t)["topics"]}
    tracks={t:{"label":info["label"],"topics":load_scope(source_root,t)["topics"],"topicCounts":topic_counts(t)} for t,info in TRACKS.items() if any(track_of(e)==t for e in exams)}
    (output_root/"manifest.json").write_text(json.dumps({"exams":summary,"topics":scope["topics"],"tracks":tracks},ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    return exams

if __name__=="__main__":
    exams=build_data()
    print(f"Built {len(exams)} exams / {sum(len(e['questions']) for e in exams)} questions")
