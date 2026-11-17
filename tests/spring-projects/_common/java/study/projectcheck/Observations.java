package study.projectcheck;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;

/** Records what a verification run observed, one file per case, for scripts/verify_spring_projects.py. */
public final class Observations {
    private static final Path DIR = Path.of("target", "observations");

    private Observations() {
    }

    public static void record(String caseId, String observed) {
        try {
            Files.createDirectories(DIR);
            Files.writeString(DIR.resolve(caseId + ".txt"), observed, StandardCharsets.UTF_8);
        } catch (IOException e) {
            throw new IllegalStateException(e);
        }
    }
}
