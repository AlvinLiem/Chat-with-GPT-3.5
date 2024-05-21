import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(request) {
  try {
    const { prompt } = await request.json();
    console.log("Received prompt:", prompt);

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 100, // Adjust as necessary
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("OpenAI API response:", response.data);
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error connecting to OpenAI API:", error.message);
    if (error.response) {
      if (error.response.status === 429) {
        // Handle rate limit exceeded
        return NextResponse.json(
          { error: "Rate limit exceeded. Please try again later." },
          { status: 429 }
        );
      }
      console.error("Response data:", error.response.data);
      return NextResponse.json(
        {
          error: "Error connecting to OpenAI API",
          details: error.response.data,
        },
        { status: error.response.status }
      );
    } else if (error.request) {
      console.error("Request data:", error.request);
      return NextResponse.json(
        { error: "No response received from OpenAI API" },
        { status: 500 }
      );
    } else {
      console.error("Error message:", error.message);
      return NextResponse.json(
        {
          error: "Error setting up request to OpenAI API",
          details: error.message,
        },
        { status: 500 }
      );
    }
  }
}
