import React, { createContext, useState } from "react";

// 1. Create the context
const MyContext = createContext();

// 2. Create a provider component
export const MyProvider = ({ children }) => {
  const [endPoint, setEndPoint] = useState("http://localhost:8000");
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("userInfo"))
  );
  const [editor, setEditor] = useState(null); // Manage the editor state
  // const socket = io("http://localhost:8000");
  const [editorContent, setEditorContent] = useState("");
  const [token, setToken] = useState(localStorage.getItem("docsToken"));
  const [canEditDocs, setCanEditDocs] = useState(true);
  // const [socketId, setSocketID] = useState();
  const [removeTrigger, setRemoveTrigger] = useState(false);
  const [updateTrigger, setUpdateTrigger] = useState(false);
  const [allowToAddCollaborator, setAllowToAddCollaborator] = useState("");

  const [userOrganization, setAllOrganization] = useState([]);

  const [currentProfile, setCurrentProfile] = useState(
    JSON.parse(localStorage.getItem("currentProfile")) || null
  );

  return (
    <MyContext.Provider
      value={{
        endPoint,
        setEndPoint,
        user,
        setUser,
        editor,
        setEditor,
        editorContent,
        setEditorContent,
        token,
        setToken,
        canEditDocs,
        setCanEditDocs,
        removeTrigger,
        setRemoveTrigger,
        updateTrigger,
        setUpdateTrigger,

        currentProfile,
        setCurrentProfile,
        userOrganization,
        setAllOrganization,
        allowToAddCollaborator,
        setAllowToAddCollaborator,
      }}
    >
      {children}
    </MyContext.Provider>
  );
};

export default MyContext;
