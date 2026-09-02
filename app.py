from flask import Flask, render_template, Request, jsonify, Response, request, stream_with_context
from dotenv import load_dotenv
import json
import os
from google import genai
from markdown import markdown


load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")


client = genai.Client(api_key=api_key)

app = Flask(__name__)


@app.route("/")
def home():
    return render_template("index.html")

@app.route("/test")
def test():
    return "Flask is working"




@app.route("/chat", methods=["POST"])
def chat():

    data = request.get_json()


    history = data.get("history", [])

    try:
        conversation_text = ""

        for message in history:

            role = message.get("role")
            if role == "user":
                content = message.get("content")
                conversation_text += f"User: {content}\n"
                
            elif role == "assistant":
                content = message.get("raw")
                conversation_text += f"Assistant: {content}\n"



        conversation_text += "Assistant:"
        
        
        
        response = client.models.generate_content(
            #model="gemini-2.5-flash",
            model = "gemini-3.1-flash-lite",
            contents=conversation_text
        )

        html_response = markdown(
            response.text,
            extensions=[
                "fenced_code",
                "codehilite",
                "nl2br"
            ]
        )

        return jsonify({
            "response": html_response,
            "raw_response": response.text
        })

    except Exception as e:
        
        print("ERROR:", e)

        return jsonify({
            "error": str(e)
        }), 500



@app.route("/chat-stream", methods=["POST"])
def chat_stream():

    data = request.get_json()

    history = data.get("history", [])

    conversation_text = ""

    for message in history:

        role = message.get("role")

        if role == "user":
            conversation_text += (
                f"User: {message.get('content')}\n"
            )

        elif role == "assistant":
            conversation_text += (
                f"Assistant: {message.get('raw')}\n"
            )

    conversation_text += "Assistant:"

    def generate():

        full_text = ""

        try:

            stream = client.models.generate_content_stream(
                model="gemini-3.1-flash-lite",
                contents=conversation_text
            )

            for chunk in stream:

                if chunk.text:

                    full_text += chunk.text

                    yield (
                        json.dumps({
                            "chunk": chunk.text
                        })
                        + "\n"
                    )

            yield (
                json.dumps({
                    "done": True,
                    "full_text": full_text
                })
                + "\n"
            )

        except Exception as e:

            yield (
                json.dumps({
                    "error": str(e)
                })
                + "\n"
            )

    return Response(
        stream_with_context(generate()),
        mimetype="application/x-ndjson"
    )


        
@app.route("/generate-title", methods=["POST"])
def generate_title():

    data = request.get_json()

    first_message = data.get("message", "")

    prompt = f"""
Create a short chat title.

Rules:
- 2 to 6 words
- Professional
- No quotes
- No emojis
- No punctuation
- Similar to ChatGPT conversation titles

Message:
{first_message}
"""

    response = client.models.generate_content(
        model="gemini-3.1-flash-lite",
        contents=prompt
    )

    return jsonify({
        "title": response.text.strip()
    })


if __name__ == "__main__":
    app.run(debug=True)

