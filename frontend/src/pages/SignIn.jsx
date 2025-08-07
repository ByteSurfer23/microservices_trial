import React, { useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

// Firebase configuration from your .env file
const firebaseConfig = {
  apiKey: import.meta.env.VITE_APIKEY,
  authDomain: import.meta.env.VITE_AUTHDOMAIN,
  projectId: import.meta.env.VITE_PROJECTID,
  storageBucket: import.meta.env.VITE_STORAGEBUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGINGSENDERID,
  appId: import.meta.env.VITE_APPID
};

// Initialize Firebase once
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Use Firebase's sign-in method to authenticate the user.
      await signInWithEmailAndPassword(auth, email, password);
      console.log('User signed in successfully!');

      // On successful sign-in, navigate to the search page.
      navigate('/search');
    } catch (err) {
      console.error("Error during sign in:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-full p-4">
      <div className="w-full max-w-md mx-auto p-6 bg-gray-50 rounded-lg shadow-inner">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Sign In</h2>
        <form className="space-y-4" onSubmit={handleSignIn}>
          <div>
            <label htmlFor="email-signin" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              id="email-signin"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password-signin" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password-signin"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
          {error && (
            <div className="mt-4 text-center text-sm font-medium text-red-600">
              Error: {error}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default SignIn;
