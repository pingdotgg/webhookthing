import { useState } from "react";
import { cliApi } from "../utils/api";

export const Logs = () => {
  const [messages, setMessages] = useState<string[]>([]);
  cliApi.onLog.useSubscription(undefined, {
    onData: (data) => {
      console.log("new message received");
      setMessages((messages) => {
        return [...messages, JSON.stringify(data, null, 2)];
      });
    },
  });

  console.log("messages", messages);

  return (
    <div className="flex flex-col">
      {messages.map((m) => (
        <span>{m}</span>
      ))}
    </div>
  );
};
