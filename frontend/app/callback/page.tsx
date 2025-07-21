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
    const code = searchParams.get("code");

    if (!code) {
      toast.error("Missing code in callback URL");
      router.replace("/login");
      return;
    }

    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    async function handleOAuth() {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        toast.error("OAuth login failed: " + error.message);
        router.replace("/login");
        return;
      }

      toast.success("Login successful!");
      router.replace("/");
    }

    handleOAuth();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center text-white">
      <p>Completing login...</p>
    </div>
  );
}
