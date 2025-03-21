# taskify

Transform your productivity with task management

taskify is a modern, elegant todo application built with React and TypeScript that helps you organize your tasks with powerful features like drag-and-drop reordering, state persistence, and a mobile-first responsive design.

## 🌟 Features

### Core Functionality
- **Complete Task Management**: Create, edit, delete, and mark tasks as complete/incomplete
- **Task Organization**: Separate views for incomplete and completed tasks
- **Data Persistence**: All your tasks are automatically saved to localStorage
- **Validation**: Prevents duplicate task names and ensures proper input validation

### Advanced Features
- **Drag & Drop Reordering**: Intuitively reorganize tasks within each section
- **Mobile-First Design**: Beautiful interface optimized for all devices
- **Mobile Swipe Actions**: Swipe left/right on tasks to reveal edit and delete actions
- **Priority Levels**: Assign Low/Medium/High priority to tasks
- **Confirmation Dialogs**: Prevents accidental deletion of tasks
- **Error Boundary**: Global error handling to prevent app crashes

## 🚀 Technology Stack

- **Frontend**: React 18 with TypeScript
- **State Management**: Zustand for simple, efficient state handling
- **UI Framework**: Material UI v6.4.2
- **Drag & Drop**: react-beautiful-dnd
- **Testing**: Jest and React Testing Library

## 📋 Getting Started

### Prerequisites
- Node.js (v16.0.0 or later)
- npm or yarn

### Installation

1. Clone the repository
```bash
git git clone https://github.com/Sameedkhan25/todo-app-upcover.git
cd /todo-app-upcover
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Start the development server
```bash
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 🧪 Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

## 🏗️ Project Structure

```
/src
  /components
    /TaskForm        # Task creation and editing
    /TaskList        # Lists of tasks
    /TaskItem        # Individual task component
    /ErrorBoundary   # Global error handling
  /store
    taskStore.ts     # Zustand state management
  /types
    index.ts         # TypeScript type definitions
  /utils
    localStorage.ts  # Local storage utilities
  /hooks
    useDragDrop.ts   # Custom drag & drop hooks
  /tests
    # Test files
  App.tsx
  main.tsx
```

## 📱 Mobile Features

TaskCanvas offers a specially designed mobile experience:
- **Swipe Actions**: Swipe left on tasks to reveal edit and delete options
- **Touch-Friendly UI**: Large touch targets for better mobile interaction
- **Responsive Design**: Adapts perfectly to any screen size

## 🌐 Deployment

The application can be deployed to services 

```bash
# Build the application
npm run build

# Preview the production build locally
npm run preview
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- Material UI for the beautiful component library
- react-beautiful-dnd for the drag and drop functionality
- Zustand for the simple and powerful state management