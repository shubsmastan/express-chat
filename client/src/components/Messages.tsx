import { useEffect, useContext, useState } from "react";
import axios from "axios";
import { socket } from "../socket";
import { UserContext } from "../main";
import Message from "./Message";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

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
  const [errors, setErrors] = useState<string[] | null>(null);

  const { user, id, setUser, setId } = useContext(UserContext);

  const getMessages = async () => {
    try {
      const { data } = await axios.get("/messages");
      setMessages(data);
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

  useEffect(() => {
    getMessages();
  }, []);

  useEffect(() => {
    socket.connect();
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    socket.on("receive_message", () => {
      getMessages();
    });
    return () => {
      socket.off("receive_message");
    };
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
      socket.emit("send_message", message);
      setMsg("");
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
      <div className="bg-sky-200 relative">
        <div className="min-h-screen p-5 flex flex-col mx-auto lg:w-7/12">
          <div className="flex justify-between">
            <p>
              👋 Hi there <span className="font-bold">{user}</span>!
            </p>
            <p>
              <a href="https://github.com/shubsmastan">
                <FontAwesomeIcon icon={faGithub} size="lg" />
              </a>
            </p>
            <button
              className="text-white bg-sky-700 text-lg rounded-md py-1 px-3"
              onClick={logOut}>
              Log Out
            </button>
          </div>
          <div className="flex flex-col flex-grow">
            <div className="flex-grow bg-white p-4 my-4 rounded-md overflow-y-scroll h-[30rem]">
              {/* Test messages for styling */}
              {/* <Message
              message="hello world!"
              username="jace_malcom"
              createdAt={new Date(Date.now())}
              updatedAt={new Date(Date.now())}
            />
            <Message
              message="hello there!"
              username="icecoffee426"
              createdAt={new Date(Date.now())}
              updatedAt={new Date(Date.now())}
            /> */}
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
        {errors
          ? errors.map((error, idx) => (
              <p key={idx} className="text-red-500 absolute top-11 left-7">
                {error}
              </p>
            ))
          : null}
      </div>
    </>
  );
}
