import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import HomePage from "./components/HomePage/HomePage.jsx";
import Page from "./components/Document/Page.jsx";

function App() {
  // const { user, setUser } = useContext(MyContext);

  // useEffect(() => {
  //   if (localStorage.getItem("token")) {
  //     setUser(localStorage.getItem("token"));
  //   }
  // }, []);

  return (
    <Router>
      <div className="w-full max-w-screen-2xl mx-auto font-inter">
        {/* navigation bar or header here */}
        {/* <Header /> */}

        {/* <Routes>
          <Route
            path="/home"
            element={user ? <HomePage /> : <Navigate to="/" />}
          />
          <Route
            path="/"
            element={user ? <Navigate to="/home" /> : <AuthForm />}
          /> */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/document/:id" element={<Page />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
