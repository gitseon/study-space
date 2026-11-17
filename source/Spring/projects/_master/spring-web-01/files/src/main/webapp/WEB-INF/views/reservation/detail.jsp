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
<%-- @@target jsp-detail --%>
<dl>
    <dt>번호</dt><dd><c:out value="${reservation.reservationId}" /></dd>
    <dt>방</dt><dd><c:out value="${reservation.roomName}" /></dd>
    <dt>예약자</dt><dd><c:out value="${reservation.memberName}" /></dd>
    <dt>인원</dt><dd><c:out value="${reservation.people}" /></dd>
</dl>
<form method="post" action="${root}/reservations/${reservation.reservationId}/delete">
    <button type="submit">예약 취소</button>
</form>
<%-- @@stage 1 --%>
<dl>
    <dt>번호</dt><dd><c:out value="${reservation.____}" /></dd>
    <dt>방</dt><dd><c:out value="${reservation.roomName}" /></dd>
    <dt>예약자</dt><dd><c:out value="${reservation.____}" /></dd>
    <dt>인원</dt><dd><c:out value="${reservation.people}" /></dd>
</dl>
<form method="____" action="${root}/reservations/${reservation.reservationId}/delete">
    <button type="submit">예약 취소</button>
</form>
<%-- @@stage 2 --%>
<%-- TODO: 번호, 방, 예약자, 인원을 c:out으로 출력한다 --%>
<%-- TODO: POST로 /reservations/{번호}/delete를 보내는 취소 form을 만든다 --%>
<%-- @@stage 3 --%>
<%-- TODO: 예약 한 건의 값을 출력하고 취소 form을 만든다 --%>
<%-- @@end --%>
<p><a href="${root}/reservations">목록으로</a></p>
</body>
</html>
