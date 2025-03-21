import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Box,
  Chip,
  Stack,
  Tooltip,
  Checkbox,
  alpha,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FlagIcon from '@mui/icons-material/Flag';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { Task } from '../../../types';
import { useSwipeable } from 'react-swipeable';

type Priority = 'low' | 'medium' | 'high';

const getPriorityColor = (priority: Priority) => {
  switch (priority) {
    case 'high':
      return 'error';
    case 'medium':
      return 'warning';
    case 'low':
      return 'info';
    default:
      return 'info';
  }
};

const getPriorityIcon = (priority: Priority) => {
  switch (priority) {
    case 'high':
      return <ErrorOutlineIcon fontSize="small" />;
    case 'medium':
      return <FlagIcon fontSize="small" />;
    case 'low':
      return <InfoOutlinedIcon fontSize="small" />;
    default:
      return <InfoOutlinedIcon fontSize="small" />;
  }
};

interface TaskItemProps {
  task: Task & { priority: Priority };
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onToggleComplete: (taskId: string, completed: boolean) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onEdit,
  onDelete,
  onToggleComplete,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [isHovered, setIsHovered] = useState(false);
  const [swipeOffset, setSwipeOffset] = useState(0);

  const swipeHandlers = useSwipeable({
    onSwiping: (event) => {
      if (isMobile) {
        const newOffset = event.deltaX;
        // Limit the swipe range
        if (newOffset >= -200 && newOffset <= 100) {
          setSwipeOffset(newOffset);
        }
      }
    },
    onSwipedLeft: () => {
      if (isMobile) {
        setSwipeOffset(-200); // Full left swipe reveals edit/delete
      }
    },
    onSwipedRight: () => {
      if (isMobile) {
        setSwipeOffset(100); // Full right swipe reveals complete
        if (!task.completed) {
          handleToggleComplete({ target: { checked: true } } as React.ChangeEvent<HTMLInputElement>);
        }
      }
    },
    onTouchEndOrOnMouseUp: () => {
      if (isMobile) {
        // Snap to positions
        if (swipeOffset > 50) {
          setSwipeOffset(100);
        } else if (swipeOffset < -100) {
          setSwipeOffset(-200);
        } else {
          setSwipeOffset(0);
        }
      }
    },
    trackMouse: true,
    trackTouch: true,
  });

