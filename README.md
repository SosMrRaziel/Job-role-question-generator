# Job Role Question Generator (Backend)

This is the backend API for the Job Role Question Generator. Built with Flask, this service uses the Google Gemini AI API to dynamically generate context-aware interview questions for specific job titles.

## Features

- **AI Question Generation**: Uses Gemini LLM to generate exactly 3 interview questions per request for a specified job title.
- **Robust Parsing**: Built-in fallback mechanisms correctly extract output lists or string questions directly from the AI response.
- **CORS Enabled**: Cross-origin requests are enabled via `flask-cors`.

## Prerequisites

- Python 3.8+
- Active API Key for Google Gemini.

## Setup

1. **Navigate to the backend directory:**

   ```bash
   cd backend
   ```

2. **Create a virtual environment (optional but recommended):**

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install the dependencies:**

   ```bash
   pip install -r requirements.txt
   ```

4. **Environment Configuration:**
   Create a `.env` file in the `backend/` directory referencing your keys:
   ```properties
   AI_API_KEY="your_gemini_api_key_here"
   GEMINI_API_URL="https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"
   ```

## Running the Application

To start the Flask development server:

```bash
python app.py
```

The application will start on `http://127.0.0.1:5000` by default.

## API Endpoints

### 1. Generate Questions

Generates 3 interview questions for a given job title.

- **URL:** `/generate-questions`
- **Method:** `POST`
- **Headers:** `Content-Type: application/json`
- **Data Params:**

  ```json
  {
    "jobTitle": "Software Engineer"
  }
  ```

- **Success Response:**
  - **Code:** 200 OK
  - **Content:**
    ```json
    {
      "questions": [
        "What is your experience with modern JavaScript frameworks?",
        "How do you handle debugging complex backend issues?",
        "Describe a time you optimized database queries."
      ]
    }
    ```

- **Error Responses:**
  - **Code:** 400 Bad Request (Missing `jobTitle`)
  - **Code:** 500 Internal Server Error (Missing `AI_API_KEY`)
  - **Code:** 502 Bad Gateway (API communication issues or parsing failures)

### 2. Health Check

Verifies if the API is currently running.

- **URL:** `/`
- **Method:** `GET`

- **Success Response:**
  - **Code:** 200 OK
  - **Content:**
    ```json
    {
      "status": "ok"
    }
    ```
