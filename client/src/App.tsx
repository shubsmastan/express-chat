import { useState, useEffect } from "react";
import axios from "axios";
import { UserContext } from "./main";
import LogIn from "./components/LogIn";
import Footer from "./components/Footer";
import Header from "./components/Header";

export default function App() {
  const [user, setUser] = useState("");
  const [id, setId] = useState("");

  axios.defaults.baseURL = "http://localhost:3030";
  axios.defaults.withCredentials = true;

  useEffect(() => {
    const getUser = async () => {
      const { data } = await axios.get("/profile");
      setUser(data.username);
      setId(data._id);
    };
    getUser();
  }, []);

  if (user !== "") {
    return (
      <UserContext.Provider value={{ user, id, setUser, setId }}>
        <p>Hi {user}!</p>
      </UserContext.Provider>
    );
  }

  return (
    <UserContext.Provider value={{ user, id, setUser, setId }}>
      <div className="flex flex-col justify-between items-center min-h-screen w-screen bg-indigo-200">
        <Header />
        <LogIn />
        <Footer />
      </div>
    </UserContext.Provider>
  );
}
