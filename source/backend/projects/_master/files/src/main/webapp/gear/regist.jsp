<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="jakarta.tags.core"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>정보 등록 페이지</title>
</head>
<body>
    <%@ include file="/header.jsp"%>
    <h1>등록 페이지</h1>
    <%--@@target jsp-regist--%>
    <form action="${root}/gear" method="post">
        <input type="hidden" name="action" value="regist">
        <fieldset>
            <label>용품 코드 <input type="text" name="code" maxlength="30" required></label><br>
            <label>용품명 <input type="text" name="name" maxlength="50" required></label><br>
            <label>가격 <input type="number" name="price" min="0" required></label><br>
            <label>브랜드 <input type="text" name="brand" maxlength="30" required></label><br>
            <label>색상
                <select name="color">
                    <option value="블랙">블랙</option>
                    <option value="아이보리">아이보리</option>
                    <option value="카키">카키</option>
                </select>
            </label><br>
            <input type="submit" value="등록">
        </fieldset>
    </form>
    <%--@@stage 1--%>
    <form action="${root}/gear" method="____">
        <input type="hidden" name="____" value="regist">
        <fieldset>
            <label>용품 코드 <input type="text" name="code" maxlength="30" required></label><br>
            <label>용품명 <input type="text" name="____" maxlength="50" required></label><br>
            <label>가격 <input type="number" name="price" min="0" required></label><br>
            <label>브랜드 <input type="text" name="brand" maxlength="30" required></label><br>
            <label>색상
                <select name="____">
                    <option value="블랙">블랙</option>
                    <option value="아이보리">아이보리</option>
                    <option value="카키">카키</option>
                </select>
            </label><br>
            <input type="submit" value="등록">
        </fieldset>
    </form>
    <%--@@stage 2--%>
    <%-- TODO: /gear로 POST 전송하는 등록 form을 작성하세요.
         hidden action=regist와 code, name, price, brand, color 입력을 둡니다.
         입력 name은 컨트롤러가 읽는 파라미터 이름과 같아야 합니다. 색상은 select로 고릅니다. --%>
    <%--@@stage 3--%>
    <%-- 등록 form을 직접 작성하세요. 요구사항 R-REGIST를 참고합니다. --%>
    <%--@@end--%>
    <a href="${root}/gear?action=list">목록으로</a>
</body>
</html>
