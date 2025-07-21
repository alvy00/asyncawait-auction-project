/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import toast from "react-hot-toast";

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    async function manualExchangeCode() {
      const code = searchParams.get("code");

      if (!code) {
        toast.error("No authorization code in URL");
        router.replace("/login");
        return;
      }

      try {
        // Manually exchange code for session
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);

        if (error) {
          toast.error("Failed to exchange code: " + error.message);
          router.replace("/login");
          return;
        }

        // data.session contains access_token, refresh_token etc.
        toast.success("Login successful!");
        router.replace("/"); // Redirect to your app home or dashboard
      } catch (err) {
        toast.error("Unexpected error during code exchange.");
        router.replace("/login");
      }
    }

    manualExchangeCode();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center text-white">
      <p>Processing login...</p>
    </div>
  );
}
