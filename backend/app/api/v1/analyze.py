from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, List, Optional
from app.services.gemini import analyze_image_with_gemini
from app.services.risk_engine import calculate_total_risk

router = APIRouter()

class OpticalMetricsModel(BaseModel):
    turbidityScore: float
    edgeDensity: float
    labVariance: float

class AnalyzeRequest(BaseModel):
    image_base64: str
    optical_metrics: OpticalMetricsModel
    geo_lat: Optional[float] = None
    geo_lon: Optional[float] = None
    embeddings: Optional[List[float]] = None

@router.post("/analyze")
async def analyze_scan(request: AnalyzeRequest):
    # 1. Gemini Analysis
    gemini_result = await analyze_image_with_gemini(request.image_base64)
    
    # 2. Risk Synthesis
    risk_assessment = calculate_total_risk(
        request.optical_metrics.dict(), 
        gemini_result
    )
    
    # 3. Construct Response
    return {
        "status": "success",
        "risk_score": risk_assessment["score"],
        "risk_level": risk_assessment["level"],
        "gemini_analysis": {
            "mode_detected": gemini_result.get("mode_detected", "Unknown"),
            "severity_level": gemini_result.get("severity_level", "Unknown"),
            "reasoning": gemini_result.get("reasoning_short"),
            "visual_analysis": gemini_result.get("visual_analysis"),
            "score_breakdown": gemini_result.get("score_breakdown", []),
            "potential_harms": gemini_result.get("potential_harms", []),
            "recommendations": gemini_result.get("recommendations", []),
            "details": gemini_result.get("details"),
            "tags": gemini_result.get("tags")
        },
        "technical_breakdown": risk_assessment["breakdown"]
    }
