import { useState, useContext } from "react";
import { UserContext } from "../main";
import axios from "axios";
import Footer from "./Footer";
import Header from "./Header";

export default function LogIn() {
  const { setUser, setId } = useContext(UserContext);
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<string[] | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const url = isCreatingAccount ? "/users/signup" : "/users/login";
      const { data } = await axios.post(url, { username, password });

      setUser(username);
      setId(data._id);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      if (err.response.data.errors) {
        setErrors(err.response.data.errors);
        return;
      } else if (err.response.status === "429") {
        setErrors(["Too many requests - please try again later."]);
        return;
      }
      setErrors(["Something went wrong - please try again."]);
      console.log(err);
    }
  };

  return (
    <>
      <div
        className={
          isCreatingAccount
            ? "flex flex-col justify-between items-center min-h-screen w-screen bg-amber-200"
            : "flex flex-col justify-between items-center min-h-screen w-screen bg-emerald-200"
        }>
        <Header />
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
                  setUsername("");
                  setPassword("");
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
                  setUsername("");
                  setPassword("");
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
        <Footer />
      </div>
    </>
  );
}
