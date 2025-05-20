import requests
import os
import subprocess
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route("/descargar", methods=["POST"])
def descargar():
    youtube_url = request.json.get("url")
    if not youtube_url:
        return jsonify({"error": "No se proporcionó URL"}), 400

    try:
        # Extraer video ID
        video_id = youtube_url.split("v=")[-1].split("&")[0]

        invidious_base = "https://invidious.snopyta.org"
        api_url = f"{invidious_base}/api/v1/videos/{video_id}"
        response = requests.get(api_url)

        if response.status_code != 200:
            return jsonify({"error": "Error accediendo a Invidious API"}), 500

        data = response.json()

        # Buscar stream de audio
        audio_streams = [s for s in data.get('adaptiveFormats', []) if 'audio' in s.get('mimeType', '')]
        if not audio_streams:
            return jsonify({"error": "No se encontró stream de audio"}), 404

        audio_url = audio_streams[0]['url']

        # Preparar rutas
        output_temp = f"temp_{video_id}.webm"
        output_dir = "downloads"
        output_mp3 = f"{output_dir}/{video_id}.mp3"

        if not os.path.exists(output_dir):
            os.makedirs(output_dir)

        # Descargar el audio temporal
        r = requests.get(audio_url)
        with open(output_temp, "wb") as f:
            f.write(r.content)

        # Convertir a MP3
        subprocess.run([
            "ffmpeg", "-i", output_temp, "-vn",
            "-ar", "44100", "-ac", "2", "-b:a", "192k",
            output_mp3
        ], check=True)

        os.remove(output_temp)

        # Retornar la URL de descarga (ajustar dominio si es necesario)
        return jsonify({
            "archivo": f"{video_id}.mp3",
            "url": f"https://converttomusic.onrender.com/downloads/{video_id}.mp3"
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Gunicorn necesita esto:
# gunicorn app:app
# (el archivo se llama app.py y la instancia es app)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
