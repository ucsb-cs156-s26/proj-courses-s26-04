import { useQuery } from "react-query";
import axios from "axios";

const SYSTEM_INFO_STORAGE_KEY = "systemInfo";
const STALE_TIME_MS = 300000; // 300 seconds

export function useSystemInfo() {
  return useQuery(
    SYSTEM_INFO_STORAGE_KEY,
    async () => {
      try {
        const cached = localStorage.getItem(SYSTEM_INFO_STORAGE_KEY);
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < STALE_TIME_MS) {
            return data;
          }
        }
      } catch (e) {
        // ignore localStorage read errors
      }
      try {
        const response = await axios.get("/api/systemInfo");
        const data = response.data;
        try {
          localStorage.setItem(
            SYSTEM_INFO_STORAGE_KEY,
            JSON.stringify({ data, timestamp: Date.now() }),
          );
        } catch (e) {
          // ignore localStorage write errors
        }
        return data;
      } catch (e) {
        console.error("Error invoking axios.get: ", e);
        return {};
      }
    },
    {
      placeholderData: {
        springH2ConsoleEnabled: false,
        showSwaggerUILink: false,
        startQtrYYYYQ: "20221",
        endQtrYYYYQ: "20222",
      },
      staleTime: Infinity,
    },
  );
}
