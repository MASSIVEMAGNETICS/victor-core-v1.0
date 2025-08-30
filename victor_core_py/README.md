# Victor Core Python Backend

This directory contains the Python backend for the Victor Core project. It is a FastAPI application that exposes the Victor Core AI logic via a REST API and a WebSocket endpoint.

## Setup

1.  **Create a virtual environment:**
    ```bash
    python -m venv venv
    ```

2.  **Activate the virtual environment:**
    *   On Windows:
        ```bash
        venv\\Scripts\\activate
        ```
    *   On macOS and Linux:
        ```bash
        source venv/bin/activate
        ```

3.  **Install the dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

## Running the Service

To run the FastAPI service, use the following command:

```bash
uvicorn main:app --reload
```

The service will be available at `http://localhost:8000`.

## API Endpoints

*   `GET /health`: Health check endpoint.
*   `POST /amss/generate`: Generates an image based on a prompt.
*   `POST /amss/analyze`: Analyzes an image and prompt.
*   `GET /amss/stats`: Returns engine statistics.
*   `GET /amss/optimizer`: Returns optimizer statistics.
*   `POST /amss/optimizer`: Configures the optimizer.
*   `POST /amss/style-transfer`: Applies style transfer to an image.
*   `WS /ws`: WebSocket endpoint for real-time communication.
