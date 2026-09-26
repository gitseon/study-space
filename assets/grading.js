export function gradeAnswer(q, answer) {
  const maxPoints = q.rubric?.reduce((n, r) => n + r.points, 0) || 1;
  if (answer === undefined || answer === null || String(answer).trim() === '') {
    return {status: 'unanswered', points: 0, maxPoints, gradingMethod: 'auto'};
  }
  if (q.type === 'essay' || q.type === 'code') {
    return {status: 'pending-review', points: 0, maxPoints, gradingMethod: 'self'};
  }
  const normalize = (v) => {
    if (q.normalization === 'caseFold') {
      return String(v).trim().toLocaleLowerCase('en');
    }
    if (q.normalization === 'trim') {
      return String(v).trim();
    }
    return String(v);
  };
  const correct = q.type === 'mc'
    ? answer === q.correctChoiceId
    : q.acceptedAnswers.some((v) => normalize(v) === normalize(answer));
  return {status: correct ? 'correct' : 'incorrect', points: correct ? 1 : 0, maxPoints: 1, gradingMethod: 'auto'};
}

export function resultFor(q, attempt) {
  const result = gradeAnswer(q, attempt.answers[q.id]);
  if (q.type === 'essay' || q.type === 'code') {
    const value = attempt.selfGrades[q.id];
    if (value) {
      const points = q.rubric.reduce((n, r) => n + (value.includes(r.id) ? r.points : 0), 0);
      const status = points === result.maxPoints ? 'correct' : points ? 'partial' : 'incorrect';
      return {...result, status, points, gradingMethod: 'self'};
    }
    if (result.status === 'unanswered') {
      return {...result, gradingMethod: 'self'};
    }
    return {...result, status: 'pending-review', gradingMethod: 'self'};
  }
  if (q.type === 'short' && attempt.overrides?.[q.id] !== undefined) {
    const correct = !!attempt.overrides[q.id];
    return {...result, status: correct ? 'correct' : 'incorrect', points: correct ? 1 : 0, gradingMethod: 'self'};
  }
  return result;
}

// Unanswered questions count as questions to revisit alongside wrong and partially correct ones.
export const needsReview = (status) => ['incorrect', 'partial', 'unanswered'].includes(status);

export function summarize(questions, attempt) {
  const counts = {total: questions.length, correct: 0, incorrect: 0, unanswered: 0, pending: 0, points: 0, maxPoints: 0};
  for (const q of questions) {
    const r = resultFor(q, attempt);
    counts.points += r.points;
    counts.maxPoints += r.maxPoints;
    if (r.status === 'correct') {
      counts.correct++;
    } else if (r.status === 'incorrect' || r.status === 'partial') {
      counts.incorrect++;
    } else if (r.status === 'unanswered') {
      counts.unanswered++;
    } else {
      counts.pending++;
    }
  }
  return counts;
}
