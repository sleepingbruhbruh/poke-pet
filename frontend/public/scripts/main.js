
const form = document.getElementById('chat-form');
const input = document.getElementById('chat-input');
const log = document.getElementById('chat-log');
const infoContainer = document.getElementById('pet-info');
const friendshipBar = document.getElementById('friendship');
const friendshipValueText = document.getElementById('friendship-value');
const pokemonImage = document.getElementById('pokemon-image');

const stageToImage = {
  1: '/assets/pichu.png',
  2: '/assets/pikachu.png',
  3: '/assets/raichu.png',
};

const stageToName = {
  1: 'Pichu',
  2: 'Pikachu',
  3: 'Raichu',
};

function formatInfoValue(value) {
  if (value === null || value === undefined) {
    return '—';
  }
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  return String(value);
}

function clampFriendship(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return 0;
  }
  return Math.min(Math.max(Math.round(numeric), 0), 100);
}

const infoPriority = ['name', 'species', 'owner', 'last-chatted'];

function renderPokemonInfo(pokemon) {
  if (!infoContainer) return;

  infoContainer.innerHTML = '';

  const seenKeys = new Set();
  const orderedKeys = [];

  infoPriority.forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(pokemon, key)) {
      orderedKeys.push(key);
      seenKeys.add(key);
    }
  });

  Object.keys(pokemon).forEach((key) => {
    if (!seenKeys.has(key)) {
      orderedKeys.push(key);
      seenKeys.add(key);
    }
  });

  orderedKeys.forEach((key) => {
    const rawValue = pokemon[key];
    const displayValue = key === 'friendship' ? clampFriendship(rawValue) : rawValue;

    const row = document.createElement('div');
    row.className = 'info-row';

    const label = document.createElement('span');
    label.className = 'info-label';
    label.textContent = `${key}:`;

    const infoValue = document.createElement('span');
    infoValue.className = 'info-value';
    infoValue.textContent = formatInfoValue(displayValue);

    row.append(label, infoValue);
    infoContainer.appendChild(row);
  });

  const stage = Number(pokemon.stage);
  const imagePath = stageToImage[stage];

  if (pokemonImage) {
    if (imagePath) {
      pokemonImage.src = imagePath;
      const stageName = stageToName[stage] ?? 'Pokemon';
      pokemonImage.alt = `${stageName} illustration`;
    } else {
      pokemonImage.removeAttribute('src');
      pokemonImage.alt = 'Pokemon';
    }
  }

  if (friendshipBar) {
    const friendshipValue = clampFriendship(pokemon.friendship);
    friendshipBar.value = friendshipValue;
    if (friendshipValueText) {
      friendshipValueText.textContent = String(friendshipValue);
    }
  }
}

async function loadPokemon() {
  if (!infoContainer) return;

  try {
    const response = await fetch('/pokemon_placeholder.json', { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`Failed to load pokemon: ${response.status}`);
    }
    const pokemon = await response.json();
    renderPokemonInfo(pokemon);
  } catch (error) {
    console.error('Unable to load Pokémon data', error);
    infoContainer.textContent = 'Unable to load Pokémon data.';
  }
}

loadPokemon();

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

