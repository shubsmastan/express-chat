import { useContext } from "react";
import { UserContext } from "../main";

export default function Chat() {
  const { user } = useContext(UserContext);

  return (
    <>
      <div>Hi {user}!</div>
    </>
  );
}
