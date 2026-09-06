import { NextResponse } from "next/server";

export const maxDuration = 30; // 30 seconds max duration

export async function POST(req: Request) {
  try {
    if (!process.env.AZURE_AI_ENDPOINT || !process.env.AZURE_AI_API_KEY) {
      return NextResponse.json(
        { error: "Azure AI credentials are not configured in the environment variables." },
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
      const url = `${process.env.AZURE_AI_ENDPOINT}/chat/completions?api-version=2024-02-15-preview`;
      
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": process.env.AZURE_AI_API_KEY,
        },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: prompt },
                {
                  type: "image_url",
                  image_url: {
                    url: image, // Image is passed in base64 data URI from the frontend
                  },
                },
              ],
            },
          ]
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Azure API Error: ${response.status} - ${errorData}`);
      }

      const data = await response.json();
      console.log("AZURE FULL RESPONSE:", JSON.stringify(data, null, 2));
      responseText = data.choices[0]?.message?.content || "";
      
    } catch (apiError) {
      console.warn("Azure AI API failed. Deploying mock emergency response:", apiError);
      
      const fallbacks = [
        {
          probability: 99.9,
          threatLevel: "CRITICAL",
          analysis: "Server off aayi mone! But offline sensors predict massive Moru breach. Payasam is in extreme danger. Evacuate the plantain leaf immediately! (Offline Scan)"
        },
        {
          probability: 85.2,
          threatLevel: "HIGH",
          analysis: "API connection lost aliyaa. But visuals suggest Moru viscosity is dangerously thin. Sambar perimeter is compromised. Deploy the Pappadam shields! (Offline Scan)"
        },
        {
          probability: 12.5,
          threatLevel: "LOW",
          analysis: "Network down! But my backup Kerala-NASA algorithms show the Moru is safely contained. You can breathe a sigh of relief, payasam safe aanu. (Offline Scan)"
        },
        {
          probability: 67.8,
          threatLevel: "ELEVATED",
          analysis: "API error vannu bro! Fluid dynamics suggest a moderate flow towards the Avial sector. Keep an eye on that boundary. (Offline Scan)"
        },
        {
          probability: 43.1,
          threatLevel: "MODERATE",
          analysis: "Connection cut aayi. But structural integrity of the rice wall seems okay for now. Moru levels are stable, pakshe kurachu pedikkanam. (Offline Scan)"
        }
      ];

      const randomFallback = fallbacks[Math.floor(Math.random() * fallbacks.length)];
      const randomizedProbability = (randomFallback.probability + (Math.random() * 2 - 1)).toFixed(1);

      return NextResponse.json({
        ...randomFallback,
        probability: parseFloat(randomizedProbability)
      });
    }

    try {
      // Strip markdown code block if present
      const jsonString = responseText.replace(/```json\n?|\n?```/g, "").trim();
      const parsed = JSON.parse(jsonString);
      return NextResponse.json(parsed);
    } catch (parseError) {
      console.error("Failed to parse AI response:", responseText);
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
