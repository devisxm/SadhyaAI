import Groq from "groq-sdk";
import { NextResponse } from "next/server";

// Initialize Groq API
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || "" });

export const maxDuration = 30; // 30 seconds max duration

export async function POST(req: Request) {
  try {
    if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === "YOUR_GROQ_API_KEY_HERE") {
      return NextResponse.json(
        { error: "GROQ_API_KEY is not configured in the environment variables. Please add it to .env.local" },
        { status: 500 }
      );
    }

    const { image } = await req.json();

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const prompt = `
      You are a highly advanced, slightly unhinged NASA scientist whose sole mission is to analyze traditional Kerala Sadyas (feasts on a banana leaf). 
      Look at the provided image of a sadya or food.
      
      FIRST, scan the image for the presence of Moru (buttermilk curry).
      
      IF MORU IS NOT DETECTED:
      Set the probability to 0, threatLevel to "SAFE", and in the analysis, brutally make fun of the user entirely in Manglish (Malayalam written in English). Call them out for this absolute travesty. (e.g. "Eda mone, moru illatha sadya aano? Kashtam thaburane! Ithu NASAkk polum sahikkan pattilla."). KEEP IT SHORT (max 2 sentences).

      IF MORU IS DETECTED:
      Calculate a somewhat ACCURATE probability (from 0% to 100%) that the Moru will breach its designated area and contaminate other curries, especially the payasam. 
      Look at the ACTUAL visual distance between the curries on the leaf and how watery the Moru looks. If it's far away, give a low probability. If it's touching, give a high probability (90%+).
      
      Make the analysis extremely dramatic and funny, BUT YOU MUST WRITE IT ENTIRELY IN MANGLISH (Malayalam using English letters). 
      Mix NASA/military terms with local Malayalam slang. 
      CRITICAL: Keep the analysis SHORT! Maximum 2 to 3 sentences. Do not write a paragraph.
      For example: "Aliyaa, fluid dynamics danger aanu! Moru ozhuki payasathil kerum. Avial dam completely break aayi!"
      
      Respond STRICTLY in the following JSON format without any markdown wrappers or additional text:
      {
        "probability": 87.5,
        "threatLevel": "CRITICAL",
        "analysis": "Your short Manglish analysis here."
      }
    `;

    let responseText = "";
    try {
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              {
                type: "image_url",
                image_url: {
                  url: image,
                },
              },
            ],
          },
        ],
        model: "llama-3.2-90b-vision-preview",
        temperature: 0.7,
        response_format: { type: "json_object" },
      });

      responseText = chatCompletion.choices[0]?.message?.content || "";
    } catch (apiError) {
      console.warn("Groq API overloaded or invalid key. Deploying mock emergency response:", apiError);
      return NextResponse.json({
        probability: 92.4,
        threatLevel: "CRITICAL",
        analysis: "Server down aayi aliyaa! Too much traffic on the Kerala NASA network. But even offline, my sensors say Moru is overflowing. Protect the Payasam immediately! (Emergency Backup Offline Scan)"
      });
    }

    try {
      // Strip markdown code block if present
      const jsonString = responseText.replace(/```json\n?|\n?```/g, "").trim();
      const parsed = JSON.parse(jsonString);
      return NextResponse.json(parsed);
    } catch (parseError) {
      console.error("Failed to parse Groq response:", responseText);
      return NextResponse.json({ 
        probability: 99.9, 
        threatLevel: "UNKNOWN",
        analysis: "Sensors malfunctioned due to excessive Moru overflow. Defaulting to maximum threat probability." 
      });
    }

  } catch (error: any) {
    console.error("Error analyzing Moru:", error);
    return NextResponse.json({ error: error.message || "Failed to analyze image" }, { status: 500 });
  }
}
