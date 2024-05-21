"use client";

import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setResponse("");
    try {
      const res = await axios.post("/api/chat", { prompt });
      setResponse(res.data.choices[0].message.content.trim());
    } catch (error) {
      console.error("Error fetching response:", error);
      if (error.response && error.response.status === 429) {
        setResponse("Rate limit exceeded. Please try again later.");
      } else {
        setResponse("An error occurred while fetching the response.");
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Chat with GPT-3.5</h1>
        <textarea
          className="w-full p-2 border rounded mb-4"
          rows="4"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Type your prompt here..."
        />
        <button
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Sending..." : "Send"}
        </button>
        {response && (
          <div className="mt-4 p-4 border rounded bg-gray-50">
            <p>{response}</p>
          </div>
        )}
      </div>
    </div>
  );
}
