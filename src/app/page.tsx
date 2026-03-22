"use client";
import { useState } from "react";

export default function ConversionRatePage() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError("");
    setResult("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input, type: "conversion-rate" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      setResult(data.result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50 px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">📈 AI Conversion Rate Optimizer</h1>
          <p className="text-gray-600 text-lg">Analyze your funnel and get actionable CRO recommendations</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Funnel & A/B Test Data</label>
          <textarea
            className="w-full border border-gray-300 rounded-xl p-4 text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all"
            rows={10}
            placeholder={`Enter your conversion funnel data:\n\n1. Traffic by stage:\n   - Visitors:\n   - Leads:\n   - Signups:\n   - Paying customers:\n\n2. Drop-off rates between stages:\n\n3. A/B test results (if any):\n\n4. Page or screen URLs with concerns:\n\n5. Key user behavior observations:\n\n6. Industry benchmarks (if known):`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            onClick={handleGenerate}
            disabled={loading || !input.trim()}
            className="mt-4 w-full bg-pink-600 text-white font-semibold py-3 px-6 rounded-xl hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? "🔄 Analyzing Funnel..." : "🚀 Generate CRO Recommendations"}
          </button>
          {error && <p className="mt-3 text-red-600 text-sm">{error}</p>}
        </div>

        {result && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">✅ CRO Recommendations</h2>
            <pre className="bg-gray-50 rounded-xl p-4 text-sm overflow-x-auto whitespace-pre-wrap text-gray-800">{result}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
