from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import json
import re
from datetime import datetime

app = Flask(__name__)
CORS(app)

# 🔥 API KEY INCLUDED
GEMINI_API_KEY = "AIzaSyByORHox-PdyVEQEOzeaEyYF75X3ec3Mdc"
GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent"

SYSTEM_PROMPT = """
Kamu Mazkiplay Cyber Assistant v3.0 FULLSTACK.
Jawab dengan format TERMINAL HACKER:

## PENJELASAN
[Definisi singkat]

## KEGUNAAN
[Fungsi utama]

## MANFAAT
• Benefit 1
• Benefit 2
• Benefit 3

## CARA PAKAI
1. Step by step
2. Dengan screenshot/code

## COMMAND READY
```bash
curl -X POST http://target.com/shell
