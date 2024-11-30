"use client";
import { useState } from "react";
import Image from "next/image";

export default function Home() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log('User ID:', data.token);
        document.cookie = `token=${data.token}; path=/; max-age=3600;`;
        window.location.href = '/app';
      } else {
        setError(data.error);
        console.error('Error:', data.error);
      }
    } catch (error) {
      setError('An unexpected error occurred');
      console.error('Unexpected error:', error);
    }
  };

  return (
    <div className="w-screen h-screen font-[family-name:var(--font-geist-sans)]">
      <main className="flex w-screen h-screen">
        <div className="w-4/12 h-screen bg-customColor1 flex flex-col justify-center items-center p-8">
          <div className="w-full max-w-md flex flex-col justify-center items-center">
            <Image
              src="/logo.svg"
              alt="Logo"
              width={100}
              height={100}
              className="mb-8"
            />
            <div className="w-full">
              {error && (
                <div className="mb-4 text-red-500 flex justify-center align-center" id="error-message">
                  {error}
                </div>
              )}
              <form className="shadow-none rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSignIn}>
                <div className="mb-4">
                  <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="username">
                    Username
                  </label>
                  <input
                    className="appearance-none bg-transparent border-b-2 border-gray-300 w-full py-2 px-3 text-gray-300 outline-none focus:border-customColor2"
                    id="username"
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="password">
                    Password
                  </label>
                  <input
                    className="appearance-none bg-transparent border-b-2 border-gray-300 w-full py-2 px-3 text-gray-300 leading-tight outline-none focus:border-customColor2"
                    id="password"
                    type="password"
                    placeholder="**********"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <button
                    className="bg-customColor2 hover:brightness-75 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300"
                    type="submit"
                  >
                    Sign In
                  </button>
                  <a
                    className="inline-block align-baseline font-bold text-sm text-customColor2 hover:brightness-75 transition duration-300"
                    href="#"
                  >
                    Forgot Password?
                  </a>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="w-8/12 h-screen bg-customColor2 flex justify-center items-center">
          <div className="relative w-full h-full">
            <Image
              src="/studying.jpg"
              alt="Background"
              layout="fill"
              objectFit="cover"
            />
          </div>
        </div>
      </main>
    </div>
  );
}