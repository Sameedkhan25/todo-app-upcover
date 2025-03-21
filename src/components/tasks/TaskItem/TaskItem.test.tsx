import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TaskItem from './index';
import { Task } from '../../../types';
import { TodoProvider } from '../../../store/TodoStore';

// Mock useMediaQuery to simulate mobile view
jest.mock('@mui/material', () => ({
  ...jest.requireActual('@mui/material'),
  useMediaQuery: () => true,
}));

type Priority = 'low' | 'medium' | 'high';
type TaskWithPriority = Task & { priority: Priority };

const renderWithProvider = (ui: React.ReactElement) => {
  return render(
    <TodoProvider>
      {ui}
    </TodoProvider>
  );
};

describe('TaskItem Component', () => {
  const mockTask: TaskWithPriority = {
    id: '1',
    title: 'Test Task',
    description: 'Test Description',
    completed: false,
    createdAt: Date.now(),
    priority: 'low'
  };

  const mockHandlers = {
    onToggle: jest.fn(),
    onEdit: jest.fn(),
    onDelete: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders task details correctly', () => {
    renderWithProvider(
      <TaskItem
        task={mockTask}
        onToggleComplete={mockHandlers.onToggle}
        onEdit={mockHandlers.onEdit}
        onDelete={mockHandlers.onDelete}
      />
    );

    expect(screen.getByText(mockTask.title)).toBeInTheDocument();
    expect(screen.getByText(mockTask.description)).toBeInTheDocument();
  });

  it('calls onToggleComplete when checkbox is clicked', () => {
    renderWithProvider(
      <TaskItem
        task={mockTask}
        onToggleComplete={mockHandlers.onToggle}
        onEdit={mockHandlers.onEdit}
        onDelete={mockHandlers.onDelete}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(mockHandlers.onToggle).toHaveBeenCalledWith(mockTask.id, !mockTask.completed);
  });

  it('calls onEdit when edit button is clicked', () => {
    renderWithProvider(
      <TaskItem
        task={mockTask}
        onToggleComplete={mockHandlers.onToggle}
        onEdit={mockHandlers.onEdit}
        onDelete={mockHandlers.onDelete}
      />
    );

    const editButton = screen.getByTestId('edit-button');
    fireEvent.click(editButton);

    expect(mockHandlers.onEdit).toHaveBeenCalledWith(mockTask);
  });

  it('calls onDelete when delete button is clicked', () => {
    renderWithProvider(
      <TaskItem
        task={mockTask}
        onToggleComplete={mockHandlers.onToggle}
        onEdit={mockHandlers.onEdit}
        onDelete={mockHandlers.onDelete}
      />
    );

    const deleteButton = screen.getByTestId('delete-button');
    fireEvent.click(deleteButton);

    expect(mockHandlers.onDelete).toHaveBeenCalledWith(mockTask.id);
  });

  it('shows completed status when task is completed', () => {
    const completedTask: TaskWithPriority = { ...mockTask, completed: true };
    renderWithProvider(
      <TaskItem
        task={completedTask}
        onToggleComplete={mockHandlers.onToggle}
        onEdit={mockHandlers.onEdit}
        onDelete={mockHandlers.onDelete}
      />
    );

    const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
    expect(checkbox.checked).toBe(true);
  });
}); 