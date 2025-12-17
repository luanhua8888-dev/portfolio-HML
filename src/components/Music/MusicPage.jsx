import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaPlay, FaPause, FaStepForward, FaStepBackward, FaHeart, FaRegHeart, FaRandom, FaRedo, FaCompactDisc, FaChevronDown, FaSpotify } from 'react-icons/fa';
import { supabase } from '../../lib/supabaseClient';
import { loginUrl, getTokenFromUrl, spotifyApi } from '../../lib/spotify';

const MusicPage = () => {
    // Auth State
    const [token, setToken] = useState(null);
    const [deviceId, setDeviceId] = useState(null);
    const [player, setPlayer] = useState(null);

    // App State
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [library, setLibrary] = useState([]);
    const [loading, setLoading] = useState(false);
    const [view, setView] = useState('discover'); // 'discover' | 'library'

    // Player State
    const [currentTrack, setCurrentTrack] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isPlayerOpen, setIsPlayerOpen] = useState(false);
    const [queue, setQueue] = useState([]);

    // Auth & Player Init
    useEffect(() => {
        const hash = getTokenFromUrl();
        window.location.hash = "";
        const _token = hash.access_token || localStorage.getItem('spotify_token');

        if (_token) {
            setToken(_token);
            localStorage.setItem('spotify_token', _token);
            initializeSpotifyPlayer(_token);
            fetchLibrary();
        }
    }, []);

    const initializeSpotifyPlayer = (accessToken) => {
        if (window.Spotify) return; // Already loaded

        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;
        document.body.appendChild(script);

        window.onSpotifyWebPlaybackSDKReady = () => {
            const newPlayer = new window.Spotify.Player({
                name: 'Antigravity Portfolio Player',
                getOAuthToken: cb => { cb(accessToken); },
                volume: 0.5
            });

            newPlayer.addListener('ready', ({ device_id }) => {
                console.log('Ready with Device ID', device_id);
                setDeviceId(device_id);
            });

            newPlayer.addListener('not_ready', ({ device_id }) => {
                console.log('Device ID has gone offline', device_id);
            });

            newPlayer.addListener('player_state_changed', (state) => {
                if (!state) return;
                setIsPlaying(!state.paused);

                // Sync current track from Spotify state
                const sTrack = state.track_window.current_track;
                if (sTrack) {
                    // Update current track purely for UI if needed, 
                    // but we generally rely on our own meta data for better resolution
                }
            });

            newPlayer.connect();
            setPlayer(newPlayer);
        };
    };

    const fetchLibrary = async () => {
        if (!supabase) return;
        const { data, error } = await supabase.from('songs').select('*').order('created_at', { ascending: false });
        if (!error && data) setLibrary(data);
    };

    const searchMusic = async (e) => {
        e.preventDefault();
        if (!query.trim() || !token) return;
        setLoading(true);
        setView('discover');

        try {
            const data = await spotifyApi.search(query, token);
            if (data.tracks) {
                setResults(data.tracks.items);
            }
        } catch (err) {
            console.error("Search Error", err);
            if (err.status === 401) logout(); // Token expired
        } finally {
            setLoading(false);
        }
    };

    const playTrack = async (track, list) => {
        if (!deviceId || !token) return;

        // Spotify API Format Normalization
        const isSpotifyObj = track.uri;
        const normalizedTrack = isSpotifyObj ? {
            title: track.name,
            artist: track.artists[0].name,
            cover_url: track.album.images[0]?.url,
            uri: track.uri,
            track_id: track.id,
            id: track.id
        } : track;

        setQueue(list || [normalizedTrack]);
        setCurrentTrack(normalizedTrack);
        setIsPlayerOpen(true);

        await spotifyApi.play(token, deviceId, normalizedTrack.uri);
    };

    const togglePlay = () => {
        if (player) player.togglePlay();
    };

    const handleNext = () => {
        if (player) player.nextTrack();
    };

    const handlePrev = () => {
        if (player) player.previousTrack();
    };

    const logout = () => {
        setToken(null);
        localStorage.removeItem('spotify_token');
        window.location.reload();
    };

    const saveSong = async (track) => {
        if (!supabase) return;
        // Check duplicates logic...
        const newSong = {
            title: track.name || track.title,
            artist: (track.artists ? track.artists[0].name : track.artist),
            album: (track.album ? track.album.name : track.album),
            cover_url: (track.album ? track.album.images[0].url : track.cover_url),
            uri: track.uri, // Changed from preview_url to URI
            track_id: track.id || track.track_id
        };

        const { error } = await supabase.from('songs').insert([newSong]);
        if (!error) fetchLibrary();
    };

    const isLoved = (trackId) => library.some(s => s.track_id === trackId);

    // If NOT logged in, show Landing
    if (!token) {
        return (
            <div className="min-h-screen bg-[#050511] text-white flex flex-col items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1614149162883-504ce4d13909?q=80&w=2574&auto=format&fit=crop')] bg-cover bg-center opacity-20 blur-sm" />
                <div className="relative z-10 text-center p-8 bg-black/40 backdrop-blur-xl rounded-3xl border border-white/10 max-w-md w-full">
                    <FaSpotify className="text-6xl text-[#1DB954] mx-auto mb-6" />
                    <h1 className="text-3xl font-bold mb-4">Connect with Spotify</h1>
                    <p className="text-white/60 mb-8">Unlock full song playback and access your portfolio library directly.</p>
                    <a href={loginUrl} className="block w-full py-4 bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold rounded-full transition-all transform hover:scale-105">
                        Login to Spotify
                    </a>
                    <p className="text-xs text-white/30 mt-4">Requires Spotify Premium for Web Playback</p>
                </div>
            </div>
        );
    }

    // Main Player UI (Same as before but hooked to Spotify)
    return (
        <div className="min-h-screen bg-[#050511] text-white overflow-hidden relative font-sans selection:bg-indigo-500/30">
            {/* Background Ambience */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <motion.div
                    key={currentTrack?.cover_url}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.3 }}
                    transition={{ duration: 1.5 }}
                    className="absolute inset-0 bg-cover bg-center blur-[80px]"
                    style={{ backgroundImage: `url(${currentTrack?.cover_url || ''})`, transform: 'scale(1.2)' }}
                />
            </div>

            {/* FULL SCREEN PLAYER */}
            <AnimatePresence>
                {isPlayerOpen && currentTrack && (
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed inset-0 z-50 bg-[#090909] overflow-y-auto"
                    >
                        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
                            <img src={currentTrack.cover_url} className="w-full h-full object-cover blur-[100px] scale-125" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#090909] via-[#090909]/80 to-black/40" />
                        </div>

                        <div className="relative z-10 min-h-screen p-6 flex flex-col">
                            <div className="max-w-5xl mx-auto w-full h-full flex flex-col">
                                {/* Top Bar */}
                                <div className="flex justify-between items-center mb-4 shrink-0">
                                    <span className="text-xs font-bold tracking-widest text-[#1DB954] uppercase flex items-center gap-2"><FaSpotify /> Premium Player</span>
                                    <button onClick={() => setIsPlayerOpen(false)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/20 transition-all">
                                        <FaChevronDown />
                                    </button>
                                </div>

                                {/* Main Content Grid */}
                                <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                                    {/* Details */}
                                    <div className="lg:col-span-7 flex flex-col justify-center h-full min-h-[40vh]">
                                        <div className="space-y-6 text-xl md:text-2xl font-bold leading-relaxed max-w-xl">
                                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{currentTrack.title}</h1>
                                            <p className="text-2xl text-white/50">{currentTrack.artist}</p>
                                        </div>
                                    </div>

                                    {/* Controls Right */}
                                    <div className="lg:col-span-5 flex flex-col bg-white/5 rounded-3xl p-6 backdrop-blur-md border border-white/5">
                                        <div className="w-64 h-64 mx-auto rounded-xl overflow-hidden shadow-2xl relative mb-6 shrink-0 aspect-square">
                                            <img src={currentTrack.cover_url} className="w-full h-full object-cover" />
                                        </div>

                                        <div className="flex items-center justify-center gap-6 mt-4">
                                            <button onClick={handlePrev} className="text-3xl hover:text-white text-white/80 transition-colors"><FaStepBackward /></button>
                                            <button onClick={togglePlay} className="w-16 h-16 rounded-full bg-[#1DB954] text-black flex items-center justify-center hover:scale-105 transition-transform shadow-xl">
                                                {isPlaying ? <FaPause size={24} /> : <FaPlay size={24} className="ml-1" />}
                                            </button>
                                            <button onClick={handleNext} className="text-3xl hover:text-white text-white/80 transition-colors"><FaStepForward /></button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* MAIN SEARCH VIEW */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-32">
                {/* Navigation */}
                <div className="flex justify-between items-center mb-8">
                    <div className="flex gap-4">
                        <button onClick={() => setView('discover')} className={`text-xl font-bold ${view === 'discover' ? 'text-white' : 'text-white/40'}`}>Discover</button>
                        <button onClick={() => setView('library')} className={`text-xl font-bold ${view === 'library' ? 'text-white' : 'text-white/40'}`}>My Library</button>
                    </div>
                    <button onClick={logout} className="text-xs text-red-400 hover:text-red-300">Logout</button>
                </div>

                <form onSubmit={searchMusic} className="mb-8 relative">
                    <input
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder="Search Spotify..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pl-10 focus:border-[#1DB954] outline-none"
                    />
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" />
                </form>

                <div className="space-y-2">
                    {(view === 'discover' ? results : library).map((item, i) => {
                        // Normalize for display list
                        const isLib = view === 'library';
                        const title = isLib ? item.title : item.name;
                        const artist = isLib ? item.artist : item.artists[0].name;
                        const cover = isLib ? item.cover_url : (item.album.images[2]?.url || item.album.images[0]?.url);

                        return (
                            <div key={i} onClick={() => playTrack(item)} className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 cursor-pointer group">
                                <span className="text-white/40 w-6">{i + 1}</span>
                                <img src={cover} className="w-10 h-10 rounded object-cover" />
                                <div className="flex-1">
                                    <h4 className={`font-bold ${currentTrack?.id === item.id ? 'text-[#1DB954]' : 'text-white'}`}>{title}</h4>
                                    <p className="text-xs text-white/50">{artist}</p>
                                </div>
                                <button onClick={(e) => { e.stopPropagation(); saveSong(item); }} className="opacity-0 group-hover:opacity-100 p-2 text-white/40 hover:text-[#1DB954]"><FaHeart /></button>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
};

export default MusicPage;
