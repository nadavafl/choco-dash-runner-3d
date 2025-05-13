
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log("Application starting, initializing React...");

const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error("No root element found - can't mount React application");
} else {
  createRoot(rootElement).render(<App />);
  console.log("React application mounted successfully");
}
