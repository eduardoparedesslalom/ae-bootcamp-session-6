/**
 * Determines whether a todo item is overdue.
 *
 * A todo is overdue when ALL of the following are true:
 *   1. dueDate is a non-empty string
 *   2. dueDate is strictly before today's date (YYYY-MM-DD string comparison)
 *   3. completed is falsy (0, false, null, undefined)
 *
 * @param {string|null} dueDate - ISO date string ('YYYY-MM-DD') or null/undefined
 * @param {boolean|number} completed - Whether the todo is completed (truthy = done)
 * @returns {boolean} true if the todo is overdue, false otherwise
 */
export function isOverdue(dueDate, completed) {
  if (!dueDate) return false;
  const today = new Date().toISOString().split('T')[0];
  return dueDate < today && !completed;
}
