import { useContext } from "react";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import { UserContext } from "../main";

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

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

  const messageTimeStamp =
    Date.now() - createdAt.getTime() > 60 * 60 * 1000
      ? dayjs(createdAt).format("lll")
      : dayjs(createdAt).fromNow();

  return (
    <div
      className={
        user === username
          ? "bg-green-100 rounded-md py-2 px-4 my-3 w-2/3 ml-auto"
          : "bg-gray-100 rounded-md py-2 px-4 my-3 w-2/3"
      }>
      <p>{message}</p>
      <p className="text-xs text-gray-500">
        {username}, {messageTimeStamp}
      </p>
    </div>
  );
}
