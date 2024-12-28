import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { MyProvider } from "./Context/MyContext.jsx";
import { Toaster } from "@/components/ui/toaster";

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <MyProvider>
    <App />
    <Toaster />
  </MyProvider>
  /* </StrictMode> */
);
