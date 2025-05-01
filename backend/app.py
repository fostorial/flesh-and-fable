
from fastapi import FastAPI, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import openai
import os

client = openai.OpenAI(api_key="")

app = FastAPI()

# Add CORS middleware
origins = [
    "http://localhost:3000",  # Frontend origin (change as needed)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allows all origins in the list above
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)

class OutlineRequest(BaseModel):
    seed: str

class SectionRequest(BaseModel):
    outline: str
    section_number: int
    prior_sections: str = ""

@app.post("/generate-outline")
async def generate_outline(req: OutlineRequest):
    system_prompt = "You are Clive Barker during the Books of Blood era. Generate dark horror story outlines."
    user_prompt = f"Using this quote or idea as inspiration, build a numbered outline for a short horror story (~1,200 words per section):\n\n\"{req.seed}\""

    response = client.chat.completions.create(
        model="gpt-4-turbo",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        temperature=0.7
    )

    return {"outline": response.choices[0].message.content}

@app.post("/generate-section")
async def generate_section(req: SectionRequest):
    system_prompt = "You are Clive Barker during the Books of Blood era. Write visceral, dark, poetic horror in sections."
    user_prompt = f"""
Using the outline below, write section number {req.section_number} in full prose (~1,200 words), keeping a Barkerian style. 
Include callbacks to the previous sections if any. Keep the section self-contained but connected.

Outline:
{req.outline}

Prior Sections:
{req.prior_sections}

Now write section {req.section_number} only.
"""

    response = client.chat.completions.create(
        model="gpt-4-turbo",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        temperature=0.7
    )
    return {"section_text": response.choices[0].message.content}
