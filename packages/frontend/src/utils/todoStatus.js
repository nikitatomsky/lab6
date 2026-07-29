/**
 * Returns true when the todo has a due date strictly before the reference date's calendar
 * date and is not yet completed; compares dates only, ignoring time-of-day.
 * @param {{ dueDate: string|null, completed: number|boolean }} todo
 * @param {Date} [referenceDate] - defaults to now
 * @returns {boolean}
 */
export function isOverdue(todo, referenceDate = new Date()) {
  if (!todo.dueDate || todo.completed) {
    return false;
  }

  return todo.dueDate < toLocalDateString(referenceDate);
}

function toLocalDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
