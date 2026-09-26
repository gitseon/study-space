import {planChoiceOrder} from './choice-order.js';

export function createAttempt(exam, {mode = 'exam', now = Date.now(), durationMinutes = 0, shuffle = false} = {}) {
  const plan = shuffle ? planChoiceOrder(exam.questions, now) : null;
  return {
    attemptId: crypto.randomUUID(),
    examId: exam.id,
    contentVersion: exam.contentVersion,
    mode,
    startedAt: now,
    deadlineAt: durationMinutes > 0 ? now + durationMinutes * 60000 : null,
    questionOrder: plan?.questionOrder || exam.questions.map((q) => q.id),
    choiceOrders: plan?.choiceOrders || exam.defaultChoiceOrders || {},
    answers: {},
    selfGrades: {},
    overrides: {},
    revealed: [],
    submittedAt: null,
    currentIndex: 0,
    snapshot: structuredClone(exam),
  };
}

export function remainingSeconds(attempt, now = Date.now()) {
  if (attempt.deadlineAt === null) {
    return null;
  }
  return Math.max(0, Math.ceil((attempt.deadlineAt - now) / 1000));
}
