// An exam that copies a timed test keeps its real length in exam mode. Study mode may still pick any limit.
export function effectiveMinutes(exam, mode, requested) {
  if (exam.fixedPracticeMinutes && mode === 'exam') {
    return exam.practiceMinutes;
  }
  const minutes = Number(requested ?? (mode === 'study' ? 0 : exam.practiceMinutes));
  return Number.isFinite(minutes) && minutes >= 0 && minutes <= 600 ? minutes : exam.practiceMinutes;
}
