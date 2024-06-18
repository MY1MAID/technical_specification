import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth } from "./store/actions/authAction";
import ClientPage from "./pages/ClientPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";

function App() {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={isLoggedIn ? <Navigate to="/clients" /> : <LoginPage />}
        />
        <Route
          path="/clients"
          element={isLoggedIn ? <ClientPage /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
