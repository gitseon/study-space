// The eraser only marks choices the learner has ruled out. Marks hang on choice IDs, never on screen positions,
// and nothing here is read by grading, so an erased choice can still be picked and scoring is unaffected.
const PREFERENCE_KEY = 'study-space:choice-eraser';
const BLOCKED_KEYS = new Set(['__proto__', 'constructor', 'prototype']);
const CHOICES_PER_QUESTION = 4;

const isPlainObject = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const choiceQuestions = (attempt) => new Map((attempt.snapshot?.questions || []).filter((q) => q.type === 'mc').map((q) => [q.id, q]));

// True when the optional eraser fields have the expected shape. Called before an attempt is stored or imported.
export function eraserFieldsValid(attempt) {
  if (attempt.eraserEnabled !== undefined && typeof attempt.eraserEnabled !== 'boolean') {
    return false;
  }
  if (attempt.eliminatedChoices === undefined) {
    return true;
  }
  const marks = attempt.eliminatedChoices;
  if (!isPlainObject(marks)) {
    return false;
  }
  const keys = Object.keys(marks);
  if (keys.length > (attempt.snapshot?.questions?.length || 0)) {
    return false;
  }
  return keys.every((key) => !BLOCKED_KEYS.has(key) && Array.isArray(marks[key])
    && marks[key].length <= CHOICES_PER_QUESTION && marks[key].every((id) => typeof id === 'string'));
}

// The usable marks: choices of choice questions in the snapshot, without repeats and without the chosen answer.
export function normalizeEliminations(attempt) {
  const result = {};
  const questions = choiceQuestions(attempt);
  const marks = isPlainObject(attempt.eliminatedChoices) ? attempt.eliminatedChoices : {};
  for (const key of Object.keys(marks)) {
    const question = questions.get(key);
    if (BLOCKED_KEYS.has(key) || !question || !Array.isArray(marks[key])) {
      continue;
    }
    const known = new Set(question.choices.map((c) => c.id));
    const ids = [...new Set(marks[key])].filter((id) => known.has(id) && id !== attempt.answers?.[key]);
    if (ids.length) {
      result[key] = ids;
    }
  }
  return result;
}

export const isEditable = (attempt, questionId) => !attempt.submittedAt && !(attempt.revealed || []).includes(questionId);

// Erases or restores one choice. Returns whether anything changed.
export function toggleElimination(attempt, questionId, choiceId) {
  const question = choiceQuestions(attempt).get(questionId);
  if (BLOCKED_KEYS.has(questionId) || !question || !isEditable(attempt, questionId) || !question.choices.some((c) => c.id === choiceId)) {
    return false;
  }
  // An erased choice cannot stay the answer, so erasing the chosen one withdraws the answer too.
  if (attempt.answers?.[questionId] === choiceId) {
    delete attempt.answers[questionId];
  }
  attempt.eliminatedChoices ??= {};
  const current = attempt.eliminatedChoices[questionId] || [];
  if (current.includes(choiceId)) {
    clearElimination(attempt, questionId, choiceId);
  } else {
    attempt.eliminatedChoices[questionId] = [...current, choiceId];
  }
  return true;
}

export function clearElimination(attempt, questionId, choiceId) {
  const marks = attempt.eliminatedChoices;
  if (!marks || BLOCKED_KEYS.has(questionId) || !Array.isArray(marks[questionId])) {
    return;
  }
  const rest = marks[questionId].filter((id) => id !== choiceId);
  if (rest.length) {
    marks[questionId] = rest;
  } else {
    delete marks[questionId];
  }
}

// The attempt's own setting wins so a resumed attempt looks as it did; otherwise the latest browser setting; otherwise on.
export function isEraserEnabled(attempt, preference) {
  if (typeof attempt.eraserEnabled === 'boolean') {
    return attempt.eraserEnabled;
  }
  return typeof preference === 'boolean' ? preference : true;
}

export function readEraserPreference(storage) {
  try {
    const value = storage?.getItem(PREFERENCE_KEY);
    return value === 'on' ? true : value === 'off' ? false : null;
  } catch {
    return null;
  }
}

export function writeEraserPreference(storage, enabled) {
  try {
    storage?.setItem(PREFERENCE_KEY, enabled ? 'on' : 'off');
  } catch {
    // The setting only applies to this page view when the browser blocks storage.
  }
}
