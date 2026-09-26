## question: monthly-01-q01
```json
{
  "title": "카드 대결의 승리 순서",
  "topics": [
    "enumeration",
    "recursion"
  ],
  "type": "code",
  "group": "code",
  "modelAnswer": "```java\nimport java.util.*;\npublic class Main {\n  static int n; static int[] a,b; static boolean[] used; static long wins;\n  static void dfs(int d,int score){\n    if(d==n){if(score>0)wins++;return;}\n    for(int i=0;i<n;i++)if(!used[i]){\n      used[i]=true;int gain=a[d]+b[i];\n      dfs(d+1,score+(b[i]>a[d]?gain:-gain));used[i]=false;\n    }\n  }\n  public static void main(String[] args){\n    Scanner s=new Scanner(System.in);n=s.nextInt();a=new int[n];b=new int[n];used=new boolean[n];\n    for(int i=0;i<n;i++)a[i]=s.nextInt();\n    for(int i=0;i<n;i++)b[i]=s.nextInt();\n    dfs(0,0);System.out.println(wins);\n  }\n}\n```",
  "rubric": [
    {
      "id": "r0",
      "criterion": "민호의 모든 순열을 만든다",
      "points": 1
    },
    {
      "id": "r1",
      "criterion": "라운드 승자에게 두 값의 합을 준다",
      "points": 1
    },
    {
      "id": "r2",
      "criterion": "점수 차이를 정확히 계산한다",
      "points": 1
    },
    {
      "id": "r3",
      "criterion": "사용 표시를 복원한다",
      "points": 1
    },
    {
      "id": "r4",
      "criterion": "동점을 승리에서 제외한다",
      "points": 1
    }
  ],
  "language": "java",
  "constraints": "1 ≤ N ≤ 8. 카드 값은 1 이상 100 이하이며 2N개의 값은 모두 다르다.",
  "examples": [
    {
      "input": "2\n1 4\n2 3\n",
      "output": "0"
    }
  ],
  "reviewCases": [
    {
      "input": "1\n1\n2\n",
      "output": "1"
    },
    {
      "input": "2\n1 2\n3 4\n",
      "output": "2"
    }
  ],
  "complexity": "시간 O(N×N!), 추가 공간 O(N)",
  "id": "monthly-01-q01",
  "revision": 1,
  "sourceRefs": [
    "https://app.notion.com/p/3e6db04aea0e80fab638fd097767ffa2"
  ],
  "difficulty": 1
}
```
### stem
서로 다른 카드 2N장을 두 사람이 N장씩 가진다. 수아의 순서는 입력대로 고정되고 민호는 자신의 카드 순서를 바꾼다. 매 라운드 더 큰 카드를 낸 사람이 두 카드 값의 합을 얻는다. 민호의 최종 점수가 더 큰 순서의 수를 구하시오. 동점은 승리로 세지 않는다.

입력
첫 줄 N을 입력한다. 다음 두 줄에 수아와 민호의 카드 N개를 각각 입력한다.

출력
민호가 이기는 순열의 개수를 출력한다.

제약
1 ≤ N ≤ 8. 카드 값은 1 이상 100 이하이며 2N개의 값은 모두 다르다.


