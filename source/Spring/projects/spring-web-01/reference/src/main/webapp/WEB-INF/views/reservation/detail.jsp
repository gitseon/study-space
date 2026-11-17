<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<c:set var="root" value="${pageContext.request.contextPath}" />
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <title>예약 상세</title>
</head>
<body>
<jsp:include page="/WEB-INF/views/common/header.jsp" />
<h1>예약 상세</h1>
<c:if test="${not empty message}">
    <p class="notice"><c:out value="${message}" /></p>
</c:if>
<dl>
    <dt>번호</dt><dd><c:out value="${reservation.reservationId}" /></dd>
    <dt>방</dt><dd><c:out value="${reservation.roomName}" /></dd>
    <dt>예약자</dt><dd><c:out value="${reservation.memberName}" /></dd>
    <dt>인원</dt><dd><c:out value="${reservation.people}" /></dd>
</dl>
<form method="post" action="${root}/reservations/${reservation.reservationId}/delete">
    <button type="submit">예약 취소</button>
</form>
<p><a href="${root}/reservations">목록으로</a></p>
</body>
</html>
