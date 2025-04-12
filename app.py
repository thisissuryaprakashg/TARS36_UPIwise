from flask import Flask, render_template, request
import requests, qrcode, os, uuid # type: ignore

app = Flask(__name__)

# Ensure qrcodes directory exists
QR_DIR = "static/qrcodes"
os.makedirs(QR_DIR, exist_ok=True)

# Groq API details
API_KEY = "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"
GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"

HEADERS = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}

def classify_product(desc):
    payload = {
        "model": "llama3-8b-8192",
        "messages": [
            {
                "role": "system",
                "content": "You are a smart classifier that replies with just one word: NEED or WANT, based on whether the product is essential or discretionary."

                },
            {"role": "user", "content": f"Product description: {desc}"}
        ],
        "temperature": 0.2
    }

    try:
        response = requests.post(GROQ_URL, headers=HEADERS, json=payload)
        response.raise_for_status()
        result = response.json()
        return result["choices"][0]["message"]["content"].strip()
    except Exception as e:
        print("Error in classify_product():", e)
        return "Unknown"

def generate_qr(data_dict):
    try:
        json_str = str(data_dict).replace("'", '"')  # Ensure JSON-like format
        filename = os.path.join(QR_DIR, f"{uuid.uuid4()}.png")
        img = qrcode.make(json_str)
        img.save(filename)
        return filename
    except Exception as e:
        print("Error in generate_qr():", e)
        return None

@app.route("/", methods=["GET"])
def home():
    return render_template("form.html")

@app.route("/classify", methods=["POST"])
def classify():
    name = request.form.get("name")
    upi = request.form.get("upi")
    desc = request.form.get("desc")

    vendor_type = classify_product(desc)
    data = {
        "name": name,
        "upiId": upi,
        "type": vendor_type
    }

    qr_path = generate_qr(data)
    return render_template("form.html", qr_path=qr_path, vendor_type=vendor_type)

if __name__ == "__main__":
    app.run(debug=True)
