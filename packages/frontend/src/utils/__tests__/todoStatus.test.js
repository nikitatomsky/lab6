import { isOverdue } from '../todoStatus';

describe('isOverdue', () => {
  const referenceDate = new Date('2025-06-15T12:00:00Z');

  it('returns true for an incomplete todo with a past due date', () => {
    const todo = { dueDate: '2025-06-14', completed: 0 };
    expect(isOverdue(todo, referenceDate)).toBe(true);
  });

  it('returns false for a todo due today', () => {
    const todo = { dueDate: '2025-06-15', completed: 0 };
    expect(isOverdue(todo, referenceDate)).toBe(false);
  });

  it('returns false for a todo with a future due date', () => {
    const todo = { dueDate: '2025-06-16', completed: 0 };
    expect(isOverdue(todo, referenceDate)).toBe(false);
  });

  it('returns false for a todo with no due date', () => {
    const todo = { dueDate: null, completed: 0 };
    expect(isOverdue(todo, referenceDate)).toBe(false);
  });

  it('returns false for a completed todo with a past due date', () => {
    const todo = { dueDate: '2025-06-14', completed: 1 };
    expect(isOverdue(todo, referenceDate)).toBe(false);
  });

  it('returns true when referenceDate is one calendar day after dueDate', () => {
    const todo = { dueDate: '2025-06-14', completed: 0 };
    const oneDayLater = new Date('2025-06-15T00:00:00Z');
    expect(isOverdue(todo, oneDayLater)).toBe(true);
  });

  it('returns false when referenceDate equals dueDate', () => {
    const todo = { dueDate: '2025-06-14', completed: 0 };
    const sameDay = new Date('2025-06-14T23:59:59Z');
    expect(isOverdue(todo, sameDay)).toBe(false);
  });
});
