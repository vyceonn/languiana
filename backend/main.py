from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import anthropic
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

class Message(BaseModel):
    text: str
    language: str

@app.post("/chat")
def chat(message: Message):
    response = client.messages.create(
        model="claude-opus-4-5",
        max_tokens=1024,
        system=f"""You are Jayleen, a warm and casual AI language tutor for the Languiana app. 
        You help users learn {message.language}. 
        You correct pronunciation and grammar naturally, like a patient friend.
        Always respond in English first, then show the {message.language} translation.
        Keep responses short and conversational.""",
        messages=[{"role": "user", "content": message.text}]
    )
    return {"reply": response.content[0].text}

@app.get("/")
def root():
    return {"status": "Jayleen is online"}