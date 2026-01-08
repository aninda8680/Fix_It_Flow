# Backend Summary: AI Pothole Detection

- Integrates with an external YOLOv8 FastAPI service via `AI_DETECTION_URL`.
- On complaint creation, the first image is sent to the AI service.
- If detections are found, `issueType` is auto-filled as `"pothole"` and `aiDetection` is stored.
- If the AI is unavailable, complaint creation continues; `issueType` defaults to `"unknown"`.
- Configure the endpoint in `.env` (`AI_DETECTION_URL`); verify connectivity with `GET /health/ai`.
 - Backend default port: **3000** (set `PORT` in `.env` to override). Use placeholders like `http://localhost:<PORT>/...` consistently.

## Testing with Postman
- **AI Service:** POST http://localhost:8000/detect, Body: form-data → Key: file (Type: File) select an image.
- **Backend (auth):** Set Header `Authorization: Bearer <JWT_TOKEN>`.
- **Create Complaint:** POST http://localhost:<PORT>/api/complaints/create with form-data
	- `images` (File), `description` (Text), `lat` (Text), `lng` (Text).
- **Expected:** `issueType` auto-filled on success; defaults to `"unknown"` if AI is unavailable.
 - **Health:** AI service `GET http://localhost:8000/health` returns `{ "status": "ok" }`. Backend `GET http://localhost:<PORT>/health/ai` checks AI `/health`.
