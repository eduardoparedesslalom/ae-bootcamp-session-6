import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TodoCard from '../TodoCard';

describe('TodoCard Component', () => {
  const mockTodo = {
    id: 1,
    title: 'Test Todo',
    dueDate: '2025-12-25',
    completed: 0,
    createdAt: '2025-11-01T00:00:00Z'
  };

  const mockHandlers = {
    onToggle: jest.fn(),
    onEdit: jest.fn(),
    onDelete: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render todo title and due date', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    expect(screen.getByText('Test Todo')).toBeInTheDocument();
    expect(screen.getByText(/December 25, 2025/)).toBeInTheDocument();
  });

  it('should render unchecked checkbox when todo is incomplete', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });

  it('should render checked checkbox when todo is complete', () => {
    const completedTodo = { ...mockTodo, completed: 1 };
    render(<TodoCard todo={completedTodo} {...mockHandlers} isLoading={false} />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  it('should call onToggle when checkbox is clicked', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    
    expect(mockHandlers.onToggle).toHaveBeenCalledWith(mockTodo.id);
  });

  it('should show edit button', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const editButton = screen.getByLabelText(/Edit/);
    expect(editButton).toBeInTheDocument();
  });

  it('should show delete button', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const deleteButton = screen.getByLabelText(/Delete/);
    expect(deleteButton).toBeInTheDocument();
  });

  it('should call onDelete when delete button is clicked and confirmed', () => {
    window.confirm = jest.fn(() => true);
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const deleteButton = screen.getByLabelText(/Delete/);
    fireEvent.click(deleteButton);
    
    expect(mockHandlers.onDelete).toHaveBeenCalledWith(mockTodo.id);
  });

  it('should enter edit mode when edit button is clicked', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const editButton = screen.getByLabelText(/Edit/);
    fireEvent.click(editButton);
    
    expect(screen.getByDisplayValue('Test Todo')).toBeInTheDocument();
  });

  it('should apply completed class when todo is completed', () => {
    const completedTodo = { ...mockTodo, completed: 1 };
    const { container } = render(<TodoCard todo={completedTodo} {...mockHandlers} isLoading={false} />);
    
    const card = container.querySelector('.todo-card');
    expect(card).toHaveClass('completed');
  });

  it('should not render due date when dueDate is null', () => {
    const todoNoDate = { ...mockTodo, dueDate: null };
    render(<TodoCard todo={todoNoDate} {...mockHandlers} isLoading={false} />);
    
    expect(screen.queryByText(/Due:/)).not.toBeInTheDocument();
  });
});

describe('TodoCard — Overdue indicator', () => {
  const PAST_DATE = '2025-01-01';
  const TODAY = '2026-05-26';
  const FUTURE_DATE = '2027-01-01';

  const mockHandlers = {
    onToggle: jest.fn(),
    onEdit: jest.fn(),
    onDelete: jest.fn()
  };

  const baseTodo = {
    id: 10,
    title: 'Overdue Test Todo',
    dueDate: PAST_DATE,
    completed: 0,
    createdAt: '2025-01-01T00:00:00Z'
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-05-26T12:00:00Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  // US1: View Overdue Tasks at a Glance
  it('shows Overdue badge for past due date when incomplete', () => {
    render(<TodoCard todo={baseTodo} {...mockHandlers} isLoading={false} />);
    expect(screen.getByText('Overdue')).toBeInTheDocument();
  });

  it('applies overdue CSS class to card for past+incomplete todo', () => {
    const { container } = render(<TodoCard todo={baseTodo} {...mockHandlers} isLoading={false} />);
    expect(container.querySelector('.todo-card')).toHaveClass('overdue');
  });

  it('does not show Overdue badge for completed todo with past due date', () => {
    const completedTodo = { ...baseTodo, completed: 1 };
    render(<TodoCard todo={completedTodo} {...mockHandlers} isLoading={false} />);
    expect(screen.queryByText('Overdue')).not.toBeInTheDocument();
  });

  it("does not show Overdue badge for today's due date", () => {
    const todayTodo = { ...baseTodo, dueDate: TODAY };
    render(<TodoCard todo={todayTodo} {...mockHandlers} isLoading={false} />);
    expect(screen.queryByText('Overdue')).not.toBeInTheDocument();
  });

  it('does not show Overdue badge for future due date', () => {
    const futureTodo = { ...baseTodo, dueDate: FUTURE_DATE };
    render(<TodoCard todo={futureTodo} {...mockHandlers} isLoading={false} />);
    expect(screen.queryByText('Overdue')).not.toBeInTheDocument();
  });

  it('does not show Overdue badge when dueDate is null', () => {
    const noDateTodo = { ...baseTodo, dueDate: null };
    render(<TodoCard todo={noDateTodo} {...mockHandlers} isLoading={false} />);
    expect(screen.queryByText('Overdue')).not.toBeInTheDocument();
  });

  it('Overdue badge has accessible text content', () => {
    render(<TodoCard todo={baseTodo} {...mockHandlers} isLoading={false} />);
    expect(screen.getByText('Overdue')).toBeInTheDocument();
  });

  // US2: Overdue State Updates When Completed
  it('badge disappears immediately when overdue todo is marked complete', () => {
    const { rerender } = render(<TodoCard todo={baseTodo} {...mockHandlers} isLoading={false} />);
    expect(screen.getByText('Overdue')).toBeInTheDocument();

    const completedTodo = { ...baseTodo, completed: 1 };
    rerender(<TodoCard todo={completedTodo} {...mockHandlers} isLoading={false} />);
    expect(screen.queryByText('Overdue')).not.toBeInTheDocument();
  });

  it('badge reappears when completed overdue todo is unchecked', () => {
    const completedTodo = { ...baseTodo, completed: 1 };
    const { rerender } = render(<TodoCard todo={completedTodo} {...mockHandlers} isLoading={false} />);
    expect(screen.queryByText('Overdue')).not.toBeInTheDocument();

    rerender(<TodoCard todo={baseTodo} {...mockHandlers} isLoading={false} />);
    expect(screen.getByText('Overdue')).toBeInTheDocument();
  });

  // US3: Overdue State Consistently Applied Across the List
  it('only shows Overdue badge for incomplete+past-due items in a mixed list', () => {
    const todos = [
      { ...baseTodo, id: 1, dueDate: PAST_DATE, completed: 0 },
      { ...baseTodo, id: 2, dueDate: PAST_DATE, completed: 1 },
      { ...baseTodo, id: 3, dueDate: TODAY, completed: 0 },
      { ...baseTodo, id: 4, dueDate: FUTURE_DATE, completed: 0 },
      { ...baseTodo, id: 5, dueDate: null, completed: 0 }
    ];

    render(
      <div>
        {todos.map(todo => (
          <TodoCard key={todo.id} todo={todo} {...mockHandlers} isLoading={false} />
        ))}
      </div>
    );

    const badges = screen.getAllByText('Overdue');
    expect(badges).toHaveLength(1);
  });
});
