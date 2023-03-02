import { HOOK_PATH } from "../constants";

export const getFullPath = (path?: string[]) => {
  path = path?.filter((p) => p !== "");

  return path ? `${HOOK_PATH}/${path.join("/")}` : HOOK_PATH;
};

export const getRoute = (path?: string[]) => {
  path = path?.filter((p) => p !== "");

  return path ? `${path.join("/")}` : "/";
};
