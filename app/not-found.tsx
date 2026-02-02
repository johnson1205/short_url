"use client";

import { useEffect, useState } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { getURL, decode } from "@/lib/github";

export default function NotFound() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [token, setToken] = useState("");
  const [needsToken, setNeedsToken] = useState(false);
  const [code, setCode] = useState<string | null>(null);

  useEffect(() => {
    // 1. Detect if this 404 is actually a Short Link
    // Host: johnson1205.github.io
    // Path: /short_url/1e
    // Segments: ["", "short_url", "1e"]
    const path = window.location.pathname;
    const segments = path.split("/").filter(Boolean);
    
    // Check if the last segment is a potential code
    // In local dev: /1e -> ["1e"] (if base path not applied strictly in dev)
    // In prod: /short_url/1e -> ["short_url", "1e"]
    
    let potentialCode = segments[segments.length - 1]; // Take the last part

    // Validate simple alphanumeric
    if (potentialCode && /^[0-9a-zA-Z]+$/.test(potentialCode)) {
      setCode(potentialCode);
      setNeedsToken(true);
      setLoading(false); 
    } else {
      // Real 404
      setLoading(false);
    }
  }, []);

  const handleLookup = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!token || !code) return;

    setLoading(true);
    setError("");

    try {
      // Decode locally
      let issueNumber;
      try {
        issueNumber = decode(code);
      } catch {
        throw new Error("Invalid code format");
      }

      // Fetch from GitHub directly (Client Side)
      const originalUrl = await getURL(token, issueNumber);

      if (!originalUrl) {
        throw new Error("URL not found in database");
      }

      // Redirect
      window.location.href = originalUrl;
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to find URL");
      setLoading(false);
    }
  };

  if (loading && !needsToken) {
    return (
      <div className="premium-bg flex items-center justify-center h-screen">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
      </div>
    );
  }

  if (code) {
    // Render the Redirect/Auth UI
    return (
      <div className="premium-bg flex items-center justify-center p-4">
        <div className="glass-panel w-full max-w-md p-8 rounded-2xl text-center">
          <h2 className="text-2xl font-bold mb-4">Redirecting...</h2>
          
          {loading ? (
             <div className="flex flex-col items-center gap-4">
               <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
               <p className="text-gray-400">Fetching destination...</p>
             </div>
          ) : (
            <div className="animate-fade-in">
               <div className="mb-6 text-gray-300">
                 <p className="mb-2">This link (`{code}`) belongs to a private database.</p>
                 <p>Please enter your GitHub Token to access.</p>
               </div>
               
               <form onSubmit={handleLookup} className="space-y-4">
                 <div>
                    <input
                      type="password"
                      placeholder="Paste Token Here"
                      value={token}
                      onChange={(e) => setToken(e.target.value)}
                      className="input-field text-center"
                      autoFocus
                    />
                 </div>
                 
                 {error && (
                   <div className="text-red-400 text-sm flex items-center justify-center gap-2">
                     <AlertCircle className="w-4 h-4" /> {error}
                   </div>
                 )}
  
                 <button 
                   type="submit" 
                   disabled={!token}
                   className="btn-primary"
                 >
                   Go to Link
                 </button>
               </form>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Actual 404 UI
  return (
    <div className="premium-bg flex flex-col items-center justify-center h-screen text-center p-4">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-xl text-gray-400 mb-8">Page Not Found</p>
      <a href="/short_url" className="text-blue-400 hover:underline">
        Go back home
      </a>
    </div>
  );
}
