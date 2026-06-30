import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { fileURLToPath } from "url";
import { PRODUCTS_CATALOG } from "./src/data";
import { getDbPool } from "./src/lib/db";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Test Database Route
  app.get("/api/db-test", async (req, res) => {
    try {
      const pool = getDbPool();
      const client = await pool.connect();
      const result = await client.query('SELECT NOW()');
      client.release();
      res.json({ success: true, time: result.rows[0].now });
    } catch (error: any) {
      console.error("Database Test Error:", error);
      res.status(500).json({ error: error.message || "Failed to connect to database." });
    }
  });

  let aiClient: GoogleGenAI | null = null;
  function getGeminiClient(): GoogleGenAI {
    if (!aiClient) {
      const key = process.env.GEMINI_API_KEY;
      if (!key) {
        throw new Error("GEMINI_API_KEY environment variable is required.");
      }
      aiClient = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
    }
    return aiClient;
  }

  // AI assistant route
  app.post("/api/ai/generate", async (req, res) => {
    try {
      const { prompt } = req.body;
      const productContext = PRODUCTS_CATALOG.map(p => `- ${p.name} ($${p.price}): ${p.description}`).join('\n');
      const systemPrompt = `You are a helpful assistant for the Vince Solutions E-Commerce platform. Follow strict etiquette: be extremely polite, yet maximally brief and concise in all responses.\n\nProduct Catalog Context:\n${productContext}`;

      if (process.env.NVIDIA_API_KEY) {
        try {
          const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.NVIDIA_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "meta/llama-3.3-70b-instruct",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: prompt }
                ],
                temperature: 0.2,
                top_p: 0.7,
                max_tokens: 1024,
            })
          });
          if (response.ok) {
            const data = await response.json();
            return res.json({ text: data.choices[0].message.content });
          } else {
            console.warn(`NVIDIA API response error: ${response.status}. Falling back to Gemini.`);
          }
        } catch (nvidiaError) {
          console.warn("NVIDIA Chat API failed, falling back to Gemini API:", nvidiaError);
        }
      }

      // Fallback/Default: Gemini API
      if (process.env.GEMINI_API_KEY) {
        const ai = getGeminiClient();
        
        // Retry logic for 503 errors
        let lastError;
        for (let i = 0; i < 3; i++) {
            try {
                const response = await ai.models.generateContent({
                  model: "gemini-2.0-flash",
                  contents: prompt,
                  config: {
                    systemInstruction: systemPrompt,
                    temperature: 0.2,
                    topP: 0.7,
                  }
                });
                return res.json({ text: response.text });
            } catch (error: any) {
                lastError = error;
                // Check for 503 status in status property or code property in error object
                const status = error.status || (error.error && error.error.code);
                
                if (status === 503 && i < 2) {
                    console.warn(`Gemini API 503, retrying (${i + 1}/3)...`);
                    await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
                    continue;
                }
                throw error;
            }
        }
        throw lastError;
      }

      throw new Error("Neither NVIDIA_API_KEY nor GEMINI_API_KEY environment variables are available.");
    } catch (error: any) {
      console.error("AI Error:", error);
      res.status(500).json({ error: error.message || "Failed to generate response from AI." });
    }
  });

  // Optimization Route
  app.post("/api/ai/optimize-route", async (req, res) => {
    try {
      const { locations, vehicles } = req.body;
      const prompt = `Act as an advanced NVIDIA cuOpt route optimization engine.
I have ${vehicles} delivery vehicle(s). Calculate the optimal visitation order for the following delivery locations, starting the route from the first location (Depot):
${locations.map((loc: string, index: number) => `${index + 1}. ${loc}`).join('\n')}

Please return a clear, step-by-step route itinerary assigned to the vehicle(s), simulating a highly efficient VRP (Vehicle Routing Problem) solution. Be professional and technical. Limit your response to just the route details.`;

      if (process.env.NVIDIA_API_KEY) {
        try {
          const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.NVIDIA_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "meta/llama-3.3-70b-instruct",
                messages: [
                    { role: "system", content: "You are an NVIDIA cuOpt logic solver." },
                    { role: "user", content: prompt }
                ],
                temperature: 0.2,
                top_p: 0.7,
                max_tokens: 1024,
            })
          });
          if (response.ok) {
            const data = await response.json();
            return res.json({ text: data.choices[0].message.content });
          } else {
            console.warn(`NVIDIA API response error: ${response.status}. Falling back to Gemini.`);
          }
        } catch (nvidiaError) {
          console.warn("NVIDIA Optimization API failed, falling back to Gemini API:", nvidiaError);
        }
      }

      // Fallback/Default: Gemini API
      if (process.env.GEMINI_API_KEY) {
        const ai = getGeminiClient();
        
        // Retry logic for 503 errors
        let lastError;
        for (let i = 0; i < 3; i++) {
            try {
                const response = await ai.models.generateContent({
                  model: "gemini-2.0-flash",
                  contents: prompt,
                  config: {
                    systemInstruction: "You are an advanced route optimization solver and logistics engine.",
                    temperature: 0.2,
                    topP: 0.7,
                  }
                });
                return res.json({ text: response.text });
            } catch (error: any) {
                lastError = error;
                // Check for 503 status in status property or code property in error object
                const status = error.status || (error.error && error.error.code);
                
                if (status === 503 && i < 2) {
                    console.warn(`Gemini API 503, retrying (${i + 1}/3)...`);
                    await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
                    continue;
                }
                throw error;
            }
        }
        throw lastError;
      }

      throw new Error("Neither NVIDIA_API_KEY nor GEMINI_API_KEY environment variables are available.");
    } catch (error: any) {
      console.error("Optimization Error:", error);
      res.status(500).json({ error: error.message || "Failed to generate optimization." });
    }
  });

  // Checkout Route with Stripe
  app.post("/api/checkout", async (req, res) => {
    try {
      if (!process.env.STRIPE_SECRET_KEY) {
        throw new Error("Stripe secret key is missing");
      }
      
      const { items, success_url, cancel_url } = req.body;
      
      // Initialize stripe dynamically
      const Stripe = (await import('stripe')).default;
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: "2023-10-16" as any,
      });

      const lineItems = items.map((item: any) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
            images: item.image ? [item.image] : [],
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      }));

      // Create a checkout session using destination charges if connected account is present
      const sessionParams: any = {
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        success_url: success_url || 'http://localhost:3000/success',
        cancel_url: cancel_url || 'http://localhost:3000/cancel',
      };

      if (process.env.STRIPE_CONNECT_ACCOUNT) {
        sessionParams.payment_intent_data = {
          transfer_data: {
            destination: process.env.STRIPE_CONNECT_ACCOUNT,
          },
        };
      }

      const session = await stripe.checkout.sessions.create(sessionParams);
      res.json({ id: session.id, url: session.url });
    } catch (error: any) {
      console.error("Stripe Error:", error);
      res.status(500).json({ error: error.message || "Failed to create checkout session." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
