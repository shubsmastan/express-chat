import { useState, useContext } from "react";
import { UserContext } from "../main";
import axios from "axios";

export default function LogIn() {
  const { setUser, setId } = useContext(UserContext);
  const [isCreatingAccount, setIsCreatingAccount] = useState(true);
  const [username, setUsername] = useState("jace_malcom");
  const [password, setPassword] = useState("12345678");
  const [errors, setErrors] = useState<string[] | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const url = isCreatingAccount ? "/users/signup" : "/users/login";
      const { data } = await axios.post(url, { username, password });
      if (data.errors) {
        setErrors(data.errors);
        return;
      }
      setUser(username);
      setId(data._id);
    } catch (err) {
      console.log(err);
    }
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
              Log in
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
              Sign up
            </button>
            .
          </p>
        )}
        {errors
          ? errors.map((error, idx) => (
              <p key={idx} className="text-red-500">
                {error}
              </p>
            ))
          : null}
      </div>
    </>
  );
}
