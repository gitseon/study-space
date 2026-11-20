package study.practice.notice.web;

import java.util.List;
import org.springframework.http.ResponseEntity;
import study.practice.notice.model.Notice;

public class NoticeController {
    // TODO 4. 목록과 등록을 HTTP 엔드포인트로 연결한다.
    public ResponseEntity<List<Notice>> list() {
        throw new UnsupportedOperationException();
    }

    public ResponseEntity<String> create(Notice notice) {
        throw new UnsupportedOperationException();
    }
}
