
const form = document.getElementById('chat-form');
const input = document.getElementById('chat-input');
const log = document.getElementById('chat-log');

function appendMessage(sender, text) {
  const line = document.createElement('div');
  line.textContent = `${sender}: ${text}`;
  log.appendChild(line);
  log.scrollTop = log.scrollHeight;
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  appendMessage('a', text);
  appendMessage('b', text);
  input.value = '';
});

