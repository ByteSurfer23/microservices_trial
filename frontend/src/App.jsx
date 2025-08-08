import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home  from "./pages/Home.jsx";
import SignIn  from "./pages/SignIn.jsx";
import SignUp from "./pages/SignUp.jsx";
import Search from "./pages/Search.jsx";
// Main application component
export default function App() {
  return (
    // BrowserRouter is a component that uses the HTML5 history API
    // to keep your UI in sync with the URL.
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100 p-8 font-sans">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
          {/* Navigation Bar */}
          <nav className="flex justify-between items-center bg-indigo-600 p-6 rounded-t-lg">
            <h1 className="text-2xl font-bold text-white">My App</h1>
            <div className="space-x-4">
              {/* The Link component is used instead of a normal <a> tag to prevent
                  a full page reload and let React Router handle the navigation. */}
              <Link
                to="/"
                className="px-4 py-2 rounded-full text-white transition-colors duration-200 hover:bg-indigo-500"
              >
                Home
              </Link>
              <Link
                to="/signin"
                className="px-4 py-2 rounded-full text-white transition-colors duration-200 hover:bg-indigo-500"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 rounded-full text-white transition-colors duration-200 hover:bg-indigo-500"
              >
                Sign Up
              </Link>
            </div>
          </nav>

          {/* Main content area , new commits with minor updates*/}
          <main className="p-8">
            {/* The Routes component defines the available routes.
                It will render the first Route that matches the current URL. */}
            <Routes>
              {/* Route for the home page, path is '/' */}
              <Route path="/" element={<Home />} />
              {/* Route for the sign-in page, path is '/signin' */}
              <Route path="/signin" element={<SignIn />} />
              {/* Route for the sign-up page, path is '/signup' */}
              <Route path="/signup" element={<SignUp />} />
                {/* Route for the sign-up page, path is '/search' */}
              <Route path="/search" element={<Search />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}
