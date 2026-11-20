INSERT IGNORE INTO notice_category (category_id, label)
VALUES (1, '공간 운영'), (2, '프로그램');

INSERT IGNORE INTO notice_author (author_id, display_name)
VALUES (1, '운영 데스크'), (2, '프로그램 팀');

INSERT IGNORE INTO notice (notice_id, category_id, author_id, title, content, is_pinned, status)
VALUES
    (3, 2, 2, '저녁 워크숍 사전 접수', '수요일 저녁 워크숍 접수를 시작합니다.', FALSE, 'ACTIVE'),
    (1, 1, 1, '공용 장비 점검 일정', '토요일 오전에 공용 장비를 점검합니다.', TRUE, 'ACTIVE'),
    (4, 2, 2, '지난달 독서 모임 안내', '모집 기간이 끝났습니다.', FALSE, 'HIDDEN'),
    (2, 1, 1, '회의실 사용 시간 변경', '금요일에는 회의실을 오후 네 시까지 이용할 수 있습니다.', FALSE, 'ACTIVE');
