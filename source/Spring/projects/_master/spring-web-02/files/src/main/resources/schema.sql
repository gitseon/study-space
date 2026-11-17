CREATE TABLE IF NOT EXISTS rental_equipment (
    equipment_id INT PRIMARY KEY,
    name VARCHAR(40) NOT NULL
);

CREATE TABLE IF NOT EXISTS rental_member (
    login_id VARCHAR(30) PRIMARY KEY,
    password_hash VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL
);

CREATE TABLE IF NOT EXISTS equipment_rental (
    rental_id INT AUTO_INCREMENT PRIMARY KEY,
    equipment_id INT NOT NULL,
    login_id VARCHAR(30) NOT NULL,
    days INT NOT NULL,
    FOREIGN KEY (equipment_id) REFERENCES rental_equipment (equipment_id),
    FOREIGN KEY (login_id) REFERENCES rental_member (login_id)
);
