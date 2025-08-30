from fastapi import FastAPI
from victor_core.omnibrain import victor_engine
from typing import List, Dict

app = FastAPI()

@app.get("/health")
async def root():
    return {"message": "Victor Core is running"}

@app.post("/amss/generate")
async def generate(request: Dict):
    images = request.get("images", [])
    prompt = request.get("prompt", "")
    config = request.get("config", {})
    return victor_engine.generate(images, prompt, config)

@app.post("/amss/analyze")
async def analyze(request: Dict):
    images = request.get("images", [])
    prompt = request.get("prompt", "")
    return victor_engine.analyze(images, prompt)

@app.get("/amss/stats")
async def stats():
    return victor_engine.get_stats()

@app.websocket("/ws")
async def websocket_endpoint(websocket: "WebSocket"):
    await websocket.accept()
    while True:
        data = await websocket.receive_text()
        await websocket.send_text(f"Message text was: {data}")
