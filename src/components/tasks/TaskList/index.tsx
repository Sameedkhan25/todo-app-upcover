import React, { useState } from 'react';
import { Box, Typography, Paper, Stack, Divider, useTheme, Container, Dialog, useMediaQuery } from '@mui/material';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { motion, AnimatePresence } from 'framer-motion';
import { useTaskStore } from '../../../store/taskStore';
import TaskItem from '../TaskItem';
import TaskForm from '../TaskForm';
import { Task } from '../../../types';
import { TaskInput } from '../../../types';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { alpha } from '@mui/material/styles';

const TaskList: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { tasks, reorderTasks, editTask, deleteTask, toggleTaskStatus } = useTaskStore();
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  
  // Ensure we only get valid tasks
  const incompleteTasks = tasks?.filter(task => task && !task.completed) ?? [];
  const completedTasks = tasks?.filter(task => task && task.completed) ?? [];
  
  const handleDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    
    if (!destination) {
      return;
    }

    const sourceIsComplete = source.droppableId === 'completed';
    // @ts-ignore - Will be used for future drag-and-drop enhancements
    const destinationIsComplete = destination.droppableId === 'completed';
    const taskList = sourceIsComplete ? completedTasks : incompleteTasks;
    
    // If moving between sections, toggle completion status
    if (source.droppableId !== destination.droppableId) {
      const task = taskList[source.index];
      if (task?.id) {
        toggleTaskStatus(task.id);
      }
      return;
    }

    // If within same section, reorder
    if (source.index !== destination.index) {
      reorderTasks(source.index, destination.index, sourceIsComplete);
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
  };

  const handleEditSubmit = (updates: TaskInput): Task => {
    if (!editingTask) {
      throw new Error('No task is being edited');
    }

    // Check for duplicate title
    const duplicateTask = tasks.find(
      task => task.title === updates.title && task.id !== editingTask.id
    );
    
    if (duplicateTask) {
      throw new Error('A task with this title already exists');
    }

    editTask(editingTask.id, updates);
    setEditingTask(null);

    // Return the updated task
    return {
      ...editingTask,
      ...updates,
      updatedAt: Date.now(),
    };
  };

  const handleDelete = (taskId: string) => {
    deleteTask(taskId);
  };

  // @ts-ignore - Will be used for future status tracking
  const handleToggleComplete = (taskId: string, completed: boolean) => {
    if (!taskId || typeof taskId !== 'string') {
      console.error('Invalid task ID:', taskId);
      return;
    }
    
    const task = tasks?.find(t => t?.id === taskId);
    if (!task) {
      console.error('Task not found:', taskId);
      return;
    }
    
    try {
      toggleTaskStatus(taskId);
    } catch (error) {
      console.error('Error toggling task status:', error);
    }
  };

  const getDropStyle = (isDraggingOver: boolean) => ({
    background: isDraggingOver 
      ? theme.palette.action.hover 
      : theme.palette.background.default,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    minHeight: '100px',
    borderRadius: { xs: 2, sm: 3 },
    p: { xs: 2, sm: 3 },
    border: `2px dashed ${isDraggingOver ? theme.palette.primary.main : theme.palette.divider}`,
    backdropFilter: 'blur(8px)',
  });

  const getDragItemStyle = (isDragging: boolean, draggableStyle: any) => ({
    padding: theme.spacing(1),
    marginBottom: theme.spacing(2),
    background: 'transparent',
    borderRadius: theme.shape.borderRadius,
    ...draggableStyle,
    transform: isDragging && draggableStyle?.transform
      ? `${draggableStyle.transform} rotate(-2deg) scale(1.02)`
      : draggableStyle?.transform || 'none',
  });

  const getSectionStyle = (isCompleted: boolean) => ({
    mb: { xs: 2, sm: 3 },
    display: 'flex',
    alignItems: 'center',
    gap: 1.5,
    color: isCompleted ? theme.palette.success.main : theme.palette.primary.main,
    '& .MuiSvgIcon-root': {
      fontSize: { xs: 28, sm: 32 },
      filter: 'drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.1))',
    },
    '& .section-title': {
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontWeight: 700,
      fontSize: { xs: '1.35rem', sm: '1.65rem' },
      letterSpacing: '-0.01em',
      color: theme.palette.text.primary,
      display: 'flex',
      alignItems: 'center',
      gap: 1,
    },
    '& .task-count': {
      fontSize: { xs: '0.9rem', sm: '1rem' },
      fontWeight: 500,
      color: theme.palette.text.secondary,
      backgroundColor: theme.palette.action.hover,
      padding: '0.2em 0.6em',
      borderRadius: '1em',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: '2em',
      height: '1.75em',
      boxShadow: 'inset 0 0 0 1px rgba(0, 0, 0, 0.05)',
    }
  });

  // @ts-ignore - Will be used for future animations
  const containerAnimation = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const sectionAnimation = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  };
  
  return (
    <>
      <Dialog
        open={!!editingTask}
        onClose={() => setEditingTask(null)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: { xs: 2, sm: 3 },
            p: { xs: 2, sm: 3 },
            bgcolor: (theme) => alpha(theme.palette.background.paper, 0.95),
            backdropFilter: 'blur(8px)',
          },
        }}
      >
        {editingTask && (
          <TaskForm
            onSubmit={handleEditSubmit}
            onCancel={() => setEditingTask(null)}
            initialValues={{
              title: editingTask.title,
              description: editingTask.description,
              priority: editingTask.priority || 'low',
            }}
            isEdit
          />
        )}
      </Dialog>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3 } }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Stack spacing={4}>
              {/* Incomplete Tasks Section */}
              <motion.div variants={sectionAnimation}>
                <Box>
                  <Stack 
                    direction="row" 
                    alignItems="center" 
                    spacing={1.5}
                    sx={getSectionStyle(false)}
                  >
                    <AssignmentIcon />
                    <Box className="section-title">
                      In Progress Tasks
                      <Typography
                        component="span"
                        className="task-count"
                      >
                        {incompleteTasks.length}
                      </Typography>
                    </Box>
                  </Stack>
                  
                  {isMobile && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mt: 1.5,
                        mb: 2.5,
                        fontStyle: 'italic',
                        fontSize: '0.875rem',
                        opacity: 0.8,
                        textAlign: 'center',
                        fontFamily: '"Inter", sans-serif',
                        letterSpacing: '0.01em',
                        background: (theme) => alpha(theme.palette.background.paper, 0.6),
                        backdropFilter: 'blur(8px)',
                        borderRadius: 1,
                        py: 1,
                        px: 2,
                        mx: 'auto',
                        maxWidth: 'fit-content',
                        border: '1px solid',
                        borderColor: 'divider',
                      }}
                    >
                      Swipe right to complete, swipe left to edit or delete
                    </Typography>
                  )}
                  
                  <Box mt={2}>
                    <Droppable droppableId="incomplete">
                      {(provided, snapshot) => (
                        <Paper
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          elevation={0}
                          sx={getDropStyle(snapshot.isDraggingOver)}
                        >
                          <AnimatePresence mode="wait">
                            {incompleteTasks.length === 0 ? (
                              <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                              >
                                <Typography
                                  align="center"
                                  color="text.secondary"
                                  sx={{ 
                                    py: { xs: 4, sm: 6 },
                                    fontSize: { xs: '1rem', sm: '1.125rem' },
                                    fontWeight: 500
                                  }}
                                >
                                  No incomplete tasks. Great job! 🎉
                                </Typography>
                              </motion.div>
                            ) : (
                              <motion.div layout>
                                {incompleteTasks.map((task, index) => (
                                  <Draggable 
                                    key={task.id} 
                                    draggableId={task.id} 
                                    index={index}
                                  >
                                    {(provided, snapshot) => (
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        style={getDragItemStyle(
                                          snapshot.isDragging,
                                          provided.draggableProps.style
                                        )}
                                      >
                                        <TaskItem
                                          task={{ ...task, priority: task.priority || 'low' }}
                                          onEdit={handleEdit}
                                          onDelete={handleDelete}
                                          onToggleComplete={handleToggleComplete}
                                        />
                                      </div>
                                    )}
                                  </Draggable>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                          {provided.placeholder}
                        </Paper>
                      )}
                    </Droppable>
                  </Box>
                </Box>
              </motion.div>

              <Divider 
                sx={{ 
                  my: { xs: 3, sm: 4 },
                  borderStyle: 'dashed',
                  borderColor: theme.palette.divider,
                  opacity: 0.5 
                }} 
              />

              {/* Completed Tasks Section */}
              <motion.div variants={sectionAnimation}>
                <Box>
                  <Stack 
                    direction="row" 
                    alignItems="center" 
                    spacing={1.5}
                    sx={getSectionStyle(true)}
                  >
                    <CheckCircleIcon />
                    <Box className="section-title">
                      Completed Tasks
                      <Typography
                        component="span"
                        className="task-count"
                      >
                        {completedTasks.length}
                      </Typography>
                    </Box>
                  </Stack>
                  
                  <Box mt={2}>
                    <Droppable droppableId="completed">
                      {(provided, snapshot) => (
                        <Paper
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          elevation={0}
                          sx={getDropStyle(snapshot.isDraggingOver)}
                        >
                          <AnimatePresence mode="wait">
                            {completedTasks.length === 0 ? (
                              <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                              >
                                <Typography
                                  align="center"
                                  color="text.secondary"
                                  sx={{ 
                                    py: { xs: 4, sm: 6 },
                                    fontSize: { xs: '1rem', sm: '1.125rem' },
                                    fontWeight: 500
                                  }}
                                >
                                  No completed tasks yet. Keep going! 💪
                                </Typography>
                              </motion.div>
                            ) : (
                              <motion.div layout>
                                {completedTasks.map((task, index) => (
                                  <Draggable 
                                    key={task.id} 
                                    draggableId={task.id} 
                                    index={index}
                                  >
                                    {(provided, snapshot) => (
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        style={getDragItemStyle(
                                          snapshot.isDragging,
                                          provided.draggableProps.style
                                        )}
                                      >
                                        <TaskItem
                                          task={{ ...task, priority: task.priority || 'low' }}
                                          onEdit={handleEdit}
                                          onDelete={handleDelete}
                                          onToggleComplete={handleToggleComplete}
                                        />
                                      </div>
                                    )}
                                  </Draggable>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                          {provided.placeholder}
                        </Paper>
                      )}
                    </Droppable>
                  </Box>
                </Box>
              </motion.div>
            </Stack>
          </motion.div>
        </Container>
      </DragDropContext>
    </>
  );
};

export default TaskList; 