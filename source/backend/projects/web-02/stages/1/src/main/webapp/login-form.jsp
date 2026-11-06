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
    <form action="${root}/____" method="____">
        <input type="hidden" name="action" value="____">
        <fieldset>
            <div>
                <label>이메일
                    <input type="email" name="email" value="<c:out value='${cookie.____.value}' />" required>
                </label>
            </div>
            <div>
                <label>비밀번호
                    <input type="password" name="____" required>
                </label>
            </div>
            <div>
                <label>
                    <input type="checkbox" name="____" ${empty cookie.email.value ? '' : 'checked'}> 이메일 기억하기
                </label>
            </div>
            <input type="submit" value="로그인">
        </fieldset>
    </form>
    <%-- study-target:jsp-login:end --%>
</body>
</html>
