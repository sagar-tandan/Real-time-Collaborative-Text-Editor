import React, { useContext, useState } from "react";
import { InfoIcon, Lock, LockIcon, LockKeyhole, User } from "lucide-react";
import lgo from "../assets/lgo.png";
import logo1 from "../assets/logo1.png";
import logo2 from "../assets/logo2.png";
import { Mail } from "lucide-react";
import axios from "axios";
import MyContext from "../Context/MyContext";
import { SpinnerCircular } from "spinners-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function AuthForm() {
  const { endPoint } = useContext(MyContext);
  const [isSignIn, setIsSignIn] = useState(true);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setLoading] = useState(false);

  const { user, setUser } = useContext(MyContext);

  const navigate = useNavigate();

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
    // console.log(loginForm);
  };

  const resetFrom = () => {
    setLoginForm({
      username: "",
      email: "",
      password: "",
      cPassword: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // LOGIN FLOW
    if (isSignIn) {
      setLoading(true);
      try {
        const response = await axios.post(`${endPoint}/api/auth/login`, {
          email: loginForm.email.toLowerCase(),
          password: loginForm.password,
        });
        if (response.status == 200) {
          localStorage.setItem("token", response.data.token);
          navigate("/home");
          setUser(response.data.token);
          toast.success("Login Successfull!");
          resetFrom();
        }
        setLoading(false);
      } catch (error) {
        if (error.response && error.response.status === 400) {
          // console.log(error.response.data.message);
          setError(true);
          setErrorMessage(error.response.data.message);
        } else {
          console.log("An unexpected error occurred", error);
          toast.error("Something went wrong!");
        }
        setLoading(false);
      }

      //REGISTRATION FLOW
    } else {
      if (loginForm.password != loginForm.cPassword) {
        setError(true);
        setErrorMessage("Password didn't match!");
      } else {
        setLoading(true);
        try {
          const response = await axios.post(
            `${endPoint}/api/auth/registerUser`,
            {
              name: loginForm.username,
              email: loginForm.email.toLowerCase(),
              password: loginForm.password,
            }
          );
          if (response.status == 200) {
            toast.success("Registration Successfull!");
            setIsSignIn(true);
            resetFrom();
          }
          setLoading(false);
        } catch (error) {
          if (error.response) {
            setError(true);
            setErrorMessage(error.response.data.message);
          } else {
            console.log("An unexpected error occurred", error);
            toast.error("Something went wrong!");
          }
          setLoading(false);
        }
      }
    }
  };

  return (
    <div className="w-full justify-center flex pt-16 bg-[#212746] text-white h-screen">
      <div className="w-full max-w-md flex flex-col gap-2">
        {/* LOGO */}
        <div className="text-center flex flex-col items-center mb-4 ">
          <img className="w-[150px]" src={logo2} alt="" />

          <h2 className="text-2xl font-semibold mt-2">
            {isSignIn ? "Welcome back" : "Create an account."}
          </h2>
          <p className="mt-1 text-[16px] font-light">
            {isSignIn ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => {
                setIsSignIn(!isSignIn);
                resetFrom();
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
              <LockKeyhole />
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
            className="w-full bg-blue-900 text-white rounded-sm px-4 py-3 font-medium hover:bg-blue-800  transition flex items-center justify-center"
          >
            {isLoading ? (
              <SpinnerCircular
                size={24}
                thickness={100}
                speed={100}
                color="rgba(57, 172, 111, 1)"
                secondaryColor="rgba(255, 255, 255, 1)"
              />
            ) : isSignIn ? (
              "Sign In"
            ) : (
              "Sign Up"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
