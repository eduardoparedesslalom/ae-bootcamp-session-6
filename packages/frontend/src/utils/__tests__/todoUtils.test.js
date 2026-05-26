import { isOverdue } from '../todoUtils';

const MOCK_TODAY = '2026-05-26';
const PAST_DATE = '2025-01-01';
const FUTURE_DATE = '2027-01-01';

beforeEach(() => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date('2026-05-26T12:00:00Z'));
});

afterEach(() => {
  jest.useRealTimers();
});

describe('isOverdue', () => {
  it('returns false when dueDate is null', () => {
    expect(isOverdue(null, false)).toBe(false);
  });

  it('returns false when dueDate is undefined', () => {
    expect(isOverdue(undefined, false)).toBe(false);
  });

  it('returns false when dueDate is empty string', () => {
    expect(isOverdue('', false)).toBe(false);
  });

  it('returns true for past date with completed=false', () => {
    expect(isOverdue(PAST_DATE, false)).toBe(true);
  });

  it('returns true for past date with completed=0 (SQLite integer false)', () => {
    expect(isOverdue(PAST_DATE, 0)).toBe(true);
  });

  it('returns false for past date with completed=true', () => {
    expect(isOverdue(PAST_DATE, true)).toBe(false);
  });

  it('returns false for past date with completed=1 (SQLite integer true)', () => {
    expect(isOverdue(PAST_DATE, 1)).toBe(false);
  });

  it("returns false for today's date", () => {
    expect(isOverdue(MOCK_TODAY, false)).toBe(false);
  });

  it('returns false for future date', () => {
    expect(isOverdue(FUTURE_DATE, false)).toBe(false);
  });
});
