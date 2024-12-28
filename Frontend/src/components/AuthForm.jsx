import React, { useContext, useState } from "react";
import { InfoIcon, Lock, LockKeyhole, User } from "lucide-react";
import { Mail } from "lucide-react";
import axios from "axios";
import MyContext from "../Context/MyContext";
import { SpinnerCircular } from "spinners-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export default function AuthForm() {
  const { toast } = useToast();
  const [isSignIn, setIsSignIn] = useState(true);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setLoading] = useState(false);

  const { endPoint, user, setUser, setToken } = useContext(MyContext);

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
          const token = response.data.token;
          const data = response.data.userData;
          localStorage.setItem("docsToken", token);
          // console.log(data);
          localStorage.setItem("userInfo", JSON.stringify(data));
          setUser(data);
          setToken(token);
          navigate("/");
          toast({
            title: "Authentication Success",
            description: "You have successfully logged in.",
            variant: "success",
          });
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
          toast({
            title: "Authentication Failed!",
            description: "There was some problem while logging.",
            variant: "destructive",
          });
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
            toast({
              title: "Registration Successfull!",
              description: "You are successfully registered into our system.",
              variant: "success",
            });
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
            toast({
              description: "Something went wrong!",
              variant: "destructive",
            });
          }
          setLoading(false);
        }
      }
    }
  };

  return (
    <div className="w-full justify-center flex pt-16 bg-white text-black h-screen">
      <div className="w-full px-3 sm:px-0 max-w-md flex flex-col gap-2">
        {/* LOGO */}
        <div className="text-center flex flex-col items-center mb-4 ">
          <img className="w-[150px] p-3" src="/logo.svg" alt="" />

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
              className="text-black hover:text-blue-500 font-medium"
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
            <div className="w-full px-2 py-3 rounded-md bg-white/10 backdrop-blur-sm  focus:ring-2 focus:ring-purple-600 transition flex gap-2  border-[2px] border-black">
              <User />
              <input
                type="text"
                placeholder="Name"
                name="username"
                value={loginForm.username}
                onChange={handleChange}
                autoComplete="off"
                className="bg-transparent outline-none w-full "
                required
              />
            </div>
          )}

          <div className="w-full px-2 py-3 rounded-md bg-white/10 backdrop-blur-sm  focus:ring-2 focus:ring-purple-600 transition flex gap-2  border-[2px] border-black">
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

          <div className="w-full px-2 py-3 rounded-md bg-white/10 backdrop-blur-sm  focus:ring-2 focus:ring-purple-600 transition flex gap-2  border-[2px] border-black">
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
            <div className="w-full px-2 py-3 rounded-md bg-white/10 backdrop-blur-sm  focus:ring-2 focus:ring-purple-600 transition flex gap-2  border-[2px] border-black">
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
              <p className=" cursor-pointer w-fit hover:text-blue-500 text-[16px]">
                Forget Password?
              </p>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-700 text-white rounded-md px-4 py-3 font-medium hover:opacity-90  transition flex items-center justify-center"
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
