var COLONIST_API = 'https://colonist.io/api';
var CORS_PROXY = 'https://corsproxy.io/?url=' + encodeURIComponent(COLONIST_API);

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
        window.location.href = 'https://colonist.io/#' + room.id;
      } else {
        var code = generateRoomCode();
        console.log('[QuickPlay] No joinable rooms found. Creating new room: ' + code);
        window.location.href = 'https://colonist.io/#' + code;
      }
    })
    .catch(function (err) {
      var code = generateRoomCode();
      console.log('[QuickPlay] Fetch failed (' + err.message + '). Creating new room: ' + code);
      window.location.href = 'https://colonist.io/#' + code;
    });
}

/**
 * Picks a random room with available slots.
 * Filters for visible rooms with at least one human player
 * and open spots remaining.
 *
 * @param {Array} rooms - Room list from /api/room-list.json
 * @returns {Object|null} Selected room, or null if none found
 */
function pickJoinableRoom(rooms) {
  if (!rooms || !rooms.length) return null;

  var joinable = rooms.filter(function (room) {
    if (!room.visible) return false;
    if (room.players.length >= room.maxPlayers) return false;
    var hasHuman = room.players.some(function (p) {
      return !p.isBot;
    });
    return hasHuman;
  });

  console.log('[QuickPlay] Found ' + joinable.length + ' joinable rooms');
  if (!joinable.length) return null;

  return joinable[Math.floor(Math.random() * joinable.length)];
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
        window.location.href = 'https://colonist.io/#' + game.id;
      } else {
        console.log('[WatchLive] No spectatable games. Redirecting to lobby.');
        window.location.href = 'https://colonist.io/#lobby';
      }
    })
    .catch(function (err) {
      console.log('[WatchLive] Fetch failed (' + err.message + '). Redirecting to lobby.');
      window.location.href = 'https://colonist.io/#lobby';
    });
}

/**
 * Picks a random active game suitable for spectating.
 * Filters for games with at least 2 human players.
 *
 * @param {Array} games - Game list from /api/game-list.json
 * @returns {Object|null} Selected game, or null if none found
 */
function pickSpectateGame(games) {
  if (!games || !games.length) return null;

  var spectatable = games.filter(function (game) {
    var humanCount = game.players.filter(function (p) {
      return !p.isBot;
    }).length;
    return humanCount >= 2;
  });

  console.log('[WatchLive] Found ' + spectatable.length + ' spectatable games');
  if (!spectatable.length) return null;

  return spectatable[Math.floor(Math.random() * spectatable.length)];
}
