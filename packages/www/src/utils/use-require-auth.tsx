import { useSession } from "next-auth/react";
import { useRouter } from "next/dist/client/router";
import { useEffect } from "react";

export const useRequireAuth = (skip?: boolean) => {
  const { push, route } = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (skip) return;
    if (status === "unauthenticated") {
      push({ pathname: "/signin", query: { redirect: route } });
    }
  }, [status, push, route, skip]);
};
