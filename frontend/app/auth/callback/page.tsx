"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import supabase from "../../../lib/supabasebrowserClient";
import { setSessionToken } from "../../../lib/utils";

export default function OAuthCallback() {
  const router = useRouter();

  useEffect(() => {
    async function checkSession() {
      const { data, error } = await supabase.auth.getSession();
      // console.log("Session:", data.session);
      // console.log("Session data:", data);
      // console.log("Session error:", error);

      if (error || !data.session) {
        router.replace("/login");
      }

      if (data?.session) {
        const { access_token, refresh_token, expires_at } = data.session;

        setSessionToken(
          access_token,
          refresh_token,
          expires_at,
          true
        );

        router.replace("/");
        //toast.success("Login successful");
      }
    }

    checkSession();
  }, [router]);

  return <p className="text-center mt-20">Completing sign in...</p>;
}
