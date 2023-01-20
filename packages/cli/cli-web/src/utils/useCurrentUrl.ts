import { useAtom } from "jotai";
import { atomWithStorage, RESET } from "jotai/utils";

export const urlAtom = atomWithStorage(
  "current-endpoint",
  "http://localhost:3000"
);

export const useCurrentUrl = () => useAtom(urlAtom);
