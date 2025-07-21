// app/callback/page.tsx
import { Suspense } from "react";
import AuthCallback from "./auth-callback";

export default function CallbackPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white">Loading...</div>}>
      <AuthCallback />
    </Suspense>
  );
}
