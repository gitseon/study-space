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
    <form action="${root}/user" method="post">
        <input type="hidden" name="action" value="login">
        <fieldset>
            <div>
                <label>이메일
                    <input type="email" name="email" value="<c:out value='${cookie.email.value}' />" required>
                </label>
            </div>
            <div>
                <label>비밀번호
                    <input type="password" name="pass" required>
                </label>
            </div>
            <div>
                <label>
                    <input type="checkbox" name="remember-me" ${empty cookie.email.value ? '' : 'checked'}> 이메일 기억하기
                </label>
            </div>
            <input type="submit" value="로그인">
        </fieldset>
    </form>
</body>
</html>
