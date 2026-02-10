
# FarmWise - Grow Smarter, Not Harder

**FarmWise** is a production-ready AI-powered PWA (Progressive Web App) designed for farmers in India. It serves as a comprehensive "Super App" that combines hyper-local data with the advanced reasoning of **Gemini 3** and the real-time interaction capabilities of the **Gemini Multimodal Live API**.

## 🚀 Key Features

### 1. 🔴 FarmWise Live (New!)
A real-time, multimodal conversational experience.
*   **"Eyes on the Field"**: Streams live video from the farmer's camera to Gemini. Farmers can point at crops and ask, "Is this leaf yellowing due to lack of water or pests?"
*   **Voice-First**: Hands-free interaction. Farmers speak naturally in their local language, and the AI responds with a professional Indian accent.
*   **Pinch-to-Zoom & Camera Flip**: Optimized for field usage on mobile devices.

### 2. 🩺 AI Crop Doctor
*   **Instant Diagnosis**: Upload a high-res photo for deep analysis using `gemini-3-pro`.
*   **Structured Reports**: Returns confidence scores, local disease names (e.g., in Marathi/Hindi), and chemical vs. organic treatment plans.

### 3. 🧠 Smart Advisor (Reasoning Engine)
*   **Deep Think Mode**: Uses `thinkingConfig` to reason through complex scenarios (e.g., "It rained 2 hours after I sprayed pesticide, should I spray again?").
*   **Store Locator**: Uses Search Grounding to find real physical agri-input stores nearby.

### 4. 📊 Market & Weather Pulse
*   **Mandi Rates**: Real-time market prices for crops based on location.
*   **Hyper-local Weather**: 3-day forecasts with specific agricultural alerts (e.g., "Heatwave alert: irrigate immediately").

## 🛠️ Tech Stack & Architecture

*   **Frontend**: React 18, TypeScript, Tailwind CSS
*   **AI SDK**: `@google/genai` (v1.39.0+)
*   **Models Used**:
    *   `gemini-2.5-flash-native-audio-preview-12-2025`: For **FarmWise Live** (Low latency Audio+Video streaming).
    *   `gemini-3-pro-preview`: For **Crop Diagnosis** (High reasoning accuracy).
    *   `gemini-3-flash-preview`: For **Chat & Search** (Speed & Grounding).

## ⚡ Technical Implementation Highlights

### 🎥 Real-Time Video Streaming (FarmWise Live)
We implemented a custom WebSocket-based streaming architecture using the Live API:
1.  **Video Capture**: We use an invisible HTML5 Canvas to capture frames from the device camera.
2.  **Compression**: Frames are downscaled to 320px width and compressed to JPEG (0.6 quality) to ensure performance on 4G rural networks.
3.  **Synchronization**: Images are sent as `image/jpeg` inline data alongside `audio/pcm` chunks.
4.  **PCM Audio**: We implemented custom 16kHz raw PCM encoding/decoding to communicate directly with the model without external heavy libraries.

### 🧩 Structured Reasoning
For the Crop Doctor, we utilize **JSON Schema Enforcement** via `responseSchema`. This ensures that even when the model "thinks" deeply about a fungal infection, the output is always a clean JSON object containing `diseaseName`, `confidence`, and `treatment` arrays, preventing UI breakages.

### 🗣️ Linguistics & Persona
We use advanced System Instructions to enforce a specific persona:
*   **Voice**: 'Puck' (Male, Authoritative yet friendly).
*   **Language Locking**: The model is strictly instructed to speak *only* in the user's selected language (e.g., Marathi), or if English is selected, to use a "Natural Indian Accent".

## 🔑 Setup & Installation

1.  **Clone the repository**.
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Configure API Key**:
    *   Create a `.env` file in the root.
    *   Add your paid Gemini API key (Required for Live API):
        ```env
        API_KEY=your_gemini_api_key_here
        ```
4.  **Run the app**:
    ```bash
    npm start
    ```
    *Note: To test the Camera/Microphone on mobile, you must serve the app over HTTPS or use `localhost`.*

## 📱 Demo Script (Hackathon Flow)

**0:00 - 0:45: The "FarmWise Live" Experience**
*   *Action*: Open the app, click the pulsing "Live AI" microphone.
*   *Visual*: The camera opens (UI looks like a video call).
*   *User*: Points phone at a plant. Zooms in. "Hey, look at these spots. Is this dangerous?"
*   *AI (Voice)*: "I see small dark spots with yellow halos. That looks like Early Blight. Since you are in Pune and humidity is high, you should apply a copper-based fungicide immediately."

**0:45 - 1:30: Deep Diagnosis**
*   *Action*: Switch to "Camera" tab. Take a high-res photo.
*   *Visual*: "Analyzing..." animation.
*   *Result*: A structured card appears showing "Early Blight (लवकर करपा)" with 95% confidence and a step-by-step cure.

**1:30 - 2:15: Market & Commerce**
*   *Action*: Go to "Mandi". Show prices for "Onion" in "Nashik".
*   *Action*: Switch role to "Consumer". Add "Fresh Mangoes" to cart and Checkout.

**2:15 - 3:00: Multilingual Capability**
*   *Action*: Open Menu -> Change Language to **Marathi** or **Punjabi**.
*   *Result*: The entire UI, including the Live AI persona, instantly switches language context.

## ☁️ Deployment

*   **Vercel/Netlify**: Connect repo, set `API_KEY` in environment variables.
*   **Docker**:
    ```dockerfile
    FROM node:18-alpine
    WORKDIR /app
    COPY . .
    RUN npm install && npm run build
    CMD ["npx", "serve", "-s", "build"]
    ```

---
*Built for the Gemini 3 Hackathon*
