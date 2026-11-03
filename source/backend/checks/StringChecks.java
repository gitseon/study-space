import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

// Pure Java cases behind the backend questions that need no database. Prints one "name=value" line per case.
public class StringChecks {
    public static void main(String[] args) {
        System.out.println("url_encode=" + URLEncoder.encode("가 나", StandardCharsets.UTF_8));
        System.out.println("url_encode_plus=" + URLEncoder.encode("a+b", StandardCharsets.UTF_8));

        String uri = "/app/board/write.do";
        String ctx = "/app";
        String path = uri.substring(ctx.length());
        String action = path.substring(path.lastIndexOf('/') + 1, path.lastIndexOf(".do"));
        System.out.println("action=" + action);
        System.out.println("action_without_plus_one=" + path.substring(path.lastIndexOf('/'), path.lastIndexOf(".do")));
        System.out.println("action_with_extension=" + path.substring(path.lastIndexOf('/') + 1));
    }
}
