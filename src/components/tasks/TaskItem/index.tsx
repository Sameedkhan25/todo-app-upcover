import React, { useState, useEffect } from 'react';
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
import { Task } from '../../../types';
import ReactConfetti from 'react-confetti';

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
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleToggleComplete = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newCompletedState = event.target.checked;
    if (newCompletedState) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
    onToggleComplete(task.id, newCompletedState);
  };

  return (
    <>
      {showConfetti && (
        <ReactConfetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={200}
          gravity={0.3}
        />
      )}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, x: -100 }}
        whileHover={{ scale: 1.02, translateY: -4 }}
        transition={{ 
          type: "spring",
          stiffness: 500,
          damping: 30
        }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <Card
          sx={{
            position: 'relative',
            borderRadius: { xs: 2, sm: 3 },
            boxShadow: isHovered ? 4 : 2,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            opacity: task.completed ? 0.8 : 1,
            transform: task.completed ? 'scale(0.98)' : 'scale(1)',
            bgcolor: (theme) => 
              task.completed 
                ? alpha(theme.palette.background.paper, 0.7)
                : theme.palette.background.paper,
            '&:hover': {
              boxShadow: 8,
              '& .MuiCardContent-root': {
                bgcolor: (theme) => alpha(theme.palette.action.hover, 0.05),
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
            }}
          >
            <Stack 
              direction="row" 
              spacing={2} 
              alignItems="flex-start"
              sx={{ position: 'relative' }}
            >
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
              
              <Box sx={{ flexGrow: 1 }}>
                <Stack 
                  direction={{ xs: 'column', sm: 'row' }} 
                  spacing={{ xs: 1, sm: 2 }} 
                  alignItems={{ xs: 'flex-start', sm: 'center' }} 
                  mb={1}
                >
                  <Typography
                    variant="h6"
                    component="div"
                    sx={{
                      fontSize: { xs: '1rem', sm: '1.25rem' },
                      textDecoration: task.completed ? 'line-through' : 'none',
                      color: task.completed ? 'text.secondary' : 'text.primary',
                      transition: 'all 0.2s ease',
                      wordBreak: 'break-word',
                    }}
                  >
                    {task.title}
                  </Typography>
                  
                  <Chip
                    icon={getPriorityIcon(task.priority)}
                    label={task.priority}
                    size={isMobile ? "small" : "medium"}
                    color={getPriorityColor(task.priority)}
                    sx={{
                      textTransform: 'capitalize',
                      fontWeight: 500,
                      transition: 'all 0.2s ease',
                      '& .MuiChip-icon': {
                        fontSize: { xs: 16, sm: 20 },
                      },
                      '&:hover': {
                        transform: 'scale(1.05)',
                      },
                    }}
                  />
                </Stack>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    textDecoration: task.completed ? 'line-through' : 'none',
                    opacity: task.completed ? 0.7 : 1,
                    transition: 'all 0.2s ease',
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    wordBreak: 'break-word',
                  }}
                >
                  {task.description}
                </Typography>
              </Box>

              <AnimatePresence>
                {(isHovered || task.completed || isMobile) && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    <Stack 
                      direction={{ xs: 'row', sm: 'row' }} 
                      spacing={1}
                      sx={{
                        position: { xs: 'static', sm: 'absolute' },
                        top: { sm: '50%' },
                        right: { sm: theme.spacing(2) },
                        transform: { sm: 'translateY(-50%)' },
                      }}
                    >
                      <Tooltip title="Edit task">
                        <IconButton
                          size={isMobile ? "small" : "medium"}
                          onClick={() => onEdit(task)}
                          aria-label="edit"
                          sx={{
                            color: 'primary.main',
                            bgcolor: 'primary.lighter',
                            '&:hover': { 
                              bgcolor: 'primary.light',
                              transform: 'scale(1.1)',
                            },
                            transition: 'all 0.2s ease',
                          }}
                        >
                          <EditIcon fontSize={isMobile ? "small" : "medium"} />
                        </IconButton>
                      </Tooltip>
                      
                      <Tooltip title="Delete task">
                        <IconButton
                          size={isMobile ? "small" : "medium"}
                          onClick={() => onDelete(task.id)}
                          aria-label="delete"
                          sx={{
                            color: 'error.main',
                            bgcolor: 'error.lighter',
                            '&:hover': { 
                              bgcolor: 'error.light',
                              transform: 'scale(1.1)',
                            },
                            transition: 'all 0.2s ease',
                          }}
                        >
                          <DeleteIcon fontSize={isMobile ? "small" : "medium"} />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </motion.div>
                )}
              </AnimatePresence>
            </Stack>
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
};

export default TaskItem; 