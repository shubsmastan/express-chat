import { useState, useContext } from "react";
import { UserContext } from "../main";
import axios from "axios";

export default function LogIn() {
  const { user, id, setUser, setId } = useContext(UserContext);
  const [isCreatingAccount, setIsCreatingAccount] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    const url = isCreatingAccount ? "/signup" : "/login";
    e.preventDefault();
    const { data } = await axios.post(url, { username, password });
    setUser(username);
    setId(data._id);
  };

  return (
    <>
      <div className="h-full flex flex-col justify-center items-center gap-3 mb-12">
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
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
        </form>
        {isCreatingAccount ? (
          <p>
            Have an account?{" "}
            <button
              className="text-sky-700 underline"
              onClick={() => {
                setIsCreatingAccount(false);
              }}>
              Sign in
            </button>
            .
          </p>
        ) : (
          <p>
            Don't have an account?{" "}
            <button
              className="text-sky-700 underline"
              onClick={() => {
                setIsCreatingAccount(true);
              }}>
              Create one
            </button>
            .
          </p>
        )}
      </div>
    </>
  );
}
