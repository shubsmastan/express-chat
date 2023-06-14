import { useContext, useState } from "react";
import axios from "axios";
import { UserContext } from "../main";

export default function Chat() {
  const [msg, setMsg] = useState("");
  const { user, setUser, setId } = useContext(UserContext);

  const logOut = async () => {
    await axios.delete("/users/logout");
    setId("");
    setUser("");
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMsg(e.target.value);
  };

  return (
    <>
      <div className="min-h-screen flex">
        <div className="flex flex-col p-4 bg-white w-1/3">
          <p>Hi {user}!</p>
          <div className="flex-grow">contacts</div>
          <button
            className="text-white bg-sky-700 text-lg rounded-md py-1 px-3"
            onClick={logOut}>
            Log Out
          </button>
        </div>
        <div className="flex flex-col p-4 bg-sky-200 w-2/3">
          <div className="flex-grow">Messages</div>
          <div className="flex gap-2">
            <input
              className="p-2 rounded-md flex-grow"
              type="text"
              value={msg}
              placeholder="Say something nice"
              onChange={handleInput}
            />
            <button className="bg-sky-700 p-2 rounded-md text-white">
              Send
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
