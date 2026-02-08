// 🔥 MAZKIPLKAY CYBER FULLSTACK v3.0
class MazkiplayTerminal {
    constructor() {
        this.accessKey = '211421';
        this.geminiApiKey = 'AIzaSyByORHox-PdyVEQEOzeaEyYF75X3ec3Mdc';
        this.pythonBackendUrl = 'http://localhost:5000/api/analyze'; // Python Flask
        this.elements = {};
        this.init();
    }

    init() {
        this.cacheElements();
        this.bindEvents();
        this.updateClock();
        this.testConnections();
        console.log('🔥 Mazkiplay Terminal v3.0 Initialized');
    }

    cacheElements() {
        const ids = ['auth-gate', 'terminal-container', 'access-key', 'agree-check', 'unlock-btn', 
                    'terminal-output', 'command-input', 'exec-btn', 'status-indicator', 'clock'];
        ids.forEach(id => {
            this.elements[id] = document.getElementById(id);
        });
    }

    bindEvents() {
        this.elements['access-key'].addEventListener('input', () => this.checkAuth());
        this.elements['agree-check'].addEventListener('change', () => this.checkAuth());
        this.elements['unlock-btn'].addEventListener('click', () => this.unlockTerminal());
        this.elements['command-input'].addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.executeCommand();
        });
        this.elements['exec-btn'].addEventListener('click', () => this.executeCommand());
    }

    checkAuth() {
        const keyValid = this.elements['access-key'].value === this.accessKey;
        const agreed = this.elements['agree-check'].checked;
        
        this.elements['unlock-btn'].disabled = !(keyValid && agreed);
        
        if (keyValid) {
            this.elements['access-key'].style.borderColor = '#00ff41';
            this.elements['access-key'].style.boxShadow = '0 0 15px rgba(0,255,65,0.6)';
        } else {
            this.elements['access-key'].style.borderColor = '#ff4444';
            this.elements['access-key'].style.boxShadow = 'none';
        }
    }

    unlockTerminal() {
        this.elements['auth-gate'].style.display = 'none';
        this.elements['terminal-container'].classList.remove('hidden');
        this.showWelcome();
    }

    showWelcome() {
        const welcome = `
<div class="output-line">
    <span class="success">[+] =============================================</span>
</div>
<div class="output-line">
    <span class="success">[+] MAZKIPLKAY CYBER TERMINAL v3.0 FULLSTACK</span>
</div>
<div class="output-line">
    <span class="success">[+] Selamat datang di pusat pengetahuan cybersecurity!</span>
</div>
<div class="output-line">
    <span class="output">Saya <span class="prompt">mazkiplay AI assistant</span> siap membantu 24/7</span>
</div>
<div class="output-line">
    <span class="output">💀 Tanya apa saja: exploits, payloads, coding, red teaming...</span>
</div>
<div class="output-line">
    <span class="prompt">$ Contoh: "cara exploit XSS", "reverse shell python", "bypass WAF"</span>
</div>
<div class="output-line">
    <span class="success">[+] Type command & ENTER untuk mulai...</span>
</div>
<div class="output-line">
    <span class="success">[+] =============================================</span>
</div>
        `;
        this.addOutput(welcome);
    }

    async executeCommand() {
        const command = this.elements['command-input'].value.trim();
        if (!command) return;

        // Show user input
        this.addOutput(`<div class="command"><span class="prompt">mazkiplay@cyber:~$</span> ${this.escapeHtml(command)}</div>`);
        this.elements['command-input'].value = '';

        // Disable input during processing
        this.elements['command-input'].disabled = true;
        this.elements['exec-btn'].disabled = true;
        this.elements['status-indicator'].textContent = '● PROCESSING';
        this.elements['status-indicator'].className = 'processing';

        try {
            // Try Python backend first, fallback to Gemini
            let response = await this.queryPythonBackend(command);
            if (!response) {
                response = await this.queryGeminiDirect(command);
            }
            this.addOutput(response);
        } catch (error) {
            this.addOutput(`<div class="error-line">
                <span class="error">[-] ERROR:</span> ${this.escapeHtml(error.message)}<br>
                <span class="output">Coba lagi bro atau restart Python backend!</span>
            </div>`);
        } finally {
            // Re-enable input
            this.elements['command-input'].disabled = false;
            this.elements['exec-btn'].disabled = false;
            this.elements['status-indicator'].textContent = '● LIVE';
            this.elements['status-indicator'].className = 'live';
        }
    }

    async queryPythonBackend(command) {
        try {
            const response = await fetch(`${this.pythonBackendUrl}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: command })
            });
            if (response.ok) {
                const data = await response.json();
                return this.formatTerminalOutput(data.response);
            }
        } catch (e) {
            console.log('Python backend offline, using Gemini direct');
            return null;
        }
    }

    async queryGeminiDirect(command) {
        const systemPrompt = `Kamu Mazkiplay Cyber Assistant v3.0. Jawab "${command}" dengan format:

## PENJELASAN
[Apa itu? 2-3 kalimat]

## KEGUNAAN  
[Fungsi utama]

## MANFAAT
• Poin 1
• Poin 2  
• Poin 3

## CARA PAKAI
1. Step 1
2. Step 2

## COMMAND
\`\`\`bash
copy-paste ready command
\`\`\`

## RESIKO
[Risiko & mitigasi]

---
<span class="success">by, mazkiplay 🔥</span>

Bahasa Indonesia, hacker style, santai panggil "bro".`;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${this.geminiApiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: systemPrompt }] }],
                generationConfig: { temperature: 0.8, maxOutputTokens: 4000 }
            })
        });

        if (!response.ok) throw new Error(`Gemini API: ${response.status}`);
        
        const data = await response.json();
        return this.formatTerminalOutput(data.candidates[0].content.parts[0].text);
    }

    formatTerminalOutput(text) {
        return `<div class="ai-response">
            ${text
                .replace(/## (.*?)(<br>|\n)/g, '<div class="section-title">$1</div>')
                .replace(/`(.*?)`/g, '<code class="inline-code">$1</code>')
                .replace(/```([\w]*)\n([\s\S]*?)```/g, '<div class="code-block"><span class="lang">$1</span><pre>$2</pre></div>')
                .replace(/\*\*(.*?)\*\*/g, '<strong class="highlight">$1</strong>')
                .replace(/\n/g, '<br>')
            }
        </div>`;
    }

    addOutput(html) {
        const div = document.createElement('div');
        div.innerHTML = html;
        this.elements['terminal-output'].appendChild(div);
        this.elements['terminal-output'].scrollTop = this.elements['terminal-output'].scrollHeight;
    }

    escapeHtml(text) {
        const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
        return text.replace(/[&<>"']/g, m => map[m]);
    }

    updateClock() {
        setInterval(() => {
            this.elements['clock'].textContent = new Date().toLocaleString('id-ID', {
                hour: '2-digit', minute: '2-digit', second: '2-digit'
            });
        }, 1000);
    }

    async testConnections() {
        // Test Python backend
        try {
            const test = await fetch(`${this.pythonBackendUrl}/ping`);
            if (test.ok) {
                console.log('✅ Python backend LIVE');
            }
        } catch(e) {
            console.log('⚠️ Python backend OFFLINE - using Gemini direct');
        }
        
        // Test Gemini
        try {
            await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${this.geminiApiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: 'test' }] }] })
            });
            console.log('✅ Gemini API LIVE');
        } catch(e) {
            console.error('❌ Gemini API OFFLINE');
        }
    }
}

// 🔥 INIT TERMINAL
document.addEventListener('DOMContentLoaded', () => {
    new MazkiplayTerminal();
});
