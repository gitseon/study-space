<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<c:set var="root" value="${pageContext.request.contextPath}" />
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <title>예약 목록</title>
</head>
<body>
<jsp:include page="/WEB-INF/views/common/header.jsp" />
<h1>예약 목록</h1>
<c:if test="${not empty message}">
    <p class="notice"><c:out value="${message}" /></p>
</c:if>
<form method="get" action="${root}/reservations">
    <select name="roomId">
        <option value="">전체 방</option>
        <c:forEach var="room" items="${rooms}">
            <option value="${room.roomId}" <c:if test="${roomId == room.roomId}">selected</c:if>><c:out value="${room.roomName}" /></option>
        </c:forEach>
    </select>
    <input type="text" name="keyword" value="<c:out value='${keyword}' />" placeholder="예약자 이름">
    <button type="submit">검색</button>
</form>
<table>
    <thead>
        <tr><th>번호</th><th>방</th><th>예약자</th><th>인원</th></tr>
    </thead>
    <tbody>
        <%-- @@target jsp-list --%>
        <c:choose>
            <c:when test="${empty reservations}">
                <tr><td colspan="4">예약이 없습니다.</td></tr>
            </c:when>
            <c:otherwise>
                <c:forEach var="r" items="${reservations}">
                    <tr>
                        <td><a href="${root}/reservations/${r.reservationId}"><c:out value="${r.reservationId}" /></a></td>
                        <td><c:out value="${r.roomName}" /></td>
                        <td><c:out value="${r.memberName}" /></td>
                        <td><c:out value="${r.people}" /></td>
                    </tr>
                </c:forEach>
            </c:otherwise>
        </c:choose>
        <%-- @@stage 1 --%>
        <c:choose>
            <c:when test="${____ reservations}">
                <tr><td colspan="4">예약이 없습니다.</td></tr>
            </c:when>
            <c:otherwise>
                <c:forEach var="r" items="${____}">
                    <tr>
                        <td><a href="${root}/reservations/${r.reservationId}"><c:out value="${r.reservationId}" /></a></td>
                        <td><c:out value="${r.roomName}" /></td>
                        <td><c:out value="${r.memberName}" /></td>
                        <td><c:out value="${r.people}" /></td>
                    </tr>
                </c:forEach>
            </c:otherwise>
        </c:choose>
        <%-- @@stage 2 --%>
        <%-- TODO: 예약이 없으면 안내 행을 보여 주고 있으면 번호 링크와 방, 예약자, 인원 행을 반복해 출력한다 --%>
        <%-- @@stage 3 --%>
        <%-- TODO: reservations 목록을 표의 행으로 출력한다. 비어 있으면 "예약이 없습니다." 행을 보여 준다 --%>
        <%-- @@end --%>
    </tbody>
</table>
</body>
</html>