## question: monthly-01-q02
```json
{
  "title": "격자 탐사 로봇",
  "topics": [
    "graph"
  ],
  "type": "code",
  "group": "code",
  "modelAnswer": "```java\nimport java.util.*;\npublic class Main {\n  public static void main(String[] args){\n    Scanner s=new Scanner(System.in);int R=s.nextInt(),C=s.nextInt(),r=0,c=0;char[][] g=new char[R][];\n    for(int i=0;i<R;i++){g[i]=s.next().toCharArray();for(int j=0;j<C;j++)if(g[i][j]=='S'){r=i;c=j;}}\n    int[] dr={-1,1,0,0},dc={0,0,-1,1};String dirs=\"UDLR\";int d=0;\n    for(char ch:s.next().toCharArray()){\n      d=dirs.indexOf(ch);int nr=r+dr[d],nc=c+dc[d];\n      if(nr>=0&&nr<R&&nc>=0&&nc<C&&g[nr][nc]!='#'){r=nr;c=nc;}\n    }\n    System.out.println(r+\" \"+c+\" \"+dirs.charAt(d));\n  }\n}\n```",
  "rubric": [
    {
      "id": "r0",
      "criterion": "시작 위치를 찾는다",
      "points": 1
    },
    {
      "id": "r1",
      "criterion": "이동 실패 때도 방향을 바꾼다",
      "points": 1
    },
    {
      "id": "r2",
      "criterion": "경계를 먼저 확인한다",
      "points": 1
    },
    {
      "id": "r3",
      "criterion": "벽을 통과하지 않는다",
      "points": 1
    },
    {
      "id": "r4",
      "criterion": "0번 좌표를 출력한다",
      "points": 1
    }
  ],
  "language": "java",
  "constraints": "1 ≤ R,C ≤ 30. S는 하나이며 명령 수는 1 이상 1000 이하이다.",
  "examples": [
    {
      "input": "2 3\nS#.\n...\nRDD\n",
      "output": "1 0 D"
    }
  ],
  "reviewCases": [
    {
      "input": "1 1\nS\nR\n",
      "output": "0 0 R"
    },
    {
      "input": "2 2\nS.\n..\nRDLU\n",
      "output": "0 0 U"
    }
  ],
  "complexity": "시간 O(RC+M), 공간 O(RC)",
  "id": "monthly-01-q02",
  "revision": 1,
  "sourceRefs": [
    "https://app.notion.com/p/3e6db04aea0e80fab638fd097767ffa2"
  ],
  "difficulty": 1
}
```
### stem
R행 C열의 지도에서 S는 시작점이고 #은 벽이다. 나머지는 평지 . 이다. 로봇은 처음 북쪽을 본다. U D L R 명령은 해당 방향을 본 뒤 한 칸 이동을 시도한다. 지도 밖이나 벽이면 머물지만 방향은 바뀐다. 최종 위치와 방향을 구하시오.

입력
R C 다음 R줄 지도를 입력한다. 마지막 줄은 공백 없는 명령 문자열이다.

출력
최종 행과 열을 0번 기준으로 출력하고 방향 문자 U D L R을 공백으로 구분해 출력한다.

제약
1 ≤ R,C ≤ 30. S는 하나이며 명령 수는 1 이상 1000 이하이다.


## question: monthly-01-q03
```json
{
  "title": "한 번의 동시 충돌",
  "topics": [
    "graph"
  ],
  "type": "code",
  "group": "code",
  "modelAnswer": "```java\nimport java.util.*;\npublic class Main {\n  public static void main(String[] args){\n    Scanner s=new Scanner(System.in);int n=s.nextInt();int[] dx={0,0,-1,1},dy={1,-1,0,0};\n    Map<String,int[]> groups=new HashMap<>();\n    for(int i=0;i<n;i++){\n      int x=s.nextInt(),y=s.nextInt(),d=s.nextInt(),e=s.nextInt();\n      String key=(x+dx[d])+\":\"+(y+dy[d]);\n      int[] v=groups.computeIfAbsent(key,k->new int[2]);v[0]++;v[1]+=e;\n    }\n    int answer=0;for(int[] v:groups.values())if(v[0]>=2)answer+=v[1];\n    System.out.println(answer);\n  }\n}\n```",
  "rubric": [
    {
      "id": "r0",
      "criterion": "이동 후 위치를 사용한다",
      "points": 1
    },
    {
      "id": "r1",
      "criterion": "이동 시점을 통일한다",
      "points": 1
    },
    {
      "id": "r2",
      "criterion": "위치별 개수를 센다",
      "points": 1
    },
    {
      "id": "r3",
      "criterion": "다중 충돌 에너지를 모두 더한다",
      "points": 1
    },
    {
      "id": "r4",
      "criterion": "이동 중 교차를 구분한다",
      "points": 1
    }
  ],
  "language": "java",
  "constraints": "1 ≤ N ≤ 1000. 초기 좌표는 서로 다르다. |x|,|y| ≤ 1000이며 1 ≤ e ≤ 1000이다.",
  "examples": [
    {
      "input": "3\n-1 0 3 2\n1 0 2 3\n0 1 1 5\n",
      "output": "10"
    }
  ],
  "reviewCases": [
    {
      "input": "2\n0 0 3 4\n1 0 2 7\n",
      "output": "0"
    },
    {
      "input": "1\n0 0 0 9\n",
      "output": "0"
    }
  ],
  "complexity": "평균 시간 O(N), 공간 O(N)",
  "id": "monthly-01-q03",
  "revision": 1,
  "sourceRefs": [
    "https://app.notion.com/p/3e6db04aea0e80fab638fd097767ffa2"
  ],
  "difficulty": 1
}
```
### stem
입자 N개가 정수 좌표에서 상하좌우 중 한 방향으로 한 칸 이동한다. 동시에 한 번 이동한 후 같은 위치에 2개 이상 모이면 모두 소멸한다. 소멸 에너지 합을 구하시오. 이동 도중 서로 지나친 경우는 충돌로 세지 않는다.

입력
N 다음 N줄에 x y d e를 입력한다. d는 0 위, 1 아래, 2 왼쪽, 3 오른쪽이다. 위는 y 증가 방향이다.

출력
소멸 에너지의 합을 출력한다.

제약
1 ≤ N ≤ 1000. 초기 좌표는 서로 다르다. |x|,|y| ≤ 1000이며 1 ≤ e ≤ 1000이다.


## question: monthly-01-q04
```json
{
  "title": "탐색과 의존 관계 설명",
  "topics": [
    "traversal",
    "graph",
    "topology"
  ],
  "group": "essay",
  "modelAnswer": "BFS는 큐로 먼저 발견한 정점부터 처리해 거리순으로 확장한다. DFS는 재귀 호출 스택이나 명시적 스택으로 한 경로를 깊게 방문한 뒤 돌아온다.\n\n인접 행렬은 정점마다 V개 칸을 확인해 전체 O(V²)이다. 인접 리스트는 정점과 실제 간선을 확인해 O(V+E)다.\n\n위상정렬 대상은 방향 그래프이고 사이클이 없어야 한다. 방향은 선후 관계를 나타내고 사이클은 먼저 수행해야 하는 조건을 모순되게 만든다.",
  "rubric": [
    {
      "id": "r0",
      "criterion": "BFS와 큐를 설명한다",
      "points": 1
    },
    {
      "id": "r1",
      "criterion": "DFS와 스택을 설명한다",
      "points": 1
    },
    {
      "id": "r2",
      "criterion": "행렬의 O(V²) 근거를 설명한다",
      "points": 1
    },
    {
      "id": "r3",
      "criterion": "리스트의 O(V+E) 근거를 설명한다",
      "points": 1
    },
    {
      "id": "r4",
      "criterion": "방향성의 필요성을 설명한다",
      "points": 1
    },
    {
      "id": "r5",
      "criterion": "사이클의 모순을 설명한다",
      "points": 1
    }
  ],
  "type": "essay",
  "id": "monthly-01-q04",
  "revision": 1,
  "sourceRefs": [
    "https://app.notion.com/p/3e6db04aea0e80fab638fd097767ffa2"
  ],
  "difficulty": 1
}
```
### stem
BFS와 DFS의 진행 방식 및 핵심 자료구조를 비교하시오. 인접 행렬과 인접 리스트의 전체 탐색 시간과 이유를 설명하고 위상정렬의 조건 두 가지를 쓰시오.

