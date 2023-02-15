import { useState } from "react";
import { cliApi } from "../utils/api";

export const Logs = () => {
  const [messages, setMessages] = useState<string[]>([]);
  cliApi.onLog.useSubscription(undefined, {
    onData: (data) => {
      setMessages((messages) => [...messages, data.message]);
    },
  });

  console.log(messages);

  return (
    <div>
      {messages.map((m) => (
        <span>{m}</span>
      ))}
    </div>
  );
};
