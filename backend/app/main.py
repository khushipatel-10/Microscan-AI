from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI(
    title="MicroScan AI Backend",
    description="API for MicroScan AI - Hackathon Project",
    version="1.0.0"
)

# CORS is crucial for frontend communication
origins = [
    "http://localhost:3000",
    "https://microscan-ai.vercel.app",  # Future production domain
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all origins for debugging
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from app.api.v1 import analyze

app.include_router(analyze.router, prefix="/api/v1")

@app.get("/")
async def root():
    return {"message": "MicroScan AI Backend is running. Disclaimer: This tool does not replace laboratory testing."}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
