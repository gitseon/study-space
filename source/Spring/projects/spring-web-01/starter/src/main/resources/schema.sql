CREATE TABLE IF NOT EXISTS study_room (
    room_id INT PRIMARY KEY,
    room_name VARCHAR(30) NOT NULL,
    capacity INT NOT NULL
);

CREATE TABLE IF NOT EXISTS room_reservation (
    reservation_id INT AUTO_INCREMENT PRIMARY KEY,
    room_id INT NOT NULL,
    member_name VARCHAR(30) NOT NULL,
    people INT NOT NULL,
    FOREIGN KEY (room_id) REFERENCES study_room (room_id)
);
