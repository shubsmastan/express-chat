import { useContext } from "react";
import axios from "axios";
import { UserContext } from "../main";

export default function Chat() {
  const { user, setUser, setId } = useContext(UserContext);

  const logOut = async () => {
    await axios.delete("/users/logout");
    setId("");
    setUser("");
  };

  return (
    <>
      <div>Hi {user}!</div>
      <button
        className="text-white bg-sky-700 text-lg rounded-md py-1 px-3"
        onClick={logOut}>
        Log Out
      </button>
    </>
  );
}
