package study.springcheck;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;

/** Each check writes what it actually observed, one file per case, so the verifier can compare it with the answer. */
public final class Observations {
    private static final Path DIR = Path.of("target", "observations");

    private Observations() {
    }

    public static void record(String caseId, String observed) {
        if (!caseId.matches("[a-z0-9-]+")) {
            throw new IllegalArgumentException("case id: " + caseId);
        }
        try {
            Files.createDirectories(DIR);
            Files.writeString(DIR.resolve(caseId + ".txt"), observed, StandardCharsets.UTF_8);
        } catch (IOException e) {
            throw new IllegalStateException(e);
        }
    }
}
