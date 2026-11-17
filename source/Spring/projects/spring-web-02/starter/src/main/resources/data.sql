INSERT IGNORE INTO rental_equipment (equipment_id, name) VALUES (1, '노트북'), (2, '카메라'), (3, '빔 프로젝터');

INSERT IGNORE INTO rental_member (login_id, password_hash, role) VALUES
    ('mina', '{bcrypt}$2a$10$Y7RhUHNhc0YK3EQuqkUGLe3/pooU908naFLWVY5jPMMDDgNWf.yqO', 'USER'),
    ('jun', '{bcrypt}$2a$10$Y7RhUHNhc0YK3EQuqkUGLe3/pooU908naFLWVY5jPMMDDgNWf.yqO', 'USER'),
    ('root', '{bcrypt}$2a$10$Y7RhUHNhc0YK3EQuqkUGLe3/pooU908naFLWVY5jPMMDDgNWf.yqO', 'ADMIN');
