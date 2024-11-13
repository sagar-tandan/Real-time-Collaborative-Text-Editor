import React, { useState } from "react";
import { Github, Lock } from "lucide-react";
import lgo from "../assets/lgo.png";
export default function AuthForm() {
  const [isSignIn, setIsSignIn] = useState(true);

  return (
    <div className="w-full justify-center flex pt-16 bg-[#212746] text-white h-screen">
      <div className="w-full max-w-md flex flex-col gap-2">
        {/* LOGO */}
        <div className="text-center flex flex-col items-center">
          <img className="w-[150px]" src={lgo} alt="" />

          <h2 className="text-2xl font-bold">
            {isSignIn ? "Welcome back!" : "Create an account."}
          </h2>
          <p className="mt-2 text-sm">
            {isSignIn ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setIsSignIn(!isSignIn)}
              className="text-white hover:text-purple-500 font-medium"
            >
              {isSignIn ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>

        <form action="" className="mt-4 space-y-3">
          {!isSignIn && (
            <div>
              <input
                type="text"
                placeholder="Name"
                className="w-full px-4 py-3 rounded-sm bg-white/10 backdrop-blur-sm  focus:ring-2 focus:ring-purple-600 outline-none transition"
              />
            </div>
          )}

          <div>
            <input
              type="email"
              placeholder="Email address"
              className="w-full px-4 py-3 rounded-sm bg-white/10 backdrop-blur-sm  focus:ring-2 focus:ring-purple-600 outline-none transition"
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 rounded-sm bg-white/10 backdrop-blur-sm  focus:ring-2 focus:ring-purple-600 outline-none transition"
            />
          </div>

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
