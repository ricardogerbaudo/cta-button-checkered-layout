var COLONIST_API = 'https://colonist.io/api';
var CORS_PROXY = 'https://api.allorigins.win/raw?url=' + encodeURIComponent(COLONIST_API);

/**
 * Fetches a Colonist API endpoint. Tries the direct URL first
 * (works on colonist.io, same origin). If CORS blocks it
 * (e.g., JSFiddle), retries through a CORS proxy.
 *
 * @param {string} path - API path (e.g., '/room-list.json')
 * @returns {Promise<Response>}
 */
function fetchAPI(path) {
  return fetch(COLONIST_API + path).catch(function () {
    console.log('[API] Direct fetch failed (CORS). Retrying via proxy...');
    return fetch(CORS_PROXY + encodeURIComponent(path));
  }).then(function (response) {
    if (!response.ok) throw new Error(response.status);
    return response;
  });
}

/**
 * Generates a random alphanumeric room code.
 * Used as fallback when the room list API is unavailable.
 *
 * @param {number} length - Code length (default 4)
 * @returns {string} Alphanumeric room code
 */
function generateRoomCode(length) {
  length = length || 4;
  var chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  var code = '';

  for (var i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return code;
}

/**
 * Button 1 (Top Left) - Quick Play.
 * Fetches the room list and joins a random room with available slots.
 * Fallback: creates a new room with a random code.
 */
function handleQuickPlay() {
  console.log('[QuickPlay] Fetching room list...');

  fetchAPI('/room-list.json')
    .then(function (response) { return response.json(); })
    .then(function (data) {
      console.log('[QuickPlay] Received ' + data.rooms.length + ' rooms');
      var room = pickJoinableRoom(data.rooms);

      if (room) {
        console.log('[QuickPlay] Joining room: ' + room.id + ' (' + room.players.length + '/' + room.maxPlayers + ' players)');
        window.open('https://colonist.io/#' + room.id, '_blank');
      } else {
        var code = generateRoomCode();
        console.log('[QuickPlay] No joinable rooms found. Creating new room: ' + code);
        window.open('https://colonist.io/#' + code, '_blank');
      }
    })
    .catch(function (err) {
      var code = generateRoomCode();
      console.log('[QuickPlay] Fetch failed (' + err.message + '). Creating new room: ' + code);
      window.open('https://colonist.io/#' + code, '_blank');
    });
}

/**
 * Picks a random room likely still waiting for players.
 * Filters for visible rooms with 1-2 players (fewer players =
 * less likely the game has already started by the time we arrive).
 * Falls back to any room with open slots if none found.
 *
 * @param {Array} rooms - Room list from /api/room-list.json
 * @returns {Object|null} Selected room, or null if none found
 */
function pickJoinableRoom(rooms) {
  if (!rooms || !rooms.length) return null;

  var open = rooms.filter(function (room) {
    if (!room.visible) return false;
    if (room.players.length >= room.maxPlayers) return false;
    return room.players.some(function (p) { return !p.isBot; });
  });

  // Prefer rooms with 1-2 players — more likely still in lobby
  var fewPlayers = open.filter(function (room) {
    return room.players.length <= 2;
  });

  var pool = fewPlayers.length > 0 ? fewPlayers : open;
  console.log('[QuickPlay] Found ' + pool.length + ' joinable rooms (' + fewPlayers.length + ' with 1-2 players)');
  if (!pool.length) return null;

  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * Button 2 (Bottom Right) - Watch Live.
 * Fetches the active game list and navigates to spectate
 * a random game with real players.
 *
 * Uses /api/game-list.json (active games, not lobby rooms).
 * Fallback: redirects to the lobby page.
 */
function handleWatchLive() {
  console.log('[WatchLive] Fetching game list...');

  fetchAPI('/game-list.json')
    .then(function (response) { return response.json(); })
    .then(function (data) {
      console.log('[WatchLive] Received ' + data.games.length + ' active games');
      var game = pickSpectateGame(data.games);

      if (game) {
        console.log('[WatchLive] Spectating game: ' + game.id + ' (' + game.players.length + ' players)');
        window.open('https://colonist.io/#' + game.id, '_blank');
      } else {
        console.log('[WatchLive] No spectatable games. Redirecting to lobby.');
        window.open('https://colonist.io/#lobby', '_blank');
      }
    })
    .catch(function (err) {
      console.log('[WatchLive] Fetch failed (' + err.message + '). Redirecting to lobby.');
      window.open('https://colonist.io/#lobby', '_blank');
    });
}

/**
 * Picks a random active game suitable for spectating.
 * Filters for games with 4+ players (likely full/in-progress).
 * Full games auto-enter spectate mode on colonist.io.
 * Falls back to 3+ players if no 4-player games exist.
 *
 * @param {Array} games - Game list from /api/game-list.json
 * @returns {Object|null} Selected game, or null if none found
 */
function pickSpectateGame(games) {
  if (!games || !games.length) return null;

  var fourPlus = games.filter(function (game) {
    return game.players.length >= 4 && hasHumans(game, 2);
  });

  var threePlus = fourPlus.length > 0 ? fourPlus : games.filter(function (game) {
    return game.players.length >= 3 && hasHumans(game, 2);
  });

  var pool = threePlus;
  console.log('[WatchLive] Found ' + pool.length + ' spectatable games (' + fourPlus.length + ' with 4+ players)');
  if (!pool.length) return null;

  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * Checks if a game has at least `min` human players.
 */
function hasHumans(game, min) {
  var count = game.players.filter(function (p) {
    return !p.isBot;
  }).length;
  return count >= min;
}
