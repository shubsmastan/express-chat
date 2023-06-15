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
  return (
    <div className="bg-emerald-100 rounded-md border-stone-800 py-2 px-4 my-3">
      <p>{message}</p>
      <p className="text-xs text-gray-500">
        {username}, {createdAt.toISOString()}
      </p>
    </div>
  );
}
