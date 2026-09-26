## question: monthly-03-q01
```json
{
  "title": "선후 조건을 지키는 작업 순서",
  "topics": [
    "enumeration",
    "topology"
  ],
  "type": "code",
  "group": "code",
  "modelAnswer": "```java\nimport java.util.*;\npublic class Main {\n  static int n;static int[] pre;\n  static long dfs(int mask){\n    if(mask==(1<<n)-1)return 1;\n    long count=0;\n    for(int i=0;i<n;i++)if((mask&(1<<i))==0&&(mask&pre[i])==pre[i])count+=dfs(mask|(1<<i));\n    return count;\n  }\n  public static void main(String[] args){\n    Scanner s=new Scanner(System.in);n=s.nextInt();int m=s.nextInt();pre=new int[n];\n    while(m-->0){int a=s.nextInt(),b=s.nextInt();pre[b]|=1<<a;}\n    System.out.println(dfs(0));\n  }\n}\n```",
  "rubric": [
    {
      "id": "r0",
      "criterion": "중복 작업을 막는다",
      "points": 1
    },
    {
      "id": "r1",
      "criterion": "모든 선행 작업을 검사한다",
      "points": 1
    },
    {
      "id": "r2",
      "criterion": "완성 순서만 센다",
      "points": 1
    },
    {
      "id": "r3",
      "criterion": "사이클에서 0을 반환한다",
      "points": 1
    },
    {
      "id": "r4",
      "criterion": "가능한 모든 분기를 탐색한다",
      "points": 1
    }
  ],
  "language": "java",
  "constraints": "1 ≤ N ≤ 8. 0 ≤ M ≤ N(N-1). 중복 간선과 자기 루프는 없다.",
  "examples": [
    {
      "input": "3 2\n0 2\n1 2\n",
      "output": "2"
    }
  ],
  "reviewCases": [
    {
      "input": "2 2\n0 1\n1 0\n",
      "output": "0"
    },
    {
      "input": "3 0\n",
      "output": "6"
    }
  ],
  "complexity": "최악 시간 O(N×N!), 공간 O(N)",
  "id": "monthly-03-q01",
  "revision": 1,
  "sourceRefs": [
    "https://app.notion.com/p/3e6db04aea0e80fab638fd097767ffa2"
  ],
  "difficulty": 1
}
```
### stem
작업 번호는 0부터 N-1이다. 조건 a b는 a가 b보다 먼저 와야 한다는 뜻이다. 모든 작업을 한 번씩 수행하는 순서 중 조건을 만족하는 개수를 구하시오. 사이클이 있으면 0이다.

입력
N M 다음 M줄에 a b를 입력한다.

출력
가능한 순서 수를 출력한다.

제약
1 ≤ N ≤ 8. 0 ≤ M ≤ N(N-1). 중복 간선과 자기 루프는 없다.


