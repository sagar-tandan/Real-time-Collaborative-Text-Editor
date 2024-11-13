import React, { useState } from "react";
import { Github, InfoIcon, Lock, PlusSquare, User } from "lucide-react";
import lgo from "../assets/lgo.png";
import { Mail } from "lucide-react";

export default function AuthForm() {
  const [isSignIn, setIsSignIn] = useState(true);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [loginForm, setLoginForm] = useState({
    username: "",
    email: "",
    password: "",
    cPassword: "",
  });

  const handleChange = (e) => {
    setError(false);
    setErrorMessage("");
    const { name, value } = e.target;
    setLoginForm((prev) => ({ ...prev, [name]: value }));
    console.log(loginForm);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSignIn) {
    } else {
      if (loginForm.password != loginForm.cPassword) {
        setError(true);
        setErrorMessage("Incorrect Password!");
      } else {
        console.log("Registration successful");
      }
    }
  };

  return (
    <div className="w-full justify-center flex pt-16 bg-[#212746] text-white h-screen">
      <div className="w-full max-w-md flex flex-col gap-2">
        {/* LOGO */}
        <div className="text-center flex flex-col items-center mb-4 ">
          <img className="w-[150px]" src={lgo} alt="" />

          <h2 className="text-2xl font-bold">
            {isSignIn ? "Welcome back!" : "Create an account."}
          </h2>
          <p className="mt-2 text-sm">
            {isSignIn ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => {
                setIsSignIn(!isSignIn);
                setLoginForm({
                  username: "",
                  email: "",
                  password: "",
                  cPassword: "",
                });
                setError(false);
                setErrorMessage("");
              }}
              className="text-white hover:text-purple-500 font-medium"
            >
              {isSignIn ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
        {error && (
          <div className="w-full flex gap-1 items-center text-red-500 mb-2">
            <InfoIcon />
            <p>{errorMessage}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          {!isSignIn && (
            <div className="w-full px-4 py-3 rounded-sm bg-white/10 backdrop-blur-sm  focus:ring-2 focus:ring-purple-600 outline-none transition flex gap-2">
              <User />
              <input
                type="text"
                placeholder="Name"
                name="username"
                value={loginForm.username}
                onChange={handleChange}
                autoComplete="off"
                className="bg-transparent outline-none w-full"
                required
              />
            </div>
          )}

          <div className="w-full px-4 py-3 rounded-sm bg-white/10 backdrop-blur-sm  focus:ring-2 focus:ring-purple-600 outline-none transition flex gap-2">
            <Mail />
            <input
              type="email"
              placeholder="Email address"
              name="email"
              value={loginForm.email}
              onChange={handleChange}
              autoComplete="off"
              className="bg-transparent outline-none w-full"
              required
            />
          </div>

          <div className="w-full px-4 py-3 rounded-sm bg-white/10 backdrop-blur-sm  focus:ring-2 focus:ring-purple-600 outline-none transition flex gap-2">
            <Lock />
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={loginForm.password}
              onChange={handleChange}
              autoComplete="off"
              className="bg-transparent outline-none w-full"
              required
            />
          </div>

          {!isSignIn && (
            <div className="w-full px-4 py-3 rounded-sm bg-white/10 backdrop-blur-sm  focus:ring-2 focus:ring-purple-600 outline-none transition flex gap-2">
              <Lock />
              <input
                type="password"
                placeholder="Confirm Password"
                name="cPassword"
                value={loginForm.cPassword}
                onChange={handleChange}
                autoComplete="off"
                required
                className="bg-transparent outline-none w-full"
              />
            </div>
          )}

          {isSignIn && (
            <div className="w-full flex justify-end">
              <p className=" cursor-pointer w-fit hover:text-blue-400">
                Forget Password?
              </p>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-900 text-white rounded-sm px-4 py-3 font-medium hover:bg-blue-800  transition"
          >
            {isSignIn ? "Sign In" : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
}
