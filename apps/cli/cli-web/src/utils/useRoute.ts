import { useLocation } from "wouter";

export const useFileRoute = () => useLocation()[0];
