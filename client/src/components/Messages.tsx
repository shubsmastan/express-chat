import { useEffect, useContext, useState } from "react";
import axios from "axios";
import { UserContext } from "../main";
import Message from "./Message";

type MessageProps = {
  _id: string;
  message: string;
  user: string;
  createdAt: Date;
  updatedAt: Date;
};

export default function Messages() {
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState<MessageProps[]>([]);
  const { user, id, setUser, setId } = useContext(UserContext);

  useEffect(() => {
    const getMessages = async () => {
      const { data } = await axios.get("/messages");
      setMessages(data);
    };
    getMessages();
  }, []);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMsg(e.target.value);
  };

  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (msg === "") return;
    try {
      const message = { message: msg, username: user, id: id };
      await axios.post("/messages", message);
      setMsg("");
    } catch (err) {
      console.log(err);
    }
  };

  const logOut = async () => {
    await axios.delete("/users/logout");
    setId("");
    setUser("");
  };

  const messageList = messages.map((obj) => (
    <div key={obj._id}>
      <Message
        message={obj.message}
        username={obj.user}
        createdAt={new Date(obj.createdAt)}
        updatedAt={new Date(obj.updatedAt)}
      />
    </div>
  ));

  return (
    <>
      <div className="min-h-screen bg-sky-200 flex flex-col p-5">
        <div className="flex justify-between">
          <p>Hi {user}!</p>
          <button
            className="text-white bg-sky-700 text-lg rounded-md py-1 px-3"
            onClick={logOut}>
            Log Out
          </button>
        </div>
        <div className="flex flex-col flex-grow">
          <div className="flex-grow bg-white p-4 my-4 rounded-md">
            {messageList}
          </div>
          <form className="flex gap-2" onSubmit={handleSubmit}>
            <input
              className="p-2 rounded-md flex-grow"
              name="message"
              type="text"
              value={msg}
              placeholder="Say something nice"
              onChange={handleInput}
            />
            <button className="bg-sky-700 p-2 rounded-md text-white">
              Send
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
