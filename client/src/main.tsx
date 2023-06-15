import React, { createContext } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

export const UserContext = createContext({
  user: "",
  id: "",
  setUser: (value: string) => {
    console.log(value);
  },
  setId: (value: string) => {
    console.log(value);
  },
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  // <React.StrictMode>
  <App />
  // </React.StrictMode>
);
