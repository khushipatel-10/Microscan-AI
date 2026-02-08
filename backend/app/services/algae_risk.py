import random
from datetime import datetime, timedelta
from typing import Dict, Any, List

def assess_algae_risk(usgs_data: Dict[str, Any], gemini_analysis: Dict[str, Any]) -> Dict[str, Any]:
    """
    Assess the risk of Harmful Algal Blooms (HABs) by combining:
    1. USGS Real-time Data (Water Temp, pH, Turbidity, Dissolved Oxygen, Conductance)
    2. Visual Analysis (Green water, scum, Gemini tags)
    3. Simulated Advanced Data (Satellite, Nutrients, Forecast)
    """
    
    score = 0
    drivers = []
    usgs_vals = {}
    
    # --- 1. USGS Data Analysis ---
    if usgs_data and 'parameters' in usgs_data:
        params = usgs_data['parameters']
        
        # Helper to extract float
        def get_val(key_fragment):
            for k, v in params.items():
                if key_fragment.lower() in k.lower():
                    try:
                        return float(v.split()[0])
                    except:
                        pass
            return None

        # Temperature (>25C is critical)
        temp = get_val("Temperature")
        if temp:
            usgs_vals['temp'] = temp
            if temp > 25:
                score += 30
                drivers.append(f"High Water Temp ({temp}°C)")
            elif temp > 20:
                score += 15
                drivers.append(f"Warm Water ({temp}°C)")

        # pH (>8.5 suggests bloom)
        ph = get_val("pH")
        if ph:
            usgs_vals['ph'] = ph
            if ph > 9.0:
                score += 25
                drivers.append(f"Very High pH ({ph})")
            elif ph > 8.5:
                score += 15
                drivers.append(f"Elevated pH ({ph})")

        # Turbidity (>10 NTU)
        turb = get_val("Turbidity")
        if turb:
            usgs_vals['turbidity'] = turb
            if turb > 50:
                score += 20
                drivers.append("High Turbidity")
            elif turb > 10:
                score += 10

        # Dissolved Oxygen (Hypoxia risk or supersaturation)
        do = get_val("Dissolved oxygen")
        if do:
            usgs_vals['do'] = do
            if do < 4.0:
                score += 20
                drivers.append(f"Hypoxia Risk (DO {do} mg/L)")
            elif do > 12.0:
                score += 10
                drivers.append(f"Supersaturation (DO {do} mg/L)") # Blooms produce excess O2 in day
        
        # Specific Conductance (Salinity/TDS)
        cond = get_val("Conductance")
        if cond:
            usgs_vals['conductance'] = cond

    # --- 2. Visual Analysis (Gemini) ---
    visual_text = (gemini_analysis.get('visual_analysis', '') + " " + 
                   gemini_analysis.get('reasoning_short', '')).lower()
    
    high_risk_keywords = ['algae', 'algal', 'green scum', 'cyanobacteria', 'blue-green', 'bloom']
    mod_risk_keywords = ['green water', 'turbid green', 'vegetation', 'moss']
    
    visual_score = 0
    if any(k in visual_text for k in high_risk_keywords):
        visual_score = 50
        drivers.append("Visual Confirmation (Scum/Algae)")
    elif any(k in visual_text for k in mod_risk_keywords):
        visual_score = 30
        drivers.append("Visual: Green Coloration")
        
    score += visual_score
    
    # Cap Base Score
    score = min(100, score)
    
    # --- 3. Determine Risk Level ---
    if score >= 60:
        risk_level = "Critical"
    elif score >= 40:
        risk_level = "High"
    elif score >= 20:
        risk_level = "Moderate"
    else:
        risk_level = "Low"

    # --- 4. Simulation: Advanced Multi-Modal Data ---
    # We simulate these based on the calculated 'score' to create a coherent story.
    
    # Satellite Data (Simulated)
    satellite = {
        "analysis_date": datetime.now().strftime("%Y-%m-%d"),
        "ndvi_anomaly": round(max(0, (score / 100) - 0.2 + random.uniform(-0.1, 0.1)), 2), # Normalized Difference Vegetation Index
        "chlorophyll_a": round(score * 0.8 + random.uniform(0, 10), 1), # µg/L
        "cyanobacteria_index": "High" if score > 60 else "Moderate" if score > 30 else "Low"
    }
    
    # Nutrient Load (Simulated - correlates with Turbidity/Runoff)
    # High score -> High nutrients
    nutrients = {
        "nitrogen": round(0.5 + (score / 20) + random.uniform(0, 0.5), 2), # mg/L
        "phosphorus": round(0.01 + (score / 500) + random.uniform(0, 0.05), 3) # mg/L
    }
    
    # 7-Day Forecast (Simulated)
    forecast = []
    current_risk = score
    for i in range(1, 8):
        future_date = (datetime.now() + timedelta(days=i)).strftime("%a")
        # Trend based on current temp (if temp is high, risk grows)
        temp_factor = 1.05 if usgs_vals.get('temp', 20) > 25 else 0.95
        current_risk = min(100, max(0, current_risk * temp_factor + random.uniform(-5, 5)))
        forecast.append({"day": future_date, "risk": int(current_risk)})

    # Management Actions
    actions = []
    if risk_level in ["Critical", "High"]:
        actions = [
            "Issue Public Advisory: No Contact/Swimming.",
            "Increase testing frequency to daily.",
            "Deploy aeration systems in stagnant zones.",
            "Monitor drinking water intakes for toxins."
        ]
    elif risk_level == "Moderate":
        actions = [
            "Weekly sampling for cyanotoxins.",
            "Visual inspection of shorelines.",
            "Reduce nutrient inflow from upstream."
        ]
    else:
        actions = [
            "Routine monthly monitoring.",
            "Maintain baseline nutrient analysis."
        ]

    return {
        "risk_score": score,
        "risk_level": risk_level,
        "drivers": drivers,
        "action": actions[0], # Primary action
        "details": f"Analysis of {len(drivers)} factors.",
        "advanced_data": {
            "satellite": satellite,
            "nutrients": nutrients,
            "forecast": forecast,
            "management_actions": actions
        }
    }
