"""edge-tts 래퍼: 프록시 CA를 쓰고, 문장 묶음 하나를 합성해 mp3와 단어 경계(JSON)를 저장한다."""
import asyncio, json, os, ssl, sys
import edge_tts, edge_tts.communicate as C
C._SSL_CTX = ssl.create_default_context(cafile="/root/.ccr/ca-bundle.crt")

async def run(text, out, rate, voice):
    com = edge_tts.Communicate(text, voice, rate=rate, proxy=os.environ.get("HTTPS_PROXY"), boundary="WordBoundary")
    words = []
    with open(out + ".mp3", "wb") as f:
        async for ch in com.stream():
            if ch["type"] == "audio":
                f.write(ch["data"])
            elif ch["type"] in ("WordBoundary", "SentenceBoundary"):
                words.append(dict(t=ch["offset"] / 1e7, d=ch["duration"] / 1e7, w=ch["text"]))
    json.dump(words, open(out + ".json", "w"), ensure_ascii=False)

if __name__ == "__main__":
    text, out = sys.argv[1], sys.argv[2]
    rate = sys.argv[3] if len(sys.argv) > 3 else "+0%"
    voice = sys.argv[4] if len(sys.argv) > 4 else "ja-JP-KeitaNeural"
    asyncio.run(run(text, out, rate, voice))
