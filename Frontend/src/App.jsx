import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import HomePage from "./components/HomePage/HomePage.jsx";
import Page from "./components/Document/Page.jsx";
import { io } from "socket.io-client";
import { useEffect, useState } from "react";

function App() {
  // const { user, setUser } = useContext(MyContext);

  // useEffect(() => {
  //   if (localStorage.getItem("token")) {
  //     setUser(localStorage.getItem("token"));
  //   }
  // }, []);

  const socket = io("http://localhost:8000");
  const [text, setText] = useState("");

  const handleChange = (e) => {
    const newText = e.target.value;
    setText(newText);
    socket.emit("send-message", newText);
  };

  useEffect(() => {
    socket.on("recieve-changes", (data) => {
      setText(data);
      // console.log(data);
    });
  });

  return (
    // <Router>
    //   <div className="w-full max-w-screen-2xl mx-auto font-inter">
    //     {/* navigation bar or header here */}
    //     {/* <Header /> */}

    //     {/* <Routes>
    //       <Route
    //         path="/home"
    //         element={user ? <HomePage /> : <Navigate to="/" />}
    //       />
    //       <Route
    //         path="/"
    //         element={user ? <Navigate to="/home" /> : <AuthForm />}
    //       /> */}
    //     <Routes>
    //       <Route path="/" element={<HomePage />} />
    //       <Route path="/document/:id" element={<Page />} />
    //     </Routes>
    //   </div>
    // </Router>

    <div style={{ margin: "50px" }}>
      <h1>Real-Time Collaboration Editor</h1>
      <textarea
        value={text}
        onChange={handleChange}
        rows="10"
        cols="50"
        placeholder="Start typing..."
      />
    </div>
  );
}

export default App;
