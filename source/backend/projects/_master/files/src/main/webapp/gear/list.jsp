<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="jakarta.tags.core"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>목록 조회 페이지</title>
<style>
table, th, td {
    border: 1px solid black;
    border-collapse: collapse;
}
</style>
</head>
<body>
    <%@ include file="/header.jsp"%>
    <h1>목록 조회 페이지</h1>
    <a href="${root}/gear?action=regist">등록하기</a>
    <table>
        <thead>
            <tr>
                <th>코드</th>
                <th>용품명</th>
                <th>가격</th>
                <th>색상</th>
            </tr>
        </thead>
        <tbody>
            <%--@@target jsp-list--%>
            <c:choose>
                <c:when test="${empty list}">
                    <tr>
                        <td colspan="4">등록된 용품이 없습니다.</td>
                    </tr>
                </c:when>
                <c:otherwise>
                    <c:forEach var="dto" items="${list}">
                        <c:url var="detailUrl" value="/gear">
                            <c:param name="action" value="detail" />
                            <c:param name="code" value="${dto.code}" />
                        </c:url>
                        <tr>
                            <td><a href="${detailUrl}"><c:out value="${dto.code}" /></a></td>
                            <td><c:out value="${dto.name}" /></td>
                            <td><c:out value="${dto.price}" /></td>
                            <td><c:out value="${dto.color}" /></td>
                        </tr>
                    </c:forEach>
                </c:otherwise>
            </c:choose>
            <%--@@stage 1--%>
            <c:choose>
                <c:when test="${____ list}">
                    <tr>
                        <td colspan="4">등록된 용품이 없습니다.</td>
                    </tr>
                </c:when>
                <c:otherwise>
                    <c:forEach var="dto" items="${____}">
                        <c:url var="detailUrl" value="/gear">
                            <c:param name="action" value="detail" />
                            <c:param name="____" value="${dto.code}" />
                        </c:url>
                        <tr>
                            <td><a href="${detailUrl}"><c:out value="${dto.code}" /></a></td>
                            <td><c:out value="${dto.name}" /></td>
                            <td><c:out value="${dto.____}" /></td>
                            <td><c:out value="${dto.color}" /></td>
                        </tr>
                    </c:forEach>
                </c:otherwise>
            </c:choose>
            <%--@@stage 2--%>
            <%-- TODO: request 속성 list가 비어 있으면 "등록된 용품이 없습니다." 행을 보여주세요.
                 목록이 있으면 용품마다 한 행씩 코드, 용품명, 가격, 색상을 출력하세요.
                 코드는 /gear?action=detail&code=코드 링크로 만들고 출력값은 c:out으로 감쌉니다. --%>
            <%--@@stage 3--%>
            <%-- 목록 본문 행을 직접 작성하세요. 요구사항 R-LIST를 참고합니다. --%>
            <%--@@end--%>
        </tbody>
    </table>
</body>
</html>
