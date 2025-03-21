import React from 'react';
import { Box, Typography, Paper, Stack, Divider, useTheme, useMediaQuery } from '@mui/material';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { useTaskStore } from '../../../store/taskStore';
import TaskItem from '../TaskItem';
import { Task } from '../../../types';

const TaskList: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { tasks, reorderTasks, editTask, deleteTask, toggleTaskStatus } = useTaskStore();
  
  const incompleteTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);
  
  const handleDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    
    if (!destination) {
      return;
    }

    const sourceIsComplete = source.droppableId === 'completed';
    const destinationIsComplete = destination.droppableId === 'completed';

    // If moving between sections, toggle completion status
    if (source.droppableId !== destination.droppableId) {
      const taskId = sourceIsComplete ? completedTasks[source.index].id : incompleteTasks[source.index].id;
      toggleTaskStatus(taskId);
      return;
    }

    // If within same section, reorder
    reorderTasks(source.index, destination.index, sourceIsComplete);
  };

  const handleEdit = (task: Task) => {
    const updates = {
      title: task.title,
      description: task.description,
      priority: task.priority || 'low'
    };
    editTask(task.id, updates);
  };

  const handleDelete = (taskId: string) => {
    deleteTask(taskId);
  };

  const handleToggleComplete = (taskId: string, completed: boolean) => {
    toggleTaskStatus(taskId);
  };

  const getDropStyle = (isDraggingOver: boolean) => ({
    background: isDraggingOver 
      ? theme.palette.action.hover 
      : theme.palette.background.default,
    transition: 'all 0.2s ease',
    minHeight: '100px',
    borderRadius: { xs: 1, sm: 2 },
    p: { xs: 1.5, sm: 2 },
    border: `1px solid ${isDraggingOver ? theme.palette.primary.main : theme.palette.divider}`,
  });

  const getDragItemStyle = (isDragging: boolean, draggableStyle: any) => ({
    padding: theme.spacing(1),
    marginBottom: theme.spacing(1),
    background: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    ...draggableStyle,
    transform: isDragging ? `${draggableStyle.transform} rotate(-2deg)` : draggableStyle.transform,
  });

  const getSectionStyle = (isCompleted: boolean) => ({
    mb: { xs: 2, sm: 3 },
    display: 'flex',
    alignItems: 'center',
    color: isCompleted ? theme.palette.success.main : theme.palette.primary.main,
    fontWeight: 600,
    fontSize: { xs: '1rem', sm: '1.25rem' },
    '& .MuiTypography-subtitle1': {
      fontSize: { xs: '0.875rem', sm: '1rem' },
      ml: 1,
    }
  });
  
  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Stack spacing={{ xs: 2, sm: 3, md: 4 }}>
        {/* Incomplete Tasks Section */}
        <Box>
          <Typography 
            variant="h6" 
            sx={getSectionStyle(false)}
          >
            Incomplete Tasks
            <Typography
              component="span"
              variant="subtitle1"
              color="text.secondary"
            >
              ({incompleteTasks.length})
            </Typography>
          </Typography>
          
          <Droppable droppableId="incomplete">
            {(provided, snapshot) => (
              <Paper
                {...provided.droppableProps}
                ref={provided.innerRef}
                elevation={0}
                sx={getDropStyle(snapshot.isDraggingOver)}
              >
                {incompleteTasks.length === 0 ? (
                  <Typography
                    align="center"
                    color="text.secondary"
                    sx={{ 
                      py: { xs: 3, sm: 4 },
                      fontSize: { xs: '0.875rem', sm: '1rem' }
                    }}
                  >
                    No incomplete tasks. Great job! 🎉
                  </Typography>
                ) : (
                  <div>
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
                  </div>
                )}
                {provided.placeholder}
              </Paper>
            )}
          </Droppable>
        </Box>

        <Divider 
          sx={{ 
            my: { xs: 2, sm: 3 },
            borderStyle: 'dashed',
            borderColor: theme.palette.divider,
            opacity: 0.5 
          }} 
        />

        {/* Completed Tasks Section */}
        <Box>
          <Typography 
            variant="h6" 
            sx={getSectionStyle(true)}
          >
            Completed Tasks
            <Typography
              component="span"
              variant="subtitle1"
              color="text.secondary"
            >
              ({completedTasks.length})
            </Typography>
          </Typography>
          
          <Droppable droppableId="completed">
            {(provided, snapshot) => (
              <Paper
                {...provided.droppableProps}
                ref={provided.innerRef}
                elevation={0}
                sx={getDropStyle(snapshot.isDraggingOver)}
              >
                {completedTasks.length === 0 ? (
                  <Typography
                    align="center"
                    color="text.secondary"
                    sx={{ 
                      py: { xs: 3, sm: 4 },
                      fontSize: { xs: '0.875rem', sm: '1rem' }
                    }}
                  >
                    No completed tasks yet. Keep going! 💪
                  </Typography>
                ) : (
                  <div>
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
                  </div>
                )}
                {provided.placeholder}
              </Paper>
            )}
          </Droppable>
        </Box>
      </Stack>
    </DragDropContext>
  );
};

export default TaskList; 