<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<c:set var="root" value="${pageContext.request.contextPath}" />
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <title>예약하기</title>
</head>
<body>
<jsp:include page="/WEB-INF/views/common/header.jsp" />
<h1>예약하기</h1>
<spring:hasBindErrors name="form">
    <ul class="errors">
        <c:forEach var="err" items="${errors.allErrors}">
            <li><c:out value="${err.defaultMessage}" /></li>
        </c:forEach>
    </ul>
</spring:hasBindErrors>
<form method="post" action="${root}/reservations">
    <label>방
        <select name="roomId">
            <c:forEach var="room" items="${rooms}">
                <option value="${room.roomId}" <c:if test="${form.roomId == room.roomId}">selected</c:if>><c:out value="${room.roomName}" /> (<c:out value="${room.capacity}" />명)</option>
            </c:forEach>
        </select>
    </label>
    <label>예약자 <input type="text" name="memberName" value="<c:out value='${form.memberName}' />"></label>
    <label>인원 <input type="number" name="people" value="<c:out value='${form.people}' />"></label>
    <button type="submit">예약</button>
</form>
</body>
</html>
