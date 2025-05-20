import requests
import os
import subprocess

def descargar_audio_invidious(youtube_url):
    # Extraer video ID
    video_id = youtube_url.split("v=")[-1].split("&")[0]

    invidious_base = "https://invidious.snopyta.org"

    # Obtener datos del video
    api_url = f"{invidious_base}/api/v1/videos/{video_id}"
    response = requests.get(api_url)

    if response.status_code != 200:
        print("Error accediendo a Invidious API")
        return

    data = response.json()

    # Buscar stream de audio
    audio_streams = [stream for stream in data['adaptiveFormats'] if 'audio' in stream['mimeType']]
    if not audio_streams:
        print("No se encontró audio stream")
        return

    # Elegir el mejor audio (ejemplo: primero de la lista)
    audio_url = audio_streams[0]['url']
    print(f"URL audio: {audio_url}")

    # Descargar archivo temporal
    output_temp = "temp_audio.webm"
    r = requests.get(audio_url)
    with open(output_temp, "wb") as f:
        f.write(r.content)

    # Convertir a mp3 con ffmpeg
    output_mp3 = f"downloads/{video_id}.mp3"
    if not os.path.exists("downloads"):
        os.makedirs("downloads")

    subprocess.run([
        "ffmpeg", "-i", output_temp, "-vn",
        "-ar", "44100", "-ac", "2", "-b:a", "192k",
        output_mp3
    ])

    os.remove(output_temp)
    print(f"Archivo guardado en: {output_mp3}")

if __name__ == "__main__":
    url = "https://www.youtube.com/watch?v=WGF3u7ZQm4Y"
    descargar_audio_invidious(url)


