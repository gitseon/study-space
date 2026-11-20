CREATE TABLE IF NOT EXISTS notice_category (
    category_id INT PRIMARY KEY,
    label VARCHAR(40) NOT NULL
);

CREATE TABLE IF NOT EXISTS notice_author (
    author_id INT PRIMARY KEY,
    display_name VARCHAR(40) NOT NULL
);

CREATE TABLE IF NOT EXISTS notice (
    notice_id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL,
    author_id INT NOT NULL,
    title VARCHAR(100) NOT NULL,
    content VARCHAR(500) NOT NULL,
    view_count INT NOT NULL DEFAULT 0,
    is_pinned BOOLEAN NOT NULL DEFAULT FALSE,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_practice_category FOREIGN KEY (category_id) REFERENCES notice_category(category_id),
    CONSTRAINT fk_practice_author FOREIGN KEY (author_id) REFERENCES notice_author(author_id)
);
