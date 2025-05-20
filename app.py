from flask import Flask, request, jsonify, send_from_directory
import yt_dlp
import os
import uuid

app = Flask(__name__)
DOWNLOAD_FOLDER = "downloads"

# Asegura que la carpeta de descargas exista
if not os.path.exists(DOWNLOAD_FOLDER):
    os.makedirs(DOWNLOAD_FOLDER)

@app.route("/descargar", methods=["POST"])
def descargar():
    url = request.json.get("url")
    if not url:
        return jsonify({"error": "Falta URL"}), 400

    # Genera un nombre único
    unique_id = str(uuid.uuid4())
    output_path = f"{DOWNLOAD_FOLDER}/{unique_id}.%(ext)s"

    # Configura yt_dlp para extraer audio como MP3
    opciones = {
        'format': 'bestaudio/best',
        'outtmpl': output_path,
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
            'preferredquality': '192',
        }],
    }

    try:
        with yt_dlp.YoutubeDL(opciones) as ydl:
            ydl.download([url])
    except Exception as e:
        return jsonify({"error": f"Error al descargar: {str(e)}"}), 500

    # Encuentra el archivo resultante
    filename = next((f for f in os.listdir(DOWNLOAD_FOLDER) if unique_id in f), None)
    if filename:
        file_url = f"https://TU-NOMBRE-APP.onrender.com/downloads/{filename}"
        return jsonify({"filename": filename, "url": file_url})
    else:
        return jsonify({"error": "Archivo no encontrado"}), 500

@app.route("/downloads/<filename>")
def descargar_archivo(filename):
    return send_from_directory(DOWNLOAD_FOLDER, filename)

