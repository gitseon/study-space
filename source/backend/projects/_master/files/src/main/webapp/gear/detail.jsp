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
    <%--@@target jsp-detail--%>
    <div>코드: <c:out value="${gear.code}" /></div>
    <div>용품명: <c:out value="${gear.name}" /></div>
    <div>가격: <c:out value="${gear.price}" />원</div>
    <div>브랜드: <c:out value="${gear.brand}" /></div>
    <div>색상: <c:out value="${gear.color}" /></div>
    <%--@@stage 1--%>
    <div>코드: <c:out value="${gear.____}" /></div>
    <div>용품명: <c:out value="${gear.name}" /></div>
    <div>가격: <c:out value="${gear.____}" />원</div>
    <div>브랜드: <c:out value="${gear.brand}" /></div>
    <div>색상: <c:out value="${gear.color}" /></div>
    <%--@@stage 2--%>
    <%-- TODO: request 속성 gear의 코드, 용품명, 가격, 브랜드, 색상을 c:out으로 한 줄씩 출력하세요. --%>
    <%--@@stage 3--%>
    <%-- 상세 정보를 직접 작성하세요. 요구사항 R-DETAIL을 참고합니다. --%>
    <%--@@end--%>
    <a href="${root}/gear?action=list">목록으로</a>
</body>
</html>
