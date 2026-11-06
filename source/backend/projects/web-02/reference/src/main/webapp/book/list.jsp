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
    <a href="${root}/book?action=regist">등록하기</a>
    <table>
        <thead>
            <tr>
                <th>코드</th>
                <th>도서명</th>
                <th>가격</th>
                <th>저자</th>
                <th>분류</th>
            </tr>
        </thead>
        <tbody>
            <c:choose>
                <c:when test="${empty list}">
                    <tr>
                        <td colspan="5">등록된 도서가 없습니다.</td>
                    </tr>
                </c:when>
                <c:otherwise>
                    <c:forEach var="dto" items="${list}">
                        <c:url var="detailUrl" value="/book">
                            <c:param name="action" value="detail" />
                            <c:param name="code" value="${dto.code}" />
                        </c:url>
                        <tr>
                            <td><a href="${detailUrl}"><c:out value="${dto.code}" /></a></td>
                            <td><c:out value="${dto.name}" /></td>
                            <td><c:out value="${dto.price}" /></td>
                            <td><c:out value="${dto.author}" /></td>
                            <td><c:out value="${dto.category}" /></td>
                        </tr>
                    </c:forEach>
                </c:otherwise>
            </c:choose>
        </tbody>
    </table>
</body>
</html>
