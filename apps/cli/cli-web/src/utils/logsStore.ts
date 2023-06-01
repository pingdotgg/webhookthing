import { create } from "zustand";
import { LogLevels } from "@captain/logger";

export type Log = {
  level: LogLevels;
  message: string;
  ts: number;
};

export const useLogs = create<{
  logs: Log[];
  addLog: (log: Log) => void;
  clearLogs: () => void;
  currentLog: Log | null;
  setCurrentLog: (log: Log) => void;
}>((set) => ({
  logs: [],
  addLog: (log) =>
    set((state) => ({
      logs: [...state.logs, log],
    })),
  clearLogs: () => set({ logs: [] }),
  currentLog: null,
  setCurrentLog: (log) => set({ currentLog: log }),
}));