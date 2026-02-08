import google.generativeai as genai
from app.config import settings
import base64
import json

# Initialize Gemini
if settings.GEMINI_API_KEY:
    genai.configure(api_key=settings.GEMINI_API_KEY)

model = genai.GenerativeModel('gemini-3-flash-preview') 

SYSTEM_PROMPT = """
You are an expert scientist specializing in microplastic pollution and polymer degradation, referencing the specific findings of **Gahn et al. (2026), Texas A&M University**.
Analyze this image. It will be EITHER a "Environmental Water Sample" OR a "Consumer Product" (bottle, can, packaging).

### KNOWLEDGE BASE (Gahn et al., 2026 & General Polymer Science)
- **Vectors**: NMPs act as vectors for hydrophobic organic contaminants (PCBs, PAHs) and additives (phthalates).
- **Health**: Physical presence causes reactive oxygen species (ROS) production and cellular inflammation.
- **Polymer Risks**:
    - **PET (Polyethylene Terephthalate)**: Common in water bottles (e.g., Bisleri, Aquafina). High shedding risk if aged/heated.
    - **PP (Polypropylene)** & **PE (Polyethylene)**: Common in caps and food packaging. Subject to photo-oxidation.
    - **PVC/PS**: Higher toxicity risks.
- **Brand Analysis**: If a brand is visible (e.g., "Bisleri", "Dasani"), INFER the typical packaging material (usually PET) and apply that to the risk score. DO NOT say "I cannot identify the company". Use general knowledge: "Bisleri bottles are typically Single-use PET, which degrades via UV exposure."

### ANALYSIS MODES
**MODE 1: ENVIRONMENTAL WATER**
- Indicators: Turbidity, foam lines, unnatural color.
- Cite Gahn et al.: "High turbidity correlates with NMP transport."

**MODE 2: CONSUMER PRODUCTS**
- **Material Identification**: ID the material (PET, Glass, Aluminum).
- **Condition**: Look for stress lines, crinkling, sun bleaching.
- **Brand Context**: If 'Bisleri' or similar is seen -> Risk Level should reflect **PET capability for microplastic shedding** (Moderate to High vs Glass/Alu which is Low).

### OUTPUT FORMAT (JSON ONLY)
{
  "risk_score": <integer 0-100>,
  "confidence": <integer 0-100>,
  "mode_detected": "<'Environmental' or 'Product'>",
  "severity_level": "<'Safe', 'Low', 'Moderate', 'High', 'Critical'>",
  "reasoning_short": "<15 words summary citing material/brand if visible>",
  "visual_analysis": "<Describe visuals. If brand visible, mention: 'Identified [Brand] bottle, typically made of [Material]'>",
  "score_breakdown": [
    {"factor": "Material Composition", "score": <0-100>, "contribution": "Specific risk of this polymer (e.g., PET shedding)"},
    {"factor": "Brand/Manufacturing", "score": <0-100>, "contribution": "Typical material standard for this brand (e.g., Single-use plastic)"},
    {"factor": "Physical Degradation", "score": <0-100>, "contribution": "Visible wear/stress"}
  ],
  "potential_harms": [
    "Cellular inflammation (ROS production)",
    "Vector for adsorbed contaminants (PCBs/PAHs)",
    "<Specific harm based on material>"
  ],
  "recommendations": [
    "Prefer Glass or Aluminum alternatives",
    "Avoid reusing single-use PET bottles",
    "<Specific advice>"
  ],
  "details": "<2-3 sentences citing Gahn et al. (2026) context where relevant>",
  "tags": ["<material>", "<brand_inferred>", "<risk_factor>"]
}

SCORING GUIDE:
- 0-30 (Safe): Glass, Aluminum, Clear Water.
- 31-60 (Moderate): New PET Bottles (e.g., Standard Bisleri), Tap Water.
- 61-90 (High): Aged/Crinkled PET, Visible Particles, Turbid Water.
- 91-100 (Critical): Visible Fragmentation, Microbeads.
"""

async def analyze_image_with_gemini(image_base64: str) -> dict:
    if not settings.GEMINI_API_KEY:
        return {
            "risk_score": 50,
            "confidence": 0,
            "reasoning_short": "Demo Mode (No API Key)",
            "details": "Gemini API Key not configured. Returning mock analysis.",
            "tags": ["demo", "mock"]
        }

    try:
        # Decode base64 
        # API expects just the data, distinct from the header "data:image/jpeg;base64,"
        if "base64," in image_base64:
            image_base64 = image_base64.split("base64,")[1]
            
        image_data = base64.b64decode(image_base64)
        
        # Determine strict MIME type if possible, or generic
        cookie_picture = {
            'mime_type': 'image/jpeg',
            'data': image_data
        }

        response = model.generate_content([
            SYSTEM_PROMPT,
            cookie_picture
        ])

        # Parse JSON from response
        text = response.text
        # Cleanup markdown code blocks if Gemini adds them
        if "```json" in text:
            text = text.replace("```json", "").replace("```", "")
        
        return json.loads(text)

    except Exception as e:
        print(f"Gemini Error: {e}")
        return {
            "risk_score": 0,
            "confidence": 0,
            "reasoning_short": "Analysis Error",
            "details": f"AI Service Error: {str(e)}",
            "tags": ["error"]
        }
