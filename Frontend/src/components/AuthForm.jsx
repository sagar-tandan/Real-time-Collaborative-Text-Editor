import React, { useState } from "react";
import { Github, Lock } from "lucide-react";
// import GradientOrbs from "./GradientOrbs";

export default function AuthForm() {
  const [isSignIn, setIsSignIn] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative">

      <div className="w-full max-w-lg  bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20">
       

        {/* Right Side - Auth Form */}
        <div className="p-12 flex items-center justify-center backdrop-blur-sm bg-white/50 w-full" >
          <div className="w-full max-w-md space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900">
                {isSignIn ? "Welcome back!" : "Create an account."}
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                {isSignIn
                  ? "Don't have an account? "
                  : "Already have an account? "}
                <button
                  onClick={() => setIsSignIn(!isSignIn)}
                  className="text-purple-600 hover:text-purple-500 font-medium"
                >
                  {isSignIn ? "Sign up" : "Sign in"}
                </button>
              </p>
            </div>

            <form
              className="mt-8 space-y-6"
              onSubmit={(e) => e.preventDefault()}
            >
              {!isSignIn && (
                <div>
                  <input
                    type="text"
                    placeholder="Name"
                    className="w-full px-4 py-3 rounded-lg bg-white/70 backdrop-blur-sm border border-gray-300/80 focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition"
                  />
                </div>
              )}

              <div>
                <input
                  type="email"
                  placeholder="Email address"
                  className="w-full px-4 py-3 rounded-lg bg-white/70 backdrop-blur-sm border border-gray-300/80 focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition"
                />
              </div>

              <div>
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full px-4 py-3 rounded-lg bg-white/70 backdrop-blur-sm border border-gray-300/80 focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-purple-600 text-white rounded-lg px-4 py-3 font-medium hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2 transition"
              >
                {isSignIn ? "Sign In" : "Sign Up"}
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300/50"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white/70 backdrop-blur-sm text-gray-500">
                    or sign up with
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button className="flex items-center justify-center px-4 py-3 bg-white/70 backdrop-blur-sm border border-gray-300/80 rounded-lg hover:bg-white/90 transition">
                  <Github className="w-5 h-5" />
                  <span className="ml-2">Github</span>
                </button>
                <button className="flex items-center justify-center px-4 py-3 bg-white/70 backdrop-blur-sm border border-gray-300/80 rounded-lg hover:bg-white/90 transition">
                  <img
                    src="https://www.google.com/favicon.ico"
                    alt="Google"
                    className="w-5 h-5"
                  />
                  <span className="ml-2">Google</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
