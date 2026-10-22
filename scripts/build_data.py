"""UTF-8 Markdown manuscripts are the only source of published questions."""
import hashlib
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

# Each track keeps its manuscripts, scope file and review records in its own folder under source/.
TRACKS={"algorithm":{"label":"자료구조와 알고리즘","dir":"dsAlgo","scope":"scope.json"},
        "frontend":{"label":"프론트엔드","dir":"frontend","scope":"scope-frontend.json"},
        "ai":{"label":"AI 역량검사","dir":"AI역량검사","scope":"scope-ai.json"},
        "adsp":{"label":"ADsP","dir":"adsp","scope":"scope-adsp.json"}}
# Exam kinds that are answered mostly with multiple choice and feed the topic practice sets.
CHOICE_KINDS=("subject","written")

# Concept notes shown on the site: (id, button label, manuscript file in source/)
# A note without a manuscript file (None) shows a disabled placeholder button until its link is added.
NOTES=[("web-concepts","Web 개념","frontend/web개념 요약노트.md","frontend"),
       ("algorithm-concepts","자료구조 알고리즘 개념",None,"algorithm"),
       ("ai-concepts","AI 개념","AI역량검사/AI역량 개념 요약노트.md","ai")]

class ContentError(ValueError):
    pass

# The SW역량테스트 page is not an exam track. It lists solved problems in prediction order,
# each with an idea note and the Java solution, all read from source/SW역량테스트/.
SW_TEST_DIR="SW역량테스트"

def build_sw_test(source_root):
    base=source_root/SW_TEST_DIR
    config=json.loads((base/"problems.json").read_text(encoding="utf-8-sig"))
    tiers={t["id"] for t in config["tiers"]}
    problems, seen = [], set()
    for rank,item in enumerate(config["problems"],start=1):
        pid=item["id"]
        if pid in seen: raise ContentError(f"sw-test: duplicate {pid}")
        seen.add(pid)
        if item["tier"] not in tiers: raise ContentError(f"sw-test {pid}: unknown tier {item['tier']}")
        folder=base/pid
        # A problem may list several solutions under "variants"; otherwise idea.md and "file" are its one solution.
        variants=item.get("variants") or [{"id":"main","label":"풀이","idea":"idea.md","file":item["file"]}]
        if len({v["id"] for v in variants})!=len(variants): raise ContentError(f"sw-test {pid}: duplicate variant id")
        solved=[{"id":v["id"],"label":v["label"],
                 "idea":(folder/v["idea"]).read_text(encoding="utf-8-sig").strip()+"\n",
                 "code":(folder/v["file"]).read_text(encoding="utf-8-sig").rstrip("\n")+"\n"} for v in variants]
        problems.append({**{k:v for k,v in item.items() if k!="variants"},"rank":rank,"variants":solved})
    stray=sorted(p.name for p in base.iterdir() if p.is_dir() and p.name not in seen)
    if stray: raise ContentError(f"sw-test: folders without an entry in problems.json: {stray}")
    return {"title":config["title"],"description":config["description"],"disclaimer":config["disclaimer"],
            "tiers":config["tiers"],"problems":problems}

def track_of(exam):
    return exam.get("track","algorithm")

def load_scope(source_root,track):
    return json.loads((source_root/TRACKS[track]["dir"]/TRACKS[track]["scope"]).read_text(encoding="utf-8"))

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
    exams=[parse_exam(p.parent) for info in TRACKS.values() for p in sorted((source_root/info["dir"]).glob("*/exam.json"))]
    if not exams:
        raise ContentError("No exam manuscripts found")
    for exam in exams:
        (output_root/f"{exam['id']}.json").write_text(json.dumps(exam,ensure_ascii=False,indent=2)+"\n",encoding="utf-8",newline="\n")
    notes=[]
    for note_id,title,filename,note_track in NOTES:
        if filename is None:
            notes.append({"id":note_id,"title":title,"track":note_track,"file":None})
            continue
        text=(source_root/filename).read_text(encoding="utf-8-sig")
        (output_root/f"{note_id}.md").write_text(text,encoding="utf-8",newline="\n")
        notes.append({"id":note_id,"title":title,"track":note_track,"file":f"{note_id}.md"})
    for e in exams:
        if track_of(e) not in TRACKS: raise ContentError(f"{e['id']}: unknown track {track_of(e)}")
    summary=[{**{k:v for k,v in e.items() if k not in ("questions","defaultChoiceOrders","questionIds")},"track":track_of(e)} for e in exams]
    scope=load_scope(source_root,"algorithm")
    def topic_counts(t): return {k:sum(k in q.get("topics",[]) for e in exams if track_of(e)==t and e["kind"] in CHOICE_KINDS for q in e["questions"]) for k in load_scope(source_root,t)["topics"]}
    tracks={t:{"label":info["label"],"topics":load_scope(source_root,t)["topics"],"topicCounts":topic_counts(t)} for t,info in TRACKS.items() if any(track_of(e)==t for e in exams)}
    manifest={"exams":summary,"topics":scope["topics"],"tracks":tracks,"notes":notes}
    if (source_root/SW_TEST_DIR/"problems.json").exists():
        sw=build_sw_test(source_root)
        (output_root/"sw-test.json").write_text(json.dumps(sw,ensure_ascii=False,indent=2)+"\n",encoding="utf-8",newline="\n")
        manifest["swTest"]={"title":sw["title"],"file":"sw-test.json","count":len(sw["problems"])}
    (output_root/"manifest.json").write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+"\n",encoding="utf-8",newline="\n")
    return exams

if __name__=="__main__":
    exams=build_data()
    print(f"Built {len(exams)} exams / {sum(len(e['questions']) for e in exams)} questions")