## question: monthly-03-q02
```json
{
  "title": "한 번만 수집하는 탐사",
  "topics": [
    "graph"
  ],
  "type": "code",
  "group": "code",
  "modelAnswer": "```java\nimport java.util.*;\npublic class Main {\n  public static void main(String[] args){\n    Scanner s=new Scanner(System.in);int R=s.nextInt(),C=s.nextInt(),r=0,c=0,count=0;char[][] g=new char[R][];\n    for(int i=0;i<R;i++){g[i]=s.next().toCharArray();for(int j=0;j<C;j++)if(g[i][j]=='S'){r=i;c=j;}}\n    int[] dr={-1,1,0,0},dc={0,0,-1,1};String dirs=\"UDLR\";\n    for(char ch:s.next().toCharArray()){\n      int d=dirs.indexOf(ch),nr=r+dr[d],nc=c+dc[d];\n      if(nr>=0&&nr<R&&nc>=0&&nc<C&&g[nr][nc]!='#'){\n        r=nr;c=nc;if(g[r][c]=='*'){count++;g[r][c]='.';}\n      }\n    }\n    System.out.println(count);\n  }\n}\n```",
  "rubric": [
    {
      "id": "r0",
      "criterion": "시작 위치를 찾는다",
      "points": 1
    },
    {
      "id": "r1",
      "criterion": "경계와 벽을 검사한다",
      "points": 1
    },
    {
      "id": "r2",
      "criterion": "이동 후 수집한다",
      "points": 1
    },
    {
      "id": "r3",
      "criterion": "수집 후 지도를 바꾼다",
      "points": 1
    },
    {
      "id": "r4",
      "criterion": "재방문을 중복 집계하지 않는다",
      "points": 1
    }
  ],
  "language": "java",
  "constraints": "1 ≤ R,C ≤ 30. S는 하나다. 나머지 칸은 . 또는 # 또는 *다. 명령 수는 1 이상 1000 이하이다.",
  "examples": [
    {
      "input": "2 3\nS*.\n.#*\nRRDLLR\n",
      "output": "2"
    }
  ],
  "reviewCases": [
    {
      "input": "1 2\nS*\nRLR\n",
      "output": "1"
    },
    {
      "input": "1 3\nS#*\nRR\n",
      "output": "0"
    }
  ],
  "complexity": "시간 O(RC+M), 공간 O(RC)",
  "id": "monthly-03-q02",
  "revision": 1,
  "sourceRefs": [
    "https://app.notion.com/p/3e6db04aea0e80fab638fd097767ffa2"
  ],
  "difficulty": 1
}
```
### stem
S에서 시작해 U D L R 명령대로 이동한다. 지도 밖 또는 #으로는 이동하지 않는다. * 칸에 처음 도착하면 표본 하나를 얻고 그 칸은 평지가 된다. 최종 표본 수를 구하시오.

입력
R C 다음 R줄 지도와 명령 문자열을 입력한다.

출력
얻은 표본 수를 출력한다.

제약
1 ≤ R,C ≤ 30. S는 하나다. 나머지 칸은 . 또는 # 또는 *다. 명령 수는 1 이상 1000 이하이다.


## question: monthly-03-q03
```json
{
  "title": "첫 충돌 시각",
  "topics": [
    "graph"
  ],
  "type": "code",
  "group": "code",
  "modelAnswer": "```java\nimport java.util.*;\npublic class Main {\n  public static void main(String[] args){\n    Scanner s=new Scanner(System.in);int n=s.nextInt();int[][] a=new int[n][3];\n    for(int i=0;i<n;i++){a[i][0]=s.nextInt()*2;a[i][1]=s.nextInt()*2;a[i][2]=s.nextInt();}\n    int[] dx={0,0,-1,1},dy={1,-1,0,0};\n    for(int t=1;t<=80;t++){\n      Set<String> seen=new HashSet<>();\n      for(int[] p:a){\n        p[0]+=dx[p[2]];p[1]+=dy[p[2]];\n        if(!seen.add(p[0]+\":\"+p[1])){System.out.println(t);return;}\n      }\n    }\n    System.out.println(-1);\n  }\n}\n```",
  "rubric": [
    {
      "id": "r0",
      "criterion": "좌표를 두 배로 늘린다",
      "points": 1
    },
    {
      "id": "r1",
      "criterion": "반 초 단위로 이동한다",
      "points": 1
    },
    {
      "id": "r2",
      "criterion": "같은 시각끼리 비교한다",
      "points": 1
    },
    {
      "id": "r3",
      "criterion": "최초 충돌에서 종료한다",
      "points": 1
    },
    {
      "id": "r4",
      "criterion": "미충돌이면 -1이다",
      "points": 1
    }
  ],
  "language": "java",
  "constraints": "1 ≤ N ≤ 100. 초기 좌표는 서로 다르며 |x|,|y| ≤ 20이다.",
  "examples": [
    {
      "input": "2\n0 0 3\n1 0 2\n",
      "output": "1"
    }
  ],
  "reviewCases": [
    {
      "input": "3\n-1 0 3\n1 0 2\n0 1 1\n",
      "output": "2"
    },
    {
      "input": "2\n0 0 0\n1 0 0\n",
      "output": "-1"
    },
    {
      "input": "2\n-20 0 3\n20 0 2\n",
      "output": "40"
    }
  ],
  "complexity": "평균 시간 O(N×80), 공간 O(N)",
  "id": "monthly-03-q03",
  "revision": 1,
  "sourceRefs": [
    "https://app.notion.com/p/3e6db04aea0e80fab638fd097767ffa2"
  ],
  "difficulty": 1
}
```
### stem
입자들은 상하좌우로 초당 한 칸씩 이동한다. 처음으로 2개 이상 같은 시각 같은 위치에 모이는 시각을 구하시오. 실제 시간의 2배를 정수로 출력한다. 끝까지 만나지 않으면 -1이다. 첫 충돌 후 상태는 고려하지 않는다.

입력
N 다음 N줄에 x y d를 입력한다. d는 0 위, 1 아래, 2 왼쪽, 3 오른쪽이며 위는 y 증가 방향이다.

출력
첫 충돌 시간의 2배 또는 -1을 출력한다.

제약
1 ≤ N ≤ 100. 초기 좌표는 서로 다르며 |x|,|y| ≤ 20이다.


## question: monthly-03-q04
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
  "id": "monthly-03-q04",
  "revision": 1,
  "sourceRefs": [
    "https://app.notion.com/p/3e6db04aea0e80fab638fd097767ffa2"
  ],
  "difficulty": 1
}
```
### stem
간선 비용이 같은 그래프에서 거리순 탐색과 한 경로를 깊게 탐색하는 방식을 설명하시오. 표현별 전체 탐색 차수를 쓰고 작업 의존 관계의 방향성과 사이클이 위상정렬에 미치는 영향을 설명하시오.

