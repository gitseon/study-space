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
    <%-- study-target:jsp-regist:end --%>
    <a href="${root}/gear?action=list">목록으로</a>
</body>
</html>
