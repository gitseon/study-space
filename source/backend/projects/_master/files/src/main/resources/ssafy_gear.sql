-- 학습용 데이터베이스입니다. 실행하면 기존 ssafy_gear 데이터베이스의 두 테이블이 초기화됩니다.
CREATE DATABASE IF NOT EXISTS ssafy_gear DEFAULT CHARACTER SET utf8mb4;
USE ssafy_gear;

DROP TABLE IF EXISTS gear;
DROP TABLE IF EXISTS member;

-- 로그인과 세션 사용자 식별에 쓰는 회원 테이블
CREATE TABLE member (
    mno INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL,
    email VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(50) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'USER'
);

-- 용품 테이블: 코드는 사용자가 직접 입력하는 문자열 기본키
CREATE TABLE gear (
    code VARCHAR(30) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    price INT NOT NULL,
    brand VARCHAR(30) NOT NULL,
    color VARCHAR(30) NOT NULL
);

INSERT INTO member (name, email, password, role) VALUES ('운영자', 'manager@study.test', '1234', 'ADMIN');
INSERT INTO member (name, email, password, role) VALUES ('이연습', 'learner@study.test', '1234', 'USER');

INSERT INTO gear (code, name, price, brand, color) VALUES ('CP-LT-201', '랜턴 라이트 프로', 48000, '루미캠프', '블랙');
INSERT INTO gear (code, name, price, brand, color) VALUES ('CP-MT-310', '접이식 캠핑 매트', 36000, '포레스트원', '카키');
INSERT INTO gear (code, name, price, brand, color) VALUES ('CP-TB-415', '알루미늄 롤 테이블', 89000, '노마드하우스', '아이보리');
INSERT INTO gear (code, name, price, brand, color) VALUES ('CP-CK-520', '티타늄 쿠커 세트', 124000, '루미캠프', '블랙');

COMMIT;
