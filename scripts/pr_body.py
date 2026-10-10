"""Builds the content-change PR description from the generated reports (used by the open-pr workflow)."""
import itertools
import json
from build_data import ROOT, TRACKS, build_data, track_of


def load(path):
    target = ROOT / path
    return json.loads(target.read_text(encoding="utf-8")) if target.exists() else None


def longest_run(seq):
    return max((len(list(g)) for _, g in itertools.groupby(seq)), default=0)


def body():
    exams = build_data()
    bias = load("reports/bias.json") or {"metrics": {}, "issues": [], "unresolvedCount": "미확인"}
    frontend = load("reports/frontend-verification.json") or []
    code = load("reports/code-verification.json") or []
    lines = ["## 변경 내용", "", "문제은행의 범위와 문항을 변경했습니다. 아래 수치는 CI에서 만든 보고서에서 가져왔습니다.", "",
             "## 콘텐츠 변경 기록", "", "### 범위와 문항 수", ""]
    for track, info in TRACKS.items():
        mine = [e for e in exams if track_of(e) == track]
        if mine:
            total = sum(sum(e["counts"].values()) for e in mine)
            lines.append(f"- {info['label']}: {len(mine)}회차 {total}문항")
    lines += ["", "### 정답 분포와 최대 연속 길이", "", "| 회차 | 정답 번호 분포(1~4) | 최대 연속 |", "| --- | --- | --- |"]
    for e in exams:
        qs = [q for q in e["questions"] if q["type"] == "mc"]
        if qs:
            seq = [[c["id"] for c in q["choices"]].index(q["correctChoiceId"]) + 1 for q in qs]
            lines.append(f"| {e['id']} | {[seq.count(i) for i in (1, 2, 3, 4)]} | {longest_run(seq)} |")
    lines += ["", "### 길이 편향 검토", ""]
    for unit, m in bias["metrics"].items():
        if unit.startswith("bank"):
            lines.append(f"- {unit}: 가중 최장 {m['longest']:.2f}, 가중 최단 {m['shortest']:.2f}, 정답/오답 길이 비 {m['lengthRatio']:.2f}")
    lines.append(f"- 미검토 경고: {bias['unresolvedCount']}건 (전체 경고 {len(bias['issues'])}건)")
    executed = [r for r in frontend if r.get("method") == "executed"]
    reviewed = [r for r in frontend if r.get("method") == "review"]
    failed = [r for r in frontend + code if not r.get("passed")]
    lines += ["", "### 정답과 해설 검수", "",
              f"- 프론트엔드: 코드 실행 {len(executed)}문항, 재풀이 기록 {len(reviewed)}문항",
              f"- Java 구현형: {sum(1 for r in code if r.get('passed'))}/{len(code)} 케이스 통과",
              f"- 실패 항목: {len(failed)}건", ""]
    return "\n".join(lines)


if __name__ == "__main__":
    print(body())
