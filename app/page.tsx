"use client";

import { useState } from "react";
import clsx from "clsx";
import { Link, Copy, ArrowRight, Loader2, Key } from "lucide-react";
import { createIssue, encode } from "@/lib/github";

export default function Home() {
  const [url, setUrl] = useState("");
  const [token, setToken] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleShorten = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setShortUrl("");

    try {
      if (!token) throw new Error("GitHub Token is required");
      if (!url) throw new Error("URL is required");

      const issueNumber = await createIssue(token, url);
      const code = encode(issueNumber);
      
      // Construct full short URL
      // For GitHub Pages, we need to know the base path AND the origin.
      // But typically user just copies the link.
      // window.location.origin = https://johnson1205.github.io
      // basePath = /short_url
      // Result = https://johnson1205.github.io/short_url/1e
      
      const origin = window.location.origin;
      const basePath = "/github_issue_url_shortener"; 
      const finalUrl = `${origin}${basePath}/${code}`;

      setShortUrl(finalUrl);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to create short link");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortUrl);
    alert("Copied to clipboard!");
  };

  return (
    <div className="premium-bg flex items-center justify-center p-4">
      <main className="glass-panel w-full max-w-lg p-8 rounded-2xl animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 mb-2">
            GitHub Issue URL Shortener
          </h1>
          <p className="text-gray-400">Secure, serverless short links using GitHub Issues</p>
          <p className="text-xs text-gray-500 mt-2">
            Format: https://johnson1205.github.io/github_issue_url_shortener/&lt;issue_id_base62&gt;
          </p>
        </div>

        <form onSubmit={handleShorten} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <Key className="w-4 h-4" /> GitHub API Token
            </label>
            <input
              type="password"
              placeholder="Paste your standard `repo` scope token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="input-field"
              required
            />
            <p className="text-xs text-gray-500">
              Only used for this session to access the private repo.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <Link className="w-4 h-4" /> Long URL
            </label>
            <input
              type="url"
              placeholder="https://example.com/very/long/url..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="input-field"
              required
            />
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-500/20 text-red-200 text-sm border border-red-500/30">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !token || !url}
            className="btn-primary flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Shorten URL"}
            {!loading && <ArrowRight className="w-5 h-5" />}
          </button>
        </form>

        {shortUrl && (
          <div className="mt-8 pt-8 border-t border-white/10">
            <label className="text-sm font-medium text-gray-300 mb-2 block">
              Your Short Link
            </label>
            <div className="flex gap-2">
              <input
                readOnly
                value={shortUrl}
                className="input-field text-center font-mono text-blue-300"
              />
              <button
                onClick={copyToClipboard}
                className="p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white"
                title="Copy"
              >
                <Copy className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-4 text-center">
                <a href={shortUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-400 hover:text-blue-300 underline">
                    Test Link (Opens in new tab)
                </a>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
