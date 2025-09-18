import { useRouter } from "expo-router";
import { useEffect } from "react";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    // Delay navigation to /login
    router.replace("/login");
  }, []);

  // No UI needed here
  return null;
}
