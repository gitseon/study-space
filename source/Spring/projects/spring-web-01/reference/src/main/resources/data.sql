INSERT IGNORE INTO study_room (room_id, room_name, capacity) VALUES (1, '소회의실 A', 6), (2, '소회의실 B', 4), (3, '세미나실', 10);

INSERT INTO room_reservation (room_id, member_name, people)
SELECT room_id, member_name, people FROM (
    SELECT 1 AS room_id, '김하나' AS member_name, 2 AS people
    UNION ALL SELECT 1, '이둘', 3
    UNION ALL SELECT 2, '박셋', 2
) seed WHERE NOT EXISTS (SELECT 1 FROM room_reservation);
