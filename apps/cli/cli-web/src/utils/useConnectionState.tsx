import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

export const useConnectionState = () => {
  const [connected, setConnected] = useState(false);

  const {} = useQuery(
    ["connectionState"],
    () =>
      fetch("/")
        .then((res) => res.text())
        .catch(() => {
          throw new Error("Connection error");
        }),
    {
      refetchInterval: 2000,
      retry: false,
      onSuccess(data) {
        if (!connected) {
          toast("Connected to CLI server", {
            icon: "🟢",
            duration: 2000,
            id: "connState",
          });
          setConnected(true);
        }
      },
      onError(error) {
        toast("Disconnected from CLI server", {
          icon: "🔴",
          duration: Infinity,
          id: "connState",
        });
        setConnected(false);
      },
    }
  );
};
