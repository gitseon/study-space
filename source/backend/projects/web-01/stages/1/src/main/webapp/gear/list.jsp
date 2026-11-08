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
            <%-- study-target:jsp-list:start --%>
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
            <%-- study-target:jsp-list:end --%>
        </tbody>
    </table>
</body>
</html>
