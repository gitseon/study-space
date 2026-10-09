import argparse
import hashlib
import json
import math
import re
import statistics
import unicodedata
from collections import Counter
from build_data import ROOT, build_data, track_of, load_scope, TRACKS

def valid_sequence(seq, aggregate=False):
    n=len(seq)
    if n>=12:
        lo,hi=(14,18) if aggregate and n==63 else ((4,7) if n==21 else (n//4-1,math.ceil(n/4)+1))
        counts=Counter(seq)
        if any(not lo<=counts[i]<=hi for i in range(4)): return False
    if aggregate: return True
    if any(seq[i]==seq[i+1]==seq[i+2] for i in range(n-2)): return False
    for size,repeats in [(2,3),(3,2),(4,2)]:
        for i in range(n-size*repeats+1):
            if seq[i:i+size]*repeats==seq[i:i+size*repeats]: return False
    return True

TEX_SYMBOLS={"Theta":"Θ","Omega":"Ω","times":"×","le":"≤","ge":"≥","cdot":"·","log":"log","max":"max","min":"min"}

def tex_display(tex):
    tex=re.sub(r"\\frac\{([^{}]*)\}\{([^{}]*)\}",r"\1/\2",tex)
    tex=re.sub(r"\\([A-Za-z]+)",lambda m:TEX_SYMBOLS.get(m.group(1),""),tex)
    return re.sub(r"[{}^_\\]","",tex)

def visible_length(text):
    text=re.sub(r"\$([^$]*)\$",lambda m:tex_display(m.group(1)),text)
    text=re.sub(r"```\w*\n?|`|\*\*|__","",text)
    return len(re.sub(r"\s+"," ",unicodedata.normalize("NFC",text)).strip())

def length_metrics(q):
    lengths=[visible_length(c["text"]) for c in q["choices"]]
    index=next(i for i,c in enumerate(q["choices"]) if c["id"]==q["correctChoiceId"])
    correct=lengths[index]; top=max(lengths); low=min(lengths)
    return {"id":q["id"],"lengths":lengths,"correctLength":correct,"wrongMean":statistics.mean([v for i,v in enumerate(lengths) if i!=index]),
        "ratio":correct/max(1,statistics.median(lengths)),"spread":top/max(1,low),
        "longestWeight":1/lengths.count(top) if correct==top else 0,
        "shortestWeight":1/lengths.count(low) if correct==low else 0,
        "uniqueLongest":correct==top and lengths.count(top)==1,"uniqueShortest":correct==low and lengths.count(low)==1,
        "lines":[c["text"].count("\n")+1 for c in q["choices"]]}

def aggregate_metrics(qs):
    ms=[length_metrics(q) for q in qs]
    return {"n":len(qs),"sampleStatus":"small" if len(qs)<20 else "regular",
        "longest":statistics.mean(m["longestWeight"] for m in ms) if ms else 0,
        "shortest":statistics.mean(m["shortestWeight"] for m in ms) if ms else 0,
        "lengthRatio":sum(m["correctLength"] for m in ms)/max(1,sum(m["wrongMean"] for m in ms)),
        "uniqueLongest":sum(m["uniqueLongest"] for m in ms),"uniqueShortest":sum(m["uniqueShortest"] for m in ms)}

def content_hash(value):
    return hashlib.sha256(json.dumps(value,ensure_ascii=False,sort_keys=True).encode()).hexdigest()[:16]

def audit_bias(exams,reviews):
    issues=[]; metrics={}; allqs=[]; allseq=[]
    def issue(code,unit,payload,severity="warning"):
        digest=content_hash(payload)
        reviewed=severity=="warning" and any(r.get("unit")==unit and r.get("code")==code and r.get("contentHash")==digest and r.get("reason") and r.get("reviewer") and r.get("reviewedAt") for r in reviews)
        issues.append({"code":code,"unit":unit,"contentHash":digest,"severity":severity,"reviewed":reviewed})
    def group(unit,qs):
        m=aggregate_metrics(qs); metrics[unit]=m
        if len(qs)>=20:
            for key in ("longest","shortest"):
                if not .15<=m[key]<=.35: issue(key,unit,qs)
            if not .85<=m["lengthRatio"]<=1.15: issue("lengthRatio",unit,qs)
    banks={}
    for exam in exams:
        qs=[q for q in exam["questions"] if q["type"]=="mc"]
        if not qs: continue
        seq=[next(i for i,c in enumerate(q["choices"]) if c["id"]==q["correctChoiceId"]) for q in qs]
        if not valid_sequence(seq): issue("answer-pattern",exam["id"],qs,"error")
        group(exam["id"],qs); metrics[exam["id"]]["counts"]=[seq.count(i) for i in range(4)]
        metrics[exam["id"]]["questions"]=[length_metrics(q) for q in qs]
        for q in qs:
            m=length_metrics(q)
            if not .65<=m["ratio"]<=1.35: issue("answer-length",q["id"],q)
            if m["spread"]>2: issue("choice-spread",q["id"],q)
        bank=banks.setdefault(track_of(exam),{"qs":[],"seq":[],"sets":{}})
        bank["qs"].extend(qs); bank["seq"].extend(seq)
        if exam["kind"]=="subject":
            for q,pos in zip(qs,seq):
                for topic in q.get("topics",[]): bank["sets"].setdefault(topic,[]).append((q,pos))
    for track,bank in banks.items():
        unit="bank" if track=="algorithm" else f"bank:{track}"
        group(unit,bank["qs"]); metrics[unit]["counts"]=[bank["seq"].count(i) for i in range(4)]
        if not valid_sequence(bank["seq"],True): issue("bank-distribution",unit,bank["qs"],"error")
        # Topic practice replays the same questions in exam order, so its answer sequence follows the same rules.
        for topic,items in bank["sets"].items():
            if not valid_sequence([pos for _,pos in items]):
                issue("topic-sequence",f"topic:{track}:{topic}",[q for q,_ in items],"error")
    return {"metrics":metrics,"issues":issues,"unresolvedCount":sum(not i["reviewed"] for i in issues)}

if __name__=="__main__":
    parser=argparse.ArgumentParser(); parser.add_argument("--strict",action="store_true"); parser.add_argument("--report",default="reports/bias.json"); args=parser.parse_args()
    reviews=json.loads((ROOT/"source/authoring-reviews.json").read_text(encoding="utf-8"))
    report=audit_bias(build_data(),reviews)
    target=ROOT/args.report; target.parent.mkdir(parents=True,exist_ok=True)
    target.write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding="utf-8")
    print(f"Bias audit: {report['unresolvedCount']} unresolved / {len(report['issues'])} findings")
    raise SystemExit(args.strict and report["unresolvedCount"]>0)
