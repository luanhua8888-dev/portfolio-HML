import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaHeart, FaTrash, FaChevronDown, FaYoutube, FaPlus, FaSearch, FaMusic } from 'react-icons/fa';
import { supabase } from '../../lib/supabaseClient';

const MusicPage = () => {
    // App State
    const [library, setLibrary] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [mode, setMode] = useState('library'); // 'library' | 'search'

    // Player State
    const [currentTrack, setCurrentTrack] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isPlayerOpen, setIsPlayerOpen] = useState(false);
    const [queue, setQueue] = useState([]);

    // Lyrics & Time State
    const [lyricsData, setLyricsData] = useState([]); // Array of { time, text }
    const [hasSyncedLyrics, setHasSyncedLyrics] = useState(false);
    const [plainLyrics, setPlainLyrics] = useState('');
    const [lyricsLoading, setLyricsLoading] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    // Audio Ref
    const audioRef = useRef(new Audio());
    // Ref for active lyric line to scroll to
    const activeLyricRef = useRef(null);

    // Init Library & Audio Listeners
    useEffect(() => {
        fetchLibrary();

        const audio = audioRef.current;
        const onEnded = () => setIsPlaying(false);
        const onError = (e) => {
            console.error("Audio Error", e);
            setIsPlaying(false);
            // alert("Unable to play preview.");
        };

        // Time Update for Synced Lyrics & Progress Bar
        const onTimeUpdate = () => {
            setCurrentTime(audio.currentTime);
        };

        const onLoadedMetadata = () => {
            setDuration(audio.duration);
        };

        audio.addEventListener('ended', onEnded);
        audio.addEventListener('error', onError);
        audio.addEventListener('timeupdate', onTimeUpdate);
        audio.addEventListener('loadedmetadata', onLoadedMetadata);

        return () => {
            audio.removeEventListener('ended', onEnded);
            audio.removeEventListener('error', onError);
            audio.removeEventListener('timeupdate', onTimeUpdate);
            audio.removeEventListener('loadedmetadata', onLoadedMetadata);
            audio.pause();
            audio.src = "";
        };
    }, []);

    // Auto-scroll lyrics
    useEffect(() => {
        if (activeLyricRef.current) {
            activeLyricRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [currentTime]);

    // Toggle Play/Pause when state changes
    useEffect(() => {
        if (currentTrack && audioRef.current.src) {
            if (isPlaying) {
                audioRef.current.play().catch(e => console.warn("Play interrupted", e));
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying]);

    const fetchLibrary = async () => {
        if (!supabase) return;
        const { data, error } = await supabase.from('songs').select('*').order('created_at', { ascending: false });
        if (!error && data) setLibrary(data);
    };

    const parseLRC = (lrcString) => {
        const lines = lrcString.split('\n');
        const regex = /^\[(\d{2}):(\d{2})\.(\d{2,3})\](.*)/;
        const result = [];

        for (const line of lines) {
            const match = line.match(regex);
            if (match) {
                const minutes = parseInt(match[1], 10);
                const seconds = parseInt(match[2], 10);
                const milliseconds = parseInt(match[3].length === 3 ? match[3] : match[3] + '0', 10); // Normalizing ms
                const time = minutes * 60 + seconds + milliseconds / 1000;
                const text = match[4].trim();
                if (text) result.push({ time, text });
            }
        }
        return result;
    };

    const fetchLyrics = async (artist, title) => {
        setLyricsLoading(true);
        setHasSyncedLyrics(false);
        setLyricsData([]);
        setPlainLyrics('');

        try {
            const res = await fetch(`https://lrclib.net/api/get?artist_name=${encodeURIComponent(artist)}&track_name=${encodeURIComponent(title)}`);
            if (res.ok) {
                const data = await res.json();

                if (data.syncedLyrics) {
                    setLyricsData(parseLRC(data.syncedLyrics));
                    setHasSyncedLyrics(true);
                } else if (data.plainLyrics) {
                    setPlainLyrics(data.plainLyrics);
                } else {
                    setPlainLyrics("Lyrics not found.");
                }
            } else {
                // Fallback search
                const searchRes = await fetch(`https://lrclib.net/api/search?q=${encodeURIComponent(title + " " + artist)}`);
                if (searchRes.ok) {
                    const searchData = await searchRes.json();
                    if (searchData && searchData.length > 0) {
                        const firstHit = searchData[0];
                        if (firstHit.syncedLyrics) {
                            setLyricsData(parseLRC(firstHit.syncedLyrics));
                            setHasSyncedLyrics(true);
                        } else {
                            setPlainLyrics(firstHit.plainLyrics || "Lyrics not found.");
                        }
                    } else {
                        setPlainLyrics("Lyrics not found.");
                    }
                }
            }
        } catch (e) {
            console.error("Lyrics Error", e);
            setPlainLyrics("Could not load lyrics.");
        } finally {
            setLyricsLoading(false);
        }
    };

    const searchiTunes = async (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;
        setLoading(true);
        setMode('search');

        try {
            const res = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(inputValue)}&media=music&entity=song&limit=20`);
            const data = await res.json();
            setSearchResults(data.results);
        } catch (err) {
            console.error(err);
            // alert("Search failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const playFromSearch = (track) => {
        const newSong = {
            title: track.trackName,
            artist: track.artistName,
            album: track.collectionName,
            cover_url: track.artworkUrl100.replace('100x100bb', '500x500bb'),
            uri: '',
            track_id: track.trackId.toString(),
            preview_url: track.previewUrl,
            youtube_id: null
        };
        playTrack(newSong, searchResults);
    };

    const saveToLibrary = async (track) => {
        if (!supabase || !track) return;

        console.log("Saving track...", track);

        const isDuplicate = library.some(item => item.track_id === track.track_id);
        if (isDuplicate) {
            console.log("Already in library");
            return;
        }

        // REMOVED 'uri' and 'preview_url' to match existing DB Schema.
        const songToSave = {
            title: track.title,
            artist: track.artist,
            album: track.album || 'Single',
            cover_url: track.cover_url,
            track_id: track.track_id,
            youtube_id: ''
        };

        const { error } = await supabase.from('songs').insert([songToSave]);
        if (error) {
            console.error("Save Error:", error);
        } else {
            console.log("Saved.");
            fetchLibrary();
        }
    };

    const deleteSong = async (id, e) => {
        e.stopPropagation();
        const { error } = await supabase.from('songs').delete().eq('id', id);
        if (!error) fetchLibrary();
    };

    const playTrack = async (track, list) => {
        audioRef.current.pause();
        setIsPlaying(false);
        setLyricsData([]);
        setPlainLyrics('');
        setCurrentTime(0);

        setQueue(list || [track]);
        setCurrentTrack(track);
        setIsPlayerOpen(true);

        fetchLyrics(track.artist, track.title);

        // 1. Try built-in preview_url (search result)
        // 2. Try 'uri' if explicitly present
        let audioSrc = track.preview_url || (track.uri && track.uri.startsWith('http') ? track.uri : null);

        // 3. Fallback: If no audio source but we have an iTunes track_id, fetch it live (saved items)
        if (!audioSrc && track.track_id) {
            try {
                console.log("Fetching preview for:", track.track_id);
                // Lookup detailed info from iTunes
                const res = await fetch(`https://itunes.apple.com/lookup?id=${track.track_id}`);
                const data = await res.json();
                if (data.results && data.results.length > 0) {
                    audioSrc = data.results[0].previewUrl;
                }
            } catch (e) {
                console.error("iTunes Lookup Failed", e);
            }
        }

        if (audioSrc) {
            audioRef.current.src = audioSrc;
            audioRef.current.volume = 1.0;
            // Safari/Chrome autoplay policies might block this without user gesture, but click is a gesture.
            try {
                await audioRef.current.play();
                setIsPlaying(true);
            } catch (e) { console.error(e); }
        } else {
            console.warn("No preview available.");
        }
    };

    const handleNext = () => { /* alert("Next (To Be Implemented)"); */ };
    const handlePrev = () => { /* alert("Prev (To Be Implemented)"); */ };

    const formatTime = (time) => {
        if (isNaN(time)) return "0:00";
        const min = Math.floor(time / 60);
        const sec = Math.floor(time % 60);
        return `${min}:${sec < 10 ? '0' : ''}${sec}`;
    };

    // Find active lyric index
    const activeLyricIndex = hasSyncedLyrics
        ? lyricsData.findIndex((line, index) => {
            const nextLine = lyricsData[index + 1];
            return line.time <= currentTime && (!nextLine || nextLine.time > currentTime);
        })
        : -1;

    return (
        <div className="min-h-screen bg-[#050511] text-white overflow-hidden relative font-sans selection:bg-red-500/30">
            {/* Background Ambience */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <motion.div
                    key={currentTrack?.track_id}
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
                        <div className="relative z-10 min-h-screen p-6 flex flex-col justify-center items-center">
                            <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                                {/* Left: Player UI */}
                                <div className="flex flex-col gap-8 w-full max-w-lg mx-auto">
                                    <div className="relative aspect-square rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 group">
                                        <img src={currentTrack.cover_url} className="w-full h-full object-cover" />
                                        {/* Visualizer Overlay */}
                                        <div className={`absolute inset-0 bg-black/20 flex items-center justify-center ${isPlaying ? 'animate-pulse' : ''}`}>
                                            <div className={`w-32 h-32 rounded-full border-4 border-white/30 flex items-center justify-center ${isPlaying ? 'animate-spin-slow' : ''}`}>
                                                <div className="w-2 h-2 bg-white rounded-full"></div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6 text-center">
                                        <div className="space-y-2">
                                            <h2 className="text-3xl md:text-4xl font-bold leading-tight">{currentTrack.title}</h2>
                                            <p className="text-xl text-white/50">{currentTrack.artist}</p>
                                        </div>

                                        {/* REAL ProgressBar */}
                                        <div className="space-y-2">
                                            <div
                                                className="w-full h-2 bg-white/10 rounded-full overflow-hidden cursor-pointer"
                                                onClick={(e) => {
                                                    const rect = e.currentTarget.getBoundingClientRect();
                                                    const pos = (e.clientX - rect.left) / rect.width;
                                                    audioRef.current.currentTime = pos * duration;
                                                }}
                                            >
                                                <div
                                                    className="h-full bg-red-600 relative transition-all duration-100 ease-linear"
                                                    style={{ width: `${(currentTime / duration) * 100}%` }}
                                                ></div>
                                            </div>
                                            <div className="flex justify-between text-xs font-mono text-white/40">
                                                <span>{formatTime(currentTime)}</span>
                                                <span>{formatTime(duration)}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-center gap-8">
                                            <button onClick={handlePrev} className="text-3xl hover:text-white text-white/60 transition-colors"><FaStepBackward /></button>
                                            <button
                                                onClick={() => setIsPlaying(!isPlaying)}
                                                className="w-20 h-20 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform shadow-xl"
                                            >
                                                {isPlaying ? <FaPause /> : <FaPlay className="ml-1" />}
                                            </button>
                                            <button onClick={handleNext} className="text-3xl hover:text-white text-white/60 transition-colors"><FaStepForward /></button>
                                        </div>

                                        <div className="flex gap-4 justify-center">
                                            <button onClick={() => setIsPlayerOpen(false)} className="px-6 py-2 rounded-full border border-white/20 hover:bg-white/10 transition-colors text-sm font-bold uppercase tracking-wider">
                                                Close
                                            </button>
                                            <button
                                                onClick={() => saveToLibrary(currentTrack)}
                                                className={`px-6 py-2 rounded-full transition-colors text-sm font-bold uppercase tracking-wider flex items-center gap-2 ${library.some(i => i.track_id === currentTrack.track_id) ? 'bg-red-600 text-white' : 'bg-white/10 hover:bg-white/20'}`}
                                            >
                                                <FaHeart /> {library.some(i => i.track_id === currentTrack.track_id) ? 'Saved' : 'Save'}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Right: Lyrics UI (Synced) */}
                                <div className="hidden lg:block h-full min-h-[500px] bg-white/5 rounded-3xl p-8 border border-white/10 relative overflow-hidden">
                                    <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-6 sticky top-0 bg-transparent z-10 w-full text-center">Lyrics</h3>
                                    <div className="absolute inset-0 overflow-y-auto p-8 pt-16 custom-scrollbar text-center">
                                        {lyricsLoading ? (
                                            <div className="flex items-center justify-center h-full">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                                            </div>
                                        ) : hasSyncedLyrics ? (
                                            <div className="space-y-6 pb-40">
                                                {lyricsData.map((line, i) => (
                                                    <p
                                                        key={i}
                                                        ref={i === activeLyricIndex ? activeLyricRef : null}
                                                        className={`text-xl md:text-2xl transition-all duration-300 font-bold cursor-pointer hover:text-white ${i === activeLyricIndex ? 'text-white scale-105' : 'text-white/20 blur-[0.5px]'}`}
                                                        onClick={() => {
                                                            audioRef.current.currentTime = line.time;
                                                        }}
                                                    >
                                                        {line.text}
                                                    </p>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-xl leading-loose text-white/80 whitespace-pre-wrap font-medium pb-20">
                                                {plainLyrics}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                {/* Mobile Lyrics */}
                                <div className="lg:hidden w-full bg-white/5 rounded-3xl p-6 border border-white/10 mt-4 text-center">
                                    <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4">Lyrics</h3>
                                    {lyricsLoading ? (
                                        <div className="flex items-center justify-center h-20">
                                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                                        </div>
                                    ) : hasSyncedLyrics ? (
                                        <div className="space-y-4 max-h-60 overflow-y-auto custom-scrollbar">
                                            {lyricsData.map((line, i) => (
                                                <p
                                                    key={i}
                                                    ref={i === activeLyricIndex ? activeLyricRef : null}
                                                    className={`transition-all duration-300 ${i === activeLyricIndex ? 'text-white font-bold scale-105' : 'text-white/40'}`}
                                                >
                                                    {line.text}
                                                </p>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-lg leading-relaxed text-white/80 whitespace-pre-wrap font-medium">
                                            {plainLyrics}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* MAIN VIEW */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-32">
                <div className="flex items-center gap-8 mb-8">
                    <button
                        onClick={() => setMode('library')}
                        className={`text-3xl font-bold transition-all ${mode === 'library' ? 'text-white' : 'text-white/30 hover:text-white/60'}`}
                    >
                        My Library <span className="text-sm align-middle bg-white/10 px-2 py-1 rounded-full ml-2">{library.length}</span>
                    </button>
                    <button
                        onClick={() => setMode('search')}
                        className={`text-3xl font-bold transition-all ${mode === 'search' ? 'text-white' : 'text-white/30 hover:text-white/60'}`}
                    >
                        Search
                    </button>
                </div>

                <form onSubmit={searchiTunes} className="mb-12 relative flex gap-4 z-50">
                    <div className="relative flex-1">
                        <input
                            autoFocus
                            value={inputValue}
                            onChange={e => setInputValue(e.target.value)}
                            placeholder="Search songs on iTunes..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 pl-12 focus:border-red-500 outline-none transition-colors text-white"
                        />
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                    </div>
                    <button disabled={loading} className="bg-red-600 hover:bg-red-700 text-white px-8 rounded-xl font-bold flex items-center gap-2 transition-colors">
                        {loading ? 'Searching...' : 'Search'}
                    </button>
                </form>

                <div className="space-y-2">
                    {(mode === 'search' ? searchResults : library).map((item, i) => {
                        const isSearch = mode === 'search';
                        const title = isSearch ? item.trackName : item.title;
                        const artist = isSearch ? item.artistName : item.artist;
                        const cover = isSearch ? item.artworkUrl100 : item.cover_url;
                        const uid = isSearch ? item.trackId : item.id;
                        const isCurrent = currentTrack?.track_id === (item.trackId || item.track_id)?.toString();

                        return (
                            <div
                                key={uid}
                                onClick={() => isSearch ? playFromSearch(item) : playTrack(item, library)}
                                className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/5 cursor-pointer group transition-all border border-transparent hover:border-white/5 relative"
                            >
                                <span className="text-white/20 w-8 font-mono text-center">{i + 1}</span>
                                <div className="relative w-12 h-12 shrink-0">
                                    <img src={cover} className={`w-full h-full rounded-lg object-cover ${isCurrent ? 'opacity-50' : ''}`} />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        {isCurrent ? <FaPlay className="text-red-500 text-sm" /> : (
                                            isSearch ? <FaPlay className="text-white opacity-0 group-hover:opacity-100" /> : <FaMusic className="text-white opacity-0 group-hover:opacity-100" />
                                        )}
                                    </div>
                                </div>
                                <div className="flex-1 pr-12">
                                    <h4 className={`font-bold text-lg ${isCurrent ? 'text-red-500' : 'text-white'}`}>{title}</h4>
                                    <p className="text-sm text-white/50">{artist}</p>
                                </div>

                                <div className="flex items-center gap-2 relative z-20">
                                    {isSearch && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                e.preventDefault();

                                                const trackIdToCheck = item.trackId.toString();
                                                const isSaved = library.some(libItem => libItem.track_id === trackIdToCheck);
                                                if (isSaved) return;

                                                // Construct track object for save
                                                const trackToSave = {
                                                    title: item.trackName,
                                                    artist: item.artistName,
                                                    album: item.collectionName || 'Single',
                                                    cover_url: item.artworkUrl100.replace('100x100bb', '500x500bb'),
                                                    track_id: item.trackId.toString(),
                                                    preview_url: item.previewUrl || ''
                                                };
                                                saveToLibrary(trackToSave);
                                            }}
                                            className={`p-3 rounded-full transition-all ${library.some(libItem => libItem.track_id === (item.trackId || item.track_id)?.toString())
                                                ? 'text-red-500 opacity-100'
                                                : 'text-white/20 hover:text-white hover:bg-white/10 opacity-0 group-hover:opacity-100'
                                                }`}
                                        >
                                            <FaHeart />
                                        </button>
                                    )}

                                    {!isSearch && (
                                        <button
                                            onClick={(e) => deleteSong(item.id, e)}
                                            className="p-3 text-white/20 hover:text-red-500 hover:bg-white/5 rounded-full transition-all opacity-0 group-hover:opacity-100"
                                        >
                                            <FaTrash />
                                        </button>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
                {library.length === 0 && mode === 'library' && (
                    <div className="text-center py-20 text-white/20 border-2 border-dashed border-white/5 rounded-3xl mt-8">
                        <FaMusic className="text-6xl mx-auto mb-4 opacity-50" />
                        <p>No songs yet. Use Search to find and add music!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MusicPage;
