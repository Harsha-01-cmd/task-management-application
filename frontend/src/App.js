import React, { useEffect } from "react";
import Home from "./pages/Home";
import { Routes, Route, useNavigate } from "react-router-dom";
import AllTasks from "./pages/AllTasks";
import ImpTasks from "./pages/ImpTasks";
import CompTasks from "./pages/CompTasks";
import RemTasks from "./pages/RemTasks";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import { useSelector, useDispatch } from "react-redux";
import { authActions } from "./store/auth";

function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  console.log(isLoggedIn);

  useEffect(() => {
    if (localStorage.getItem("id") && localStorage.getItem("token")) {
      dispatch(authActions.login());
    } else if (!isLoggedIn) {
      navigate("/sign-in");
    }
  }, [isLoggedIn, dispatch, navigate]); // Added dependencies

  return (
    <div className="bg-gray-900 text-white h-auto p-1 relative">
      <Routes>
        <Route path="/" element={<Home />}>
          <Route index element={<AllTasks />} />
          <Route path="/imp-tasks" element={<ImpTasks />} />
          <Route path="/comp-tasks" element={<CompTasks />} />
          <Route path="/rem-tasks" element={<RemTasks />} />
        </Route>
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
      </Routes>
    </div>
  );
}

export default App;
