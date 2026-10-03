import "server-only";
import { parseConfig } from "./config";

export function getEnv() {
  return parseConfig(process.env);
}
