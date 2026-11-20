package study.practice.notice.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notice {
    private int noticeId;
    private int categoryId;
    private int authorId;
    private String title;
    private String content;
    private int viewCount;
    private boolean pinned;
    @Builder.Default
    private String status = "ACTIVE";
    private String createdAt;
}
