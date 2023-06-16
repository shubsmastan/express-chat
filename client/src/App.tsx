import { useState, useEffect } from "react";
import axios from "axios";
import { UserContext } from "./main";
import LogIn from "./components/LogIn";
import Messages from "./components/Messages";

export default function App() {
  const [user, setUser] = useState("");
  const [id, setId] = useState("");

  axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;
  axios.defaults.withCredentials = true;

  useEffect(() => {
    const getUser = async () => {
      const { data } = await axios.get("/users/profile");
      setUser(data.username);
      setId(data._id);
    };
    getUser();
  }, []);

  if (user !== "") {
    return (
      <UserContext.Provider value={{ user, id, setUser, setId }}>
        <Messages />
      </UserContext.Provider>
    );
  }

  return (
    <UserContext.Provider value={{ user, id, setUser, setId }}>
      <LogIn />
    </UserContext.Provider>
  );
}
