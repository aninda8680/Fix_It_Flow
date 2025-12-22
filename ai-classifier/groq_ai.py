import base64
import requests
from groq import Groq

client = Groq(api_key="YOUR_GROQ_API_KEY")

def image_to_base64(url):
    img_bytes = requests.get(url).content
    return base64.b64encode(img_bytes).decode("utf-8")

def classify_complaint(images, description, location):
    image_parts = []

    for url in images:
        image_parts.append({
            "type": "input_image",
            "image_base64": image_to_base64(url)
        })

    response = client.chat.completions.create(
        model="llama-3.2-vision-preview",
        messages=[
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": PROMPT_TEXT},
                    *image_parts,
                    {"type": "text", "text": f"User description: {description}"},
                    {"type": "text", "text": f"Location: {location}"}
                ]
            }
        ],
        temperature=0.2
    )

    return response.choices[0].message.content
