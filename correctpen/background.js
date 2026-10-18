// CorrectPen - motor de corrección local, sin dependencias externas.

const COMMON_MISTAKES = {
  es: {
    'haiga': 'haya',
    'habian': 'habían',
    'habia': 'había',
    'havia': 'había',
    'a sido': 'ha sido',
    'a estado': 'ha estado',
    'a hecho': 'ha hecho',
    'a dicho': 'ha dicho',
    'a visto': 'ha visto',
    'a ido': 'ha ido',
    'a venido': 'ha venido',
    'esque': 'es que',
    'porfavor': 'por favor',
    'osea': 'o sea',
    'enserio': 'en serio',
    'aver': 'a ver',
    'deacuerdo': 'de acuerdo',
    'denuevo': 'de nuevo',
    'ahi': 'ahí',
    'alli': 'allí',
    'alla': 'allá',
    'valla': 'vaya',
    'a parte': 'aparte',
    'entonses': 'entonces',
    'tons': 'entonces',
    'nose': 'no sé',
    'muxo': 'mucho',
    'muxa': 'mucha'
  },
  en: {
    'teh': 'the',
    'recieve': 'receive',
    'recieved': 'received',
    'seperate': 'separate',
    'definately': 'definitely',
    'occured': 'occurred',
    'alot': 'a lot',
    'thier': 'their',
    'adn': 'and',
    'yuo': 'you',
    'waht': 'what',
    'wich': 'which',
    'becuase': 'because',
    'wierd': 'weird',
    'freind': 'friend',
    'untill': 'until',
    'begining': 'beginning',
    'tomorow': 'tomorrow',
    'tommorow': 'tomorrow',
    'dont': "don't",
    'cant': "can't",
    'wont': "won't",
    'didnt': "didn't",
    'isnt': "isn't",
    'wasnt': "wasn't",
    'doesnt': "doesn't",
    'couldnt': "couldn't",
    'wouldnt': "wouldn't",
    'shouldnt': "shouldn't",
    'im': "I'm",
    'ive': "I've",
    'ill': "I'll",
    'youre': "you're",
    'youve': "you've",
    'theyre': "they're",
    'weve': "we've"
  },
  pt: {
    'concerteza': 'com certeza',
    'derrepente': 'de repente',
    'apartir': 'a partir',
    'atravez': 'através',
    'comsiguir': 'conseguir',
    'conssiguir': 'conseguir',
    'voçe': 'você',
    'vc': 'você',
    'vcs': 'vocês',
    'tb': 'também',
    'tbm': 'também',
    'pq': 'porque',
    'q': 'que',
    'nao': 'não',
    'naum': 'não',
    'agente': 'a gente',
    'aki': 'aqui',
    'eh': 'é'
  }
};

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function applyDictionary(text, lang) {
  const dict = COMMON_MISTAKES[lang] || {};
  // Ordenar de mayor a menor longitud para que "a sido" se procese antes que "a"
  const keys = Object.keys(dict).sort((a, b) => b.length - a.length);
  let result = text;

  for (const key of keys) {
    const val = dict[key];
    const safe = escapeRegex(key);
    const startBound = /^[\p{L}]/u.test(key) ? '(?<![\\p{L}])' : '';
    const endBound = /[\p{L}]$/u.test(key) ? '(?![\\p{L}])' : '';
    const re = new RegExp(`${startBound}${safe}${endBound}`, 'giu');

    result = result.replace(re, (match) => {
      if (match[0] === match[0].toUpperCase()) {
        return val.charAt(0).toUpperCase() + val.slice(1);
      }
      return val;
    });
  }
  return result;
}

function applyHeuristics(text) {
  let t = text;
  // Espacios múltiples → uno
  t = t.replace(/[ \t]{2,}/g, ' ');
  // Espacio antes de puntuación
  t = t.replace(/\s+([.,;:!?])/g, '$1');
  // Falta de espacio tras puntuación (excepto decimales tipo 3.14)
  t = t.replace(/([.,;:!?])([\p{L}])/gu, '$1 $2');
  // Puntuación repetida
  t = t.replace(/,{2,}/g, ',');
  t = t.replace(/\.{4,}/g, '...');
  t = t.replace(/([!?]){2,}/g, '$1');
  // Mayúscula al inicio de frase
  t = t.replace(/([.!?]\s+)([\p{Ll}])/gu, (_, p, c) => p + c.toUpperCase());
  t = t.replace(/^\s*([\p{Ll}])/u, (_, c) => c.toUpperCase());
  return t;
}

function correctText(text, language = 'es') {
  let corrected = applyDictionary(text, language);
  corrected = applyHeuristics(corrected);
  return corrected;
}

chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request && request.action === 'correct') {
    try {
      const corrected = correctText(request.text, request.language || 'es');
      sendResponse({ corrected });
    } catch (err) {
      sendResponse({ error: err?.message || String(err) });
    }
    return true;
  }
});