import basicSsl from "@vitejs/plugin-basic-ssl";
import { defineConfig } from "vite";

export default defineConfig(({ mode }) => {
  if (mode === "production") {
    return {
      base: "/arjs-typescript-sample/",
    };
  }
  return {
    plugins: [basicSsl()],
  };
});
