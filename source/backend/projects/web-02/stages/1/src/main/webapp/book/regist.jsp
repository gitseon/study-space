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
    <%-- study-target:jsp-regist:start --%>
    <form action="${root}/book" method="____">
        <input type="hidden" name="____" value="regist">
        <fieldset>
            <label>도서 코드 <input type="text" name="code" maxlength="30" required></label><br>
            <label>도서명 <input type="text" name="____" maxlength="50" required></label><br>
            <label>가격 <input type="number" name="price" min="0" required></label><br>
            <label>저자 <input type="text" name="author" maxlength="30" required></label><br>
            <label>분류
                <select name="____">
                    <option value="소설">소설</option>
                    <option value="IT">IT</option>
                    <option value="경제">경제</option>
                </select>
            </label><br>
            <input type="submit" value="등록">
        </fieldset>
    </form>
    <%-- study-target:jsp-regist:end --%>
    <a href="${root}/book?action=list">목록으로</a>
</body>
</html>
