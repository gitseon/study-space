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
    <%--@@target jsp-login--%>
    <form action="${root}/gear" method="post">
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
                    <input type="checkbox" name="remember-me" ${empty cookie.email.value ? '' : 'checked'}>
                    아이디 기억하기
                </label>
            </div>
            <input type="submit" value="로그인">
        </fieldset>
    </form>
    <%--@@stage 1--%>
    <form action="${root}/____" method="____">
        <input type="hidden" name="action" value="____">
        <fieldset>
            <div>
                <label>이메일
                    <input type="email" name="____" value="<c:out value='${____.email.value}' />" required>
                </label>
            </div>
            <div>
                <label>비밀번호
                    <input type="password" name="____" required>
                </label>
            </div>
            <div>
                <label>
                    <input type="checkbox" name="____" ${empty cookie.email.value ? '' : '____'}>
                    아이디 기억하기
                </label>
            </div>
            <input type="submit" value="로그인">
        </fieldset>
    </form>
    <%--@@stage 2--%>
    <%-- TODO: /gear로 POST 전송하는 로그인 form을 작성하세요.
         hidden action=login과 email, pass 입력을 둡니다.
         입력 name은 컨트롤러가 읽는 파라미터 이름과 같아야 합니다.
         email 쿠키가 있으면 이메일 칸을 그 값으로 채우고, 이름이 remember-me인 아이디 기억하기 체크박스를 checked로 그립니다.
         쿠키 값은 c:out으로 출력합니다. --%>
    <%--@@stage 3--%>
    <%-- 로그인 form을 직접 작성하세요. 요구사항 R-LOGIN을 참고합니다. --%>
    <%--@@end--%>
</body>
</html>
