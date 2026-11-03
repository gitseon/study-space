import {resultFor} from './grading.js';

const POINTS = 2;
const PASS_SCORE = 60;
const SUBJECT_RATIO = 0.4;
const FULL_EXAM = 50;

// SQLD scores 2 points per correct answer. Passing needs 60 points and at least 40% correct in every subject.
// A pass or fail is shown only for a submitted exam run that holds all 50 questions; other sets report accuracy only (pass is null).
export function summarizeSqld(questions, attempt, subjects) {
  const subjectOf = new Map();
  Object.entries(subjects).forEach(([name, groups]) => groups.forEach((group) => subjectOf.set(group, name)));
  const perSubject = Object.keys(subjects).map((name) => ({name, total: 0, correct: 0, minCorrect: 0, failed: false}));
  const byName = new Map(perSubject.map((s) => [s.name, s]));
  let correct = 0;
  for (const q of questions) {
    const subject = byName.get(subjectOf.get(q.group));
    if (subject) {
      subject.total++;
    }
    if (resultFor(q, attempt).status === 'correct') {
      correct++;
      if (subject) {
        subject.correct++;
      }
    }
  }
  for (const s of perSubject) {
    s.minCorrect = Math.ceil(s.total * SUBJECT_RATIO);
    s.failed = s.correct < s.minCorrect;
  }
  const score = correct * POINTS;
  const failedSubjects = perSubject.filter((s) => s.failed).map((s) => s.name);
  const complete = questions.length === FULL_EXAM && perSubject.every((s) => s.total > 0);
  const judged = complete && attempt.mode === 'exam' && !!attempt.submittedAt;
  return {
    correct, score, maxScore: questions.length * POINTS, perSubject, failedSubjects, complete,
    pass: judged ? score >= PASS_SCORE && failedSubjects.length === 0 : null,
  };
}
