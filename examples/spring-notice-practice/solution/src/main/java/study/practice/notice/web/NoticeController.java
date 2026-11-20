package study.practice.notice.web;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import study.practice.notice.model.Notice;
import study.practice.notice.service.NoticeService;

@RestController
@RequestMapping("/practice/notices")
public class NoticeController {
    private final NoticeService service;

    public NoticeController(NoticeService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<Notice>> list() {
        return ResponseEntity.ok(service.getAllNotices());
    }

    @PostMapping
    public ResponseEntity<String> create(@RequestBody Notice notice) {
        service.createNotice(notice);
        return ResponseEntity.status(HttpStatus.CREATED).body("Notice Created");
    }
}
