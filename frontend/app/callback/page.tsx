import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    async function handleCallback() {
      // Supabase OAuth returns tokens in the URL hash (after #)
      const hash = window.location.hash;

      if (!hash) {
        // No tokens? Redirect somewhere safe (like home)
        router.replace("/");
        return;
      }

      const params = new URLSearchParams(hash.substring(1));
      const access_token = params.get("access_token");
      const refresh_token = params.get("refresh_token");
      const error = params.get("error");

      if (error || !access_token || !refresh_token) {
        // Something wrong, redirect to login or home
        router.replace("/login");
        return;
      }

      // Call your backend with tokens to verify and create session
      const response = await fetch("https://asyncawait-auction-project.onrender.com/api/auth/oauth/callback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ access_token, refresh_token }),
      });

      if (response.ok) {
        // Optionally handle any returned token, then redirect to dashboard or home
        router.replace("/");
      } else {
        // Backend error: redirect or show error
        router.replace("/login");
      }
    }

    handleCallback();
  }, [router]);

  return <p>Authenticating, please wait...</p>;
}
