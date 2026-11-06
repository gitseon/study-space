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

    <form action="${root}/gear" method="post">
        <input type="hidden" name="action" value="delete">
        <input type="hidden" name="code" value="<c:out value='${gear.code}' />">
        <input type="submit" value="삭제하기">
    </form>
    <%--@@stage 1--%>
    <div>코드: <c:out value="${gear.____}" /></div>
    <div>용품명: <c:out value="${gear.name}" /></div>
    <div>가격: <c:out value="${gear.price}" />원</div>
    <div>브랜드: <c:out value="${gear.brand}" /></div>
    <div>색상: <c:out value="${gear.color}" /></div>

    <form action="${root}/gear" method="____">
        <input type="hidden" name="action" value="____">
        <input type="hidden" name="code" value="<c:out value='${gear.code}' />">
        <input type="submit" value="삭제하기">
    </form>
    <%--@@stage 2--%>
    <%-- TODO: request 속성 gear의 코드, 용품명, 가격, 브랜드, 색상을 c:out으로 출력하세요.
         삭제 버튼은 /gear로 POST 전송하는 form으로 만들고 hidden action=delete와 hidden code를 둡니다. --%>
    <%--@@stage 3--%>
    <%-- 상세 정보와 삭제 form을 직접 작성하세요. 요구사항 R-DETAIL과 R-DELETE를 참고합니다. --%>
    <%--@@end--%>
    <a href="${root}/gear?action=list">목록으로</a>
</body>
</html>
