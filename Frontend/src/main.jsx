import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { MyProvider } from "./Context/MyContext.jsx";
import { Toaster } from "@/components/ui/toaster";
import "@liveblocks/react-ui/styles.css";
import "@liveblocks/react-tiptap/styles.css";

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <MyProvider>
    <App />
    <Toaster />
  </MyProvider>
  /* </StrictMode> */
);
