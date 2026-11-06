# 월말평가 Web 프로젝트 원고

| 폴더 | 내용 |
| --- | --- |
| `_master/` | 도메인과 단계를 만들어내는 마스터 원고. 고칠 때는 여기만 고친다 |
| `web-01/` | 캠핑 용품(Gear) 프로젝트 |
| `web-02/` | 도서(Book) 프로젝트 |

각 프로젝트 폴더의 `starter/`, `stages/`, `reference/`와 문서는 생성 결과이므로 직접 고치지 않는다.

```text
python scripts/author_backend_projects.py          # 생성
python scripts/author_backend_projects.py --check  # 최신 여부 검사
```

## 프로젝트 폴더 구성

| 경로 | 내용 |
| --- | --- |
| `reference/` | 모범답안 전체 프로젝트. STS에서 Maven 프로젝트로 가져와 실행해 볼 수 있다 |
| `verification.md` | STS에서 모범답안을 검증하는 절차와 결과표. 학습자에게 공개하지 않는다 |
| `starter/` | 모든 단계에서 공통으로 제공하는 읽기 전용 파일 |
| `stages/1`, `2`, `3` | 단계별 작성 대상 파일. `starter/` 위에 덮어서 합친다 |
| `project.json`, `stages.json`, `checklist.json` | 사이트 빌드가 읽는 메타데이터 |
| `requirements.md`, `flow.md` | 요구사항과 구현 흐름 |
| `review.json` | 검증 기록. 실행 검증은 사용자 STS 확인 전까지 미검증 |

작성 대상 영역은 `study-target:<id>:start`와 `study-target:<id>:end` 주석 사이다. 원본 수업 프로젝트와 제공 ZIP은 `.gitignore`로 제외하며 이 폴더에 복사하지 않는다.
