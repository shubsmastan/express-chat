import { useContext } from "react";
import { UserContext } from "../main";

type MessageProps = {
  message: string;
  username: string;
  createdAt: Date;
  updatedAt: Date;
};

export default function Message({
  message,
  username,
  createdAt,
}: MessageProps) {
  const { user } = useContext(UserContext);

  return (
    <div
      className={
        user === username
          ? "bg-gray-100 rounded-md py-2 px-4 my-3"
          : "bg-green-100 rounded-md py-2 px-4 my-3"
      }>
      <p>{message}</p>
      <p className="text-xs text-gray-500">
        {username}, {createdAt.toISOString()}
      </p>
    </div>
  );
}
