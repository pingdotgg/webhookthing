import fs from "fs/promises";
import path from "path";

const THING_PATH = path.join(process.cwd(), ".thing");
const HOOK_PATH = path.join(THING_PATH, "hooks");

export default async function forceThingExists() {
  try {
    await fs.access(THING_PATH);
  } catch (error) {
    await fs.mkdir(THING_PATH);
  }

  try {
    await fs.access(HOOK_PATH);
  } catch (error) {
    await fs.mkdir(HOOK_PATH);
  }
}
