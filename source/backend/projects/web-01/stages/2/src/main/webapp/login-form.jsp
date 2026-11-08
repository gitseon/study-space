<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="jakarta.tags.core"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>로그인 페이지</title>
</head>
<body>
    <%@ include file="/header.jsp"%>
    <h1>로그인 페이지</h1>
    <%-- study-target:jsp-login:start --%>
    <%-- TODO: /gear로 POST 전송하는 로그인 form을 작성하세요.
         hidden action=login과 email, pass 입력을 둡니다.
         입력 name은 컨트롤러가 읽는 파라미터 이름과 같아야 합니다.
         email 쿠키가 있으면 이메일 칸을 그 값으로 채우고, 이름이 remember-me인 아이디 기억하기 체크박스를 checked로 그립니다.
         쿠키 값은 c:out으로 출력합니다. --%>
    <%-- study-target:jsp-login:end --%>
</body>
</html>
