<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<c:set var="root" value="${pageContext.request.contextPath}" />
<nav>
    <strong>스터디실 예약</strong>
    <a href="${root}/reservations">예약 목록</a>
    <a href="${root}/reservations/new">예약하기</a>
</nav>
