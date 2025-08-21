import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TodoApp from './components/TodoApp';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/ThemeProvider';

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="todo-theme">
      <Router>
        <Routes>
          <Route path="/" element={<TodoApp />} />
        </Routes>
      </Router>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
