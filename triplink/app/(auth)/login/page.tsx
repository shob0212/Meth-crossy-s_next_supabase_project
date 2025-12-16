"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { TEXT } from "@/lib/constants";

export default function LoginPage() {
  const router = useRouter();
  const t = TEXT.ja;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // Mock login - in real app, authenticate here
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-ivory dark:bg-gray-900 flex items-center justify-center p-6 relative">
      <div className="w-full max-w-md animate-fade-in relative z-10">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-[40px] shadow-xl border border-gray-100 dark:border-gray-700 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-mint-300 to-peach-300"></div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-8 text-center">
            {t.login}
          </h2>
          <div className="space-y-4">
            <input
              type="email"
              placeholder={t.email}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-700 dark:text-white p-4 rounded-2xl outline-none focus:ring-2 ring-mint-200 transition-all"
            />
            <input
              type="password"
              placeholder={t.pass}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-700 dark:text-white p-4 rounded-2xl outline-none focus:ring-2 ring-mint-200 transition-all"
            />
            <button
              type="button"
              onClick={handleLogin}
              className="w-full bg-mint-400 text-white py-4 rounded-full font-bold shadow-md hover:bg-mint-500 hover:shadow-lg transition-all"
            >
              {t.login}
            </button>
          </div>
        </div>
      </div>

      <div className="fixed bottom-8 left-6 z-50">
        <button
          type="button"
          onClick={() => router.push("/")}
          className="w-14 h-14 rounded-full bg-gray-800/10 dark:bg-white/10 backdrop-blur-md border border-gray-800/10 dark:border-white/20 text-gray-800 dark:text-white flex items-center justify-center hover:bg-gray-800/20 dark:hover:bg-white/20 transition-all shadow-lg"
        >
          <ArrowLeft size={24} />
        </button>
      </div>
    </div>
  );
}
