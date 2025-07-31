import { useRouter } from "next/navigation"
import { useEffect } from "react"

export const useAuthRedirect = () => {
  const router = useRouter();

  useEffect(() => {
    const token = sessionStorage.getItem("accessToken");
    if (!token) {
      router.push("/");
    }
  }, []);
};