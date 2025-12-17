// Spotify Auth & API Utilities

const authEndpoint = "https://accounts.spotify.com/authorize";
const redirectUri = window.location.origin + '/'; // Always append slash to match typical Dashboard entries
const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;

const scopes = [
    "streaming",
    "user-read-email",
    "user-read-private",
    "user-library-read",
    "user-library-modify",
    "user-read-playback-state",
    "user-modify-playback-state",
];

// Construct URL using URLSearchParams to ensure correct encoding
const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: scopes.join(" "),
    response_type: "token",
    show_dialog: "true",
});

export const loginUrl = `${authEndpoint}?${params.toString()}`;

export const getTokenFromUrl = () => {
    return window.location.hash
        .substring(1)
        .split("&")
        .reduce((initial, item) => {
            let parts = item.split("=");
            initial[parts[0]] = decodeURIComponent(parts[1]);
            return initial;
        }, {});
};

export const spotifyApi = {
    search: async (query, token) => {
        const res = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=20`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return res.json();
    },

    play: async (token, deviceId, trackUri) => {
        await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
            method: 'PUT',
            body: JSON.stringify({ uris: [trackUri] }),
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        });
    },

    pause: async (token) => {
        await fetch(`https://api.spotify.com/v1/me/player/pause`, {
            method: 'PUT',
            headers: { Authorization: `Bearer ${token}` }
        });
    }
};