  const handleToggleComplete = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newCompletedState = event.target.checked;
    if (!task?.id) {
      console.error('Task or task ID is missing');
      return;
    }
    try {
      onToggleComplete(task.id, newCompletedState);
      if (isMobile) {
        setSwipeOffset(0);
      }
    } catch (error) {
      console.error('Error toggling task completion:', error);
    }
  };

  const handleEdit = () => {
    onEdit(task);
    if (isMobile) {
      setSwipeOffset(0);
    }
  };

  const handleDelete = () => {
    if (!task?.id) {
      console.error('Task ID is missing');
      return;
    }
    try {
      onDelete(task.id);
      if (isMobile) {
        setSwipeOffset(0);
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click event
    const action = e.currentTarget.getAttribute('data-action');
    if (action === 'edit') {
      handleEdit();
    } else if (action === 'delete') {
      handleDelete();
    }
  };

  return (
    <>
      <Box
        sx={{
          position: 'relative',
          opacity: 1,
        }}
      >
        {/* Mobile Swipe Actions Background */}
        {isMobile && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              justifyContent: 'space-between',
              borderRadius: { xs: 2, sm: 3 },
              overflow: 'hidden',
              zIndex: 0,
              opacity: swipeOffset !== 0 ? 1 : 0,
              transition: 'opacity 0.2s ease',
            }}
          >
            {/* Right swipe - Complete */}
            <Box
              sx={{
                position: 'absolute',
                left: 0,
                width: '100px',
                height: '100%',
                bgcolor: 'success.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CheckCircleOutlineIcon sx={{ color: 'white', fontSize: '2rem' }} />
            </Box>
            {/* Left swipe - Edit/Delete */}
            <Box
              sx={{
                position: 'absolute',
                right: 0,
                width: '200px',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Box
                component="button"
                onClick={handleActionClick}
                data-action="edit"
                sx={{
                  flex: 1,
                  height: '100%',
                  bgcolor: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                  '&:active': {
                    bgcolor: 'primary.dark',
                    transform: 'scale(0.98)',
                  },
                }}
              >
                <EditIcon sx={{ color: 'white', fontSize: '1.5rem' }} />
              </Box>
              <Box
                component="button"
                onClick={handleActionClick}
                data-action="delete"
                sx={{
                  flex: 1,
                  height: '100%',
                  bgcolor: 'error.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease',
                  '&:hover': {
                    bgcolor: 'error.dark',
                  },
                  '&:active': {
                    bgcolor: 'error.dark',
                    transform: 'scale(0.98)',
                  },
                }}
              >
                <DeleteIcon sx={{ color: 'white', fontSize: '1.5rem' }} />
              </Box>
            </Box>
          </Box>
        )}

        {/* Main Card Content */}
        <Box
          {...(isMobile ? swipeHandlers : {})}
          sx={{
            position: 'relative',
            zIndex: 1,
            transform: isMobile ? `translateX(${swipeOffset}px)` : 'none',
            transition: isMobile ? 'transform 0.2s ease-out' : 'none',
          }}
        >
          <Card
            onMouseEnter={() => !isMobile && setIsHovered(true)}
            onMouseLeave={() => !isMobile && setIsHovered(false)}
            sx={{
              position: 'relative',
              borderRadius: { xs: 2, sm: 3 },
              boxShadow: isHovered ? 4 : 2,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              opacity: task.completed ? 0.85 : 1,
              transform: task.completed ? 'scale(0.98)' : 'scale(1)',
              bgcolor: (theme) => 
                task.completed 
                  ? alpha(theme.palette.background.paper, 0.7)
                  : theme.palette.background.paper,
              '&:hover': {
                boxShadow: !isMobile ? 8 : 2,
                '& .MuiCardContent-root': {
                  bgcolor: (theme) => !isMobile ? alpha(theme.palette.action.hover, 0.05) : 'transparent',
                },
              },
              overflow: 'visible',
            }}
          >
            <CardContent
              sx={{
                transition: 'background-color 0.3s ease',
                p: { xs: 2, sm: 3 },
                '&:last-child': { pb: { xs: 2, sm: 3 } },
                position: 'relative',
                ...(task.completed && {
                  bgcolor: (theme) => alpha(theme.palette.action.hover, 0.1),
                }),
              }}
            >
              <Stack 
                direction="row" 
                spacing={2} 
                alignItems="flex-start"
                sx={{ position: 'relative' }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                  <Checkbox
                    checked={task.completed}
                    onChange={handleToggleComplete}
                    sx={{
                      '& .MuiSvgIcon-root': {
                        fontSize: { xs: 24, sm: 28 },
                        transition: 'all 0.2s ease',
                      },
                      '&.Mui-checked': {
                        color: (theme) => theme.palette[getPriorityColor(task.priority)].main,
                        '& .MuiSvgIcon-root': {
                          transform: 'scale(1.2)',
                        },
                      },
                      '&:hover': {
                        '& .MuiSvgIcon-root': {
                          transform: 'scale(1.1)',
                        },
                      },
                    }}
                  />
                  <Chip
                    icon={getPriorityIcon(task.priority)}
                    label={task.priority}
                    size={isMobile ? "small" : "medium"}
                    color={getPriorityColor(task.priority)}
                    sx={{
                      textTransform: 'capitalize',
                      fontWeight: 500,
                      height: { xs: 24, sm: 32 },
                      minWidth: { xs: 72, sm: 86 },
                      opacity: task.completed ? 0.8 : 1,
                      '& .MuiChip-icon': {
                        fontSize: { xs: 16, sm: 20 },
                        marginLeft: { xs: 0.5, sm: 1 },
                      },
                      '& .MuiChip-label': {
                        px: { xs: 1, sm: 1.5 },
                      },
                    }}
                  />
                </Box>
                
                <Box sx={{ flexGrow: 1, pr: !isMobile ? 11 : 0 }}>
                  <Stack 
                    direction="column"
                    spacing={1}
                    sx={{ width: '100%' }}
                  >
                    <Typography
                      variant="h6"
                      component="div"
                      sx={{
                        fontSize: { xs: '1.125rem', sm: '1.25rem' },
                        fontWeight: 600,
                        textDecoration: task.completed ? 'line-through' : 'none',
                        color: task.completed ? 'text.secondary' : 'text.primary',
                        transition: 'all 0.2s ease',
                        wordBreak: 'break-word',
                        width: '100%',
                      }}
                    >
                      {task.title}
                    </Typography>

                    {task.description && (
                      <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{
                          textDecoration: task.completed ? 'line-through' : 'none',
                          opacity: task.completed ? 0.7 : 1,
                          transition: 'all 0.2s ease',
                          fontSize: { xs: '0.9375rem', sm: '1rem' },
                          lineHeight: 1.6,
                          wordBreak: 'break-word',
                        }}
                      >
                        {task.description}
                      </Typography>
                    )}
                  </Stack>
                </Box>

                {/* Desktop Actions */}
                {!isMobile && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      right: theme.spacing(3),
                      transform: 'translateY(-50%)',
                      zIndex: 2,
                      opacity: isHovered || task.completed ? 1 : 0,
                      transition: 'opacity 0.2s ease',
                      display: 'flex',
                      gap: 1,
                    }}
                  >
                    <Tooltip title="Edit task">
                      <IconButton
                        onClick={handleEdit}
                        aria-label="edit"
                        size="small"
                        sx={{
                          color: 'white',
                          bgcolor: 'primary.main',
                          width: 32,
                          height: 32,
                          '&:hover': { 
                            bgcolor: 'primary.dark',
                          },
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    
                    <Tooltip title="Delete task">
                      <IconButton
                        onClick={handleDelete}
                        aria-label="delete"
                        size="small"
                        sx={{
                          color: 'white',
                          bgcolor: 'error.main',
                          width: 32,
                          height: 32,
                          '&:hover': { 
                            bgcolor: 'error.dark',
                          },
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </>
  );
};

export default TaskItem; 