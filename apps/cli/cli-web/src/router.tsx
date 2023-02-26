import { Router, Route } from "wouter";
import AppCore from "./App";

export const AppRouter = () => {
  return (
    <Router>
      <Route path="/:rest*">
        <AppCore />
      </Route>
    </Router>
  );
};
