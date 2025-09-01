from flask import Flask, request, jsonify
from flask_cors import CORS
from victor_omnibrain_infinity import Victor
import base64
import json
import logging

app = Flask(__name__)
# Allow all origins for development purposes.
CORS(app)

# Use Flask's logger
app.logger.setLevel(logging.INFO)

app.logger.info("Initializing Victor...")
victor = Victor()
victor.awaken()
app.logger.info("Victor is awake and ready.")

@app.route('/think', methods=['POST'])
def think_route():
    if not request.json or 'prompt' not in request.json:
        app.logger.warning("Bad request: 'prompt' not in request body.")
        return jsonify({"error": "Request must be JSON and contain a 'prompt' field."}), 400

    prompt = request.json['prompt']
    app.logger.info(f"Received prompt: {prompt}")

    # Get Victor's response
    victor_response = victor.think(prompt)
    app.logger.info(f"Victor's response: {json.dumps(victor_response, indent=2)}")

    # The frontend expects a `GenerationResult` object.
    # Victor's "thought" will be used to generate a placeholder SVG image,
    # and his status metrics will be mapped to the expected fields.
    thought = victor_response.get("response", "Victor is thinking...")

    # Create a placeholder SVG image that displays Victor's thought.
    svg_template = f"""
    <svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:rgb(168,85,247);stop-opacity:1" />
          <stop offset="100%" style="stop-color:rgb(236,72,153);stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="#111827" />
      <text y="45%" style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 24px; fill: url(#grad1);" text-anchor="middle">
        <tspan x="50%" dy="0em">Victor's Thought:</tspan>
        <tspan x="50%" dy="1.5em">{thought}</tspan>
      </text>
      <text y="90%" style="font-family: monospace; font-size: 14px; fill: #6B7280;" text-anchor="middle">
        <tspan x="50%">Mode: {victor_response.get('mode')} | Action: {victor_response.get('best_action')}</tspan>
      </text>
    </svg>
    """
    image_data = "data:image/svg+xml;base64," + base64.b64encode(svg_template.encode('utf-8')).decode('utf-8')

    # Map Victor's output to the frontend's expected GenerationResult structure
    generation_result = {
        "imageData": image_data,
        "qualityScore": victor.awareness.level,
        "semanticCoherence": victor_response.get("status", {}).get("consciousness", 0.1),
        "aestheticScore": 0.5,  # Placeholder
        "metadata": {
            "processingTime": 50,  # Simulated
            "modelsUsed": ["VictorOmnibrain-Infinity"],
            "techniquesApplied": [
                f"Mode: {victor_response.get('mode', 'N/A')}",
                f"Action: {victor_response.get('best_action', 'N/A')}"
            ]
        }
    }

    print("Sending mapped response to frontend.")
    return jsonify({"success": True, "result": generation_result})

if __name__ == '__main__':
    # Running on port 5001 to avoid conflicts with the Next.js app (port 3000)
    app.run(host='0.0.0.0', port=5001, debug=True)
