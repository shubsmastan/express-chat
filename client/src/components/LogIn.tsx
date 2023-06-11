import { useState } from "react";

export default function LogIn() {
  const [isCreatingAccount, setIsCreatingAccount] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <>
      <div className="h-full flex flex-col justify-center items-center gap-3 mb-12">
        <form className="flex flex-col gap-3">
          <input
            id="username"
            type="text"
            placeholder="Username"
            value={username}
            onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
              setUsername(e.target.value);
            }}
            className="block rounded-md pl-1 h-8"
          />
          <input
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
              setPassword(e.target.value);
            }}
            className="block rounded-md pl-1 h-8"
          />
          <button className="text-white bg-sky-700 text-lg rounded-md py-1">
            {isCreatingAccount ? "Sign up" : "Log in"}
          </button>
          {isCreatingAccount ? (
            <p>
              Have an account?{" "}
              <a href="#" className="text-sky-700 underline">
                Sign in
              </a>
              .
            </p>
          ) : (
            <p>
              Don't have an account?{" "}
              <a href="#" className="text-sky-700 underline">
                Create one
              </a>
              .
            </p>
          )}
        </form>
      </div>
    </>
  );
}
