-- 학습용 데이터베이스입니다. 실행하면 기존 ssafy_book 데이터베이스의 두 테이블이 초기화됩니다.
CREATE DATABASE IF NOT EXISTS ssafy_book DEFAULT CHARACTER SET utf8mb4;
USE ssafy_book;

DROP TABLE IF EXISTS book;
DROP TABLE IF EXISTS member;

-- 로그인과 세션 사용자 식별에 쓰는 회원 테이블
CREATE TABLE member (
    mno INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL,
    email VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(50) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'USER'
);

-- 도서 테이블: 코드는 사용자가 직접 입력하는 문자열 기본키
CREATE TABLE book (
    code VARCHAR(30) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    price INT NOT NULL,
    author VARCHAR(30) NOT NULL,
    category VARCHAR(30) NOT NULL
);

INSERT INTO member (name, email, password, role) VALUES ('운영자', 'manager@study.test', '1234', 'ADMIN');
INSERT INTO member (name, email, password, role) VALUES ('이연습', 'learner@study.test', '1234', 'USER');

INSERT INTO book (code, name, price, author, category) VALUES ('BK-IT-201', '서블릿과 JSP 따라하기', 28000, '한서진', 'IT');
INSERT INTO book (code, name, price, author, category) VALUES ('BK-NV-310', '새벽 기차의 편지', 14000, '오하람', '소설');
INSERT INTO book (code, name, price, author, category) VALUES ('BK-EC-415', '작은 가게의 숫자 읽기', 18500, '문도윤', '경제');
INSERT INTO book (code, name, price, author, category) VALUES ('BK-IT-520', '데이터베이스 설계 노트', 32000, '한서진', 'IT');

COMMIT;
