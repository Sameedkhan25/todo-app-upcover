import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskForm from './index';
import { TodoProvider } from '../../../store/TodoStore';

const renderWithProvider = (ui: React.ReactElement) => {
  return render(
    <TodoProvider>
      {ui}
    </TodoProvider>
  );
};

describe('TaskForm Component', () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders form elements correctly', () => {
    renderWithProvider(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} isEdit={true} />);

    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /update task/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    renderWithProvider(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    await act(async () => {
      const submitButton = screen.getByRole('button', { name: /add task/i });
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(screen.getByText(/title is required/i)).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('prevents duplicate task names when editing', async () => {
    renderWithProvider(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} isEdit={true} />);

    const titleInput = screen.getByLabelText(/title/i);
    const descriptionInput = screen.getByLabelText(/description/i);
    
    await act(async () => {
      await userEvent.type(titleInput, 'Existing Task');
      await userEvent.type(descriptionInput, 'Task Description');
    });

    await act(async () => {
      const submitButton = screen.getByRole('button', { name: /update task/i });
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: 'Existing Task',
        description: 'Task Description',
        priority: 'low'
      });
    });
  });

  it('submits form with valid data', async () => {
    renderWithProvider(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const titleInput = screen.getByLabelText(/title/i);
    const descriptionInput = screen.getByLabelText(/description/i);

    await act(async () => {
      await userEvent.type(titleInput, 'New Task');
      await userEvent.type(descriptionInput, 'Task Description');
    });

    await act(async () => {
      const submitButton = screen.getByRole('button', { name: /add task/i });
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: 'New Task',
        description: 'Task Description',
        priority: 'low'
      });
    });
  });

  it('calls onCancel when cancel button is clicked', async () => {
    renderWithProvider(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} isEdit={true} />);

    await act(async () => {
      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      fireEvent.click(cancelButton);
    });

    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('pre-fills form when editing existing task', () => {
    const existingTask = {
      title: 'Existing Task',
      description: 'Existing Description',
      priority: 'medium' as const
    };

    renderWithProvider(
      <TaskForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        isEdit={true}
        initialValues={existingTask}
      />
    );

    expect(screen.getByLabelText(/title/i)).toHaveValue(existingTask.title);
    expect(screen.getByLabelText(/description/i)).toHaveValue(existingTask.description);
  });
}); 