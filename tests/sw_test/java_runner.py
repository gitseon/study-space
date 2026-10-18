"""Run standalone Java practice solutions against their console contracts."""

from pathlib import Path
import subprocess
import tempfile


class JavaProgram:
    def __init__(self, class_name):
        self.class_name = class_name
        self.build_dir = tempfile.TemporaryDirectory(prefix="a-study-java-test-")
        root = Path(__file__).resolve().parents[2] / "source" / "SW역량테스트"
        source = next(root.glob(f"*/{class_name}.java"))
        subprocess.run(
            ["javac", "--release", "8", "-Xlint:-options", "-encoding", "UTF-8",
             "-d", self.build_dir.name, str(source)],
            check=True, capture_output=True, encoding="utf-8", errors="replace", timeout=30,
        )

    def run(self, input_text):
        result = subprocess.run(
            ["java", "-cp", self.build_dir.name, self.class_name],
            input=input_text, capture_output=True, encoding="utf-8", errors="replace",
            check=True, timeout=15,
        )
        return result.stdout.strip()

    def close(self):
        self.build_dir.cleanup()
