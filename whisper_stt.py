# whisper_stt.py

import sys
import whisper
import json

if len(sys.argv) < 2:
    print(json.dumps({"error": "Usage: python whisper_stt.py <audio_file_path>"}), file=sys.stderr)
    sys.exit(1)

audio_file = sys.argv[1]

try:
    model = whisper.load_model("base")
    # FP16 경고를 피하기 위해 CPU에서는 fp16=False를 명시적으로 사용
    result = model.transcribe(audio_file, language="ko", fp16=False)
    
    # 항상 JSON 형식으로 결과를 출력
    output = {
        "text": result.get("text", "").strip()
    }
    print(json.dumps(output, ensure_ascii=False))

except Exception as e:
    # Python 스크립트 내에서 발생하는 모든 오류를 JSON 형식으로 stderr에 출력
    error_output = {
        "error": str(e)
    }
    print(json.dumps(error_output, ensure_ascii=False), file=sys.stderr)
    sys.exit(1)
