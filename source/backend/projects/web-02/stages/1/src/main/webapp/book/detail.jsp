<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="jakarta.tags.core"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>정보 상세 페이지</title>
</head>
<body>
    <%@ include file="/header.jsp"%>
    <h1>상세 페이지</h1>
    <%-- study-target:jsp-detail:start --%>
    <div>코드: <c:out value="${book.____}" /></div>
    <div>도서명: <c:out value="${book.name}" /></div>
    <div>가격: <c:out value="${book.____}" />원</div>
    <div>저자: <c:out value="${book.author}" /></div>
    <div>분류: <c:out value="${book.category}" /></div>
    <%-- study-target:jsp-detail:end --%>
    <a href="${root}/book?action=list">목록으로</a>
</body>
</html>
