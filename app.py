# app.py
from flask import Flask, request, jsonify
import yt_dlp
import os
import uuid

app = Flask(__name__)
DOWNLOAD_FOLDER = "downloads"

@app.route("/descargar", methods=["POST"])
def descargar():
    url = request.json.get("url")
    if not url:
        return jsonify({"error": "Falta URL"}), 400

    unique_id = str(uuid.uuid4())
    output_path = f"{DOWNLOAD_FOLDER}/{unique_id}.%(ext)s"

    opciones = {
        'format': 'bestaudio/best',
        'outtmpl': output_path,
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
            'preferredquality': '192',
        }],
    }

    with yt_dlp.YoutubeDL(opciones) as ydl:
        ydl.download([url])

    filename = next((f for f in os.listdir(DOWNLOAD_FOLDER) if unique_id in f), None)
    if filename:
        return jsonify({"filename": filename, "url": f"http://TU_DOMINIO/downloads/{filename}"})
    else:
        return jsonify({"error": "Error al descargar"}), 500

if __name__ == "__main__":
    if not os.path.exists(DOWNLOAD_FOLDER):
        os.makedirs(DOWNLOAD_FOLDER)
    app.run(host="0.0.0.0", port=5000)
