import { motion, AnimatePresence } from 'framer-motion';
import {
    RiSearch2Line, RiCodeSSlashLine, RiHtml5Fill, RiCss3Fill, RiJavascriptFill,
    RiReactjsLine, RiFlashlightFill, RiArrowDownSLine, RiArrowUpSLine,
    RiGraduationCapLine, RiBriefcase4Line, RiUser3Line, RiShuffleLine,
    RiCloseLine, RiGlobalLine, RiServerLine, RiSmartphoneLine,
    RiArrowLeftSLine, RiArrowRightSLine, RiCheckboxCircleFill,
    RiBookOpenLine, RiGitBranchLine, RiLightbulbLine, RiDatabase2Line,
    RiCloudLine, RiSettings4Line, RiShieldKeyholeLine, RiCheckDoubleLine,
    RiStarFill, RiStarLine, RiDownload2Line, RiKeyboardBoxLine,
    RiMindMap, RiCommandLine
} from 'react-icons/ri';
import { HiOutlineLightningBolt, HiOutlineSparkles, HiOutlineCubeTransparent } from 'react-icons/hi';
import { SiDotnet, SiRedis, SiDocker, SiDiagramsdotnet } from 'react-icons/si';
import { supabase } from '../../lib/supabaseClient';
import { useState, useEffect, useMemo, memo } from 'react';

const categoryIcons = {
    HTML: <RiHtml5Fill className="text-orange-500" />,
    CSS: <RiCss3Fill className="text-blue-500" />,
    JavaScript: <RiJavascriptFill className="text-yellow-400" />,
    React: <RiReactjsLine className="text-cyan-400" />,
    General: <RiFlashlightFill className="text-purple-500" />,
    Git: <RiGitBranchLine className="text-orange-400" />,
    Mindset: <RiLightbulbLine className="text-amber-400" />,
    Performance: <HiOutlineLightningBolt className="text-purple-400" />,
    Architecture: <RiCodeSSlashLine className="text-emerald-400" />,
    'ASP.NET Core': <SiDotnet className="text-purple-500" />,
    'C#': <RiCommandLine className="text-indigo-400" />,
    'Entity Framework': <RiDatabase2Line className="text-sky-500" />,
    'SQL Server': <RiDatabase2Line className="text-red-500" />,
    Redis: <SiRedis className="text-red-600" />,
    Docker: <SiDocker className="text-blue-500" />,
    'System Design': <SiDiagramsdotnet className="text-indigo-500" />,
    Database: <RiDatabase2Line className="text-blue-400" />,
    DevOps: <RiSettings4Line className="text-slate-400" />,
    Security: <RiShieldKeyholeLine className="text-red-400" />
};

const HighlightText = memo(({ text, highlight }) => {
    if (!highlight.trim()) return <span>{text}</span>;
    const regex = new RegExp(`(${highlight})`, 'gi');
    const parts = text.split(regex);
    return (
        <span>
            {parts.map((part, i) =>
                regex.test(part) ? (
                    <mark key={i} className="bg-indigo-500/30 text-indigo-200 rounded px-1 transition-colors">
                        {part}
                    </mark>
                ) : (
                    <span key={i}>{part}</span>
                )
            )}
        </span>
    );
});

const domainIcons = {
    Frontend: <RiSmartphoneLine className="text-blue-400" />,
    Backend: <RiServerLine className="text-purple-400" />,
    Mobile: <RiSmartphoneLine className="text-pink-400" />,
    All: <RiGlobalLine className="text-slate-400" />
};

const CodeBlock = ({ code }) => {
    const [copied, setCopied] = useState(false);
    const copyToClipboard = (e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative group my-6 font-jakarta">
            <div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-all duration-500 scale-90 group-hover:scale-100">
                <button
                    onClick={copyToClipboard}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-extrabold text-white flex items-center gap-2 backdrop-blur-xl border border-white/10 uppercase tracking-widest transition-all"
                >
                    {copied ? <><RiCheckboxCircleFill className="text-emerald-400 text-sm" /> Pulled!</> : <><RiCommandLine className="text-sm" /> Copy Code</>}
                </button>
            </div>
            <div className="rounded-[1.5rem] bg-black/60 p-8 font-mono text-sm overflow-x-auto border border-white/5 text-emerald-300 shadow-inner custom-scrollbar relative">
                <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500/20" />
                <pre><code className="block leading-relaxed">{code}</code></pre>
            </div>
        </div>
    );
};

const Timer = ({ duration = 120, onExpire }) => {
    const [timeLeft, setTimeLeft] = useState(duration);
    const [isActive, setIsActive] = useState(true);

    useEffect(() => {
        let interval = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            clearInterval(interval);
            if (onExpire) onExpire();
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft, onExpire]);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const progress = (timeLeft / duration) * 100;

    return (
        <div className="flex flex-col items-center gap-4 p-6 bg-slate-950/60 rounded-[2rem] border border-white/10 min-w-[160px] font-jakarta shadow-2xl backdrop-blur-3xl">
            <div className="relative w-20 h-20">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <circle className="text-white/5" strokeWidth="2.5" stroke="currentColor" fill="transparent" r="16" cx="18" cy="18" />
                    <motion.circle
                        className={timeLeft < 30 ? 'text-red-500' : 'text-indigo-400'}
                        strokeWidth="2.5"
                        strokeDasharray="100"
                        animate={{ strokeDashoffset: 100 - progress }}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="16"
                        cx="18"
                        cy="18"
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center font-mono text-lg font-extrabold text-white tracking-tighter">
                    {minutes}:{seconds.toString().padStart(2, '0')}
                </div>
            </div>
            <button
                onClick={() => setIsActive(!isActive)}
                className="text-[9px] uppercase font-extrabold tracking-[0.3em] text-slate-500 hover:text-indigo-400 transition-colors flex items-center gap-2"
            >
                <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-700'}`} />
                {isActive ? 'Live Session' : 'Paused Sync'}
            </button>
        </div>
    );
};

const Flashcard = ({ item, isRead, onToggleRead, isStarred, onToggleStar, searchTerm }) => {
    const [isFlipped, setIsFlipped] = useState(false);

    const renderContent = (content) => {
        if (!content) return null;
        const parts = content.split('```');
        return parts.map((part, i) => {
            if (i % 2 === 1) return <CodeBlock key={i} code={part.trim()} />;
            return <p key={i} className="whitespace-pre-line leading-relaxed font-jakarta font-medium opacity-90">
                <HighlightText text={part} highlight={searchTerm} />
            </p>;
        });
    };

    return (
        <div className="perspective-1000 w-full h-[580px] cursor-pointer group font-jakarta" onClick={() => setIsFlipped(!isFlipped)}>
            <motion.div
                className="relative w-full h-full transition-all duration-1000 preserve-3d"
                animate={{ rotateY: isFlipped ? 180 : 0 }}
            >
                {/* Front Side */}
                <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-slate-900/95 via-slate-950 to-black border-2 border-white/5 rounded-[3rem] p-12 flex flex-col items-center justify-center text-center shadow-[0_30px_100px_rgba(0,0,0,0.5)] overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(79,70,229,0.15),transparent_70%)]" />
                    <div className="mb-10 relative">
                        <div className="absolute inset-0 bg-indigo-500/30 blur-3xl rounded-full animate-pulse" />
                        <div className="relative p-7 bg-indigo-500/10 rounded-[2rem] text-6xl text-indigo-400 border border-indigo-500/20 shadow-2xl backdrop-blur-sm">
                            {categoryIcons[item.category] || <RiCodeSSlashLine />}
                        </div>
                    </div>
                    <div className="flex items-center gap-3 mb-8">
                        <span className="text-[10px] font-extrabold text-indigo-400 uppercase tracking-[0.3em] px-5 py-2 bg-indigo-500/10 rounded-full border border-indigo-500/20">
                            {item.category}
                        </span>
                        <span className="text-[10px] font-extrabold text-purple-400 uppercase tracking-[0.3em] px-5 py-2 bg-purple-500/10 rounded-full border border-purple-500/20">
                            {item.level}
                        </span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-white leading-[1.15] tracking-tight px-6 group-hover:scale-105 transition-all duration-700">
                        <HighlightText text={item.question} highlight={searchTerm} />
                    </h2>
                    <div className="mt-20 flex flex-col items-center gap-4">
                        <div className="text-slate-500 text-[10px] font-extrabold uppercase tracking-[0.4em] flex items-center gap-3 opacity-60 group-hover:opacity-100 transition-opacity">
                            <span>Analysis required</span>
                            <RiArrowRightSLine className="text-lg animate-bounce-x" />
                        </div>
                        <div className="w-20 h-[2px] bg-slate-800 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-indigo-500"
                                animate={{ x: [-80, 80] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            />
                        </div>
                    </div>
                </div>

                {/* Back Side */}
                <div className="absolute inset-0 backface-hidden bg-slate-950/95 backdrop-blur-3xl border-2 border-indigo-500/30 rounded-[3rem] p-12 flex flex-col shadow-2xl overflow-hidden" style={{ transform: 'rotateY(180deg)' }}>
                    <div className="flex items-center justify-between mb-10 border-b border-white/5 pb-8">
                        <div className="flex items-center gap-4">
                            <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)] animate-pulse" />
                            <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-[0.3em]">Master Protocol Analysis</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={(e) => { e.stopPropagation(); onToggleStar(item.id); }}
                                className={`p-3 rounded-2xl transition-all duration-500 ${isStarred ? 'bg-amber-500/10 text-amber-400 shadow-lg scale-110' : 'bg-white/5 text-slate-600 hover:text-slate-400'}`}
                            >
                                {isStarred ? <RiStarFill className="text-2xl" /> : <RiStarLine className="text-2xl" />}
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); onToggleRead(item.id); }}
                                className={`p-3 rounded-2xl transition-all duration-500 ${isRead ? 'bg-emerald-500/10 text-emerald-500 shadow-lg scale-110' : 'bg-white/5 text-slate-600 hover:text-slate-400'}`}
                            >
                                <RiCheckboxCircleFill className="text-2xl" />
                            </button>
                        </div>
                    </div>
                    <div className="text-slate-300 text-lg leading-relaxed font-jakarta overflow-y-auto custom-scrollbar pr-6 font-medium">
                        {renderContent(item.answer)}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

const QuestionCard = memo(({ item, isRead, onToggleRead, isStarred, onToggleStar, searchTerm, highlight = false, alwaysOpen = false }) => {
    const [isOpen, setIsOpen] = useState(highlight || alwaysOpen);

    const renderContent = (content) => {
        if (!content) return null;
        const parts = content.split('```');
        return parts.map((part, i) => {
            if (i % 2 === 1) return <CodeBlock key={i} code={part.trim()} />;
            return <p key={i} className="whitespace-pre-line leading-relaxed font-jakarta font-medium opacity-90">
                <HighlightText text={part} highlight={searchTerm} />
            </p>;
        });
    };

    return (
        <motion.div
            initial={highlight ? { opacity: 1, scale: 1 } : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className={`mb-5 overflow-hidden border rounded-3xl backdrop-blur-xl transition-all duration-500 font-jakarta group ${highlight
                ? 'border-indigo-500/50 bg-indigo-500/10 shadow-[0_20px_50px_rgba(99,102,241,0.15)] ring-1 ring-indigo-500/20'
                : 'border-white/5 bg-slate-900/40 hover:bg-slate-900/60 hover:border-white/10'
                }`}
        >
            <div className="flex items-center">
                <button
                    onClick={() => !alwaysOpen && setIsOpen(!isOpen)}
                    className="flex-1 px-8 py-6 flex items-center justify-between text-left gap-6"
                >
                    <div className="flex items-center gap-6">
                        <div className="p-3 bg-white/5 rounded-2xl text-2xl shrink-0 group-hover:scale-110 group-hover:bg-indigo-500/10 transition-all duration-500">
                            {categoryIcons[item.category] || <RiCodeSSlashLine />}
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-[9px] font-extrabold uppercase tracking-[0.25em] text-indigo-400 px-3 py-1 bg-indigo-500/5 rounded-full border border-indigo-500/10">
                                    {item.category}
                                </span>
                                <span className={`px-3 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-[0.2em] border ${item.level === 'Senior' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                                    item.level === 'Middle' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                                        item.level === 'Junior' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                            'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                    }`}>
                                    {item.level}
                                </span>
                                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em] px-3 py-1 bg-white/5 rounded-full border border-white/5">
                                    {item.domain}
                                </span>
                            </div>
                            <h3 className={`text-xl font-bold tracking-tight ${highlight ? 'text-white' : 'text-slate-200 group-hover:text-white'} transition-colors duration-500`}>
                                <HighlightText text={item.question} highlight={searchTerm} />
                            </h3>
                        </div>
                    </div>
                    {!alwaysOpen && (
                        <div className={`text-2xl transition-transform duration-500 ${isOpen ? 'rotate-180 text-indigo-400' : 'text-slate-600'}`}>
                            <RiArrowDownSLine />
                        </div>
                    )}
                </button>
                <div className="px-8 flex items-center gap-4">
                    <button
                        onClick={(e) => { e.stopPropagation(); onToggleStar(item.id); }}
                        className={`text-2xl transition-all duration-500 hover:scale-125 ${isStarred ? 'text-amber-400 drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 'text-slate-700 hover:text-slate-500'}`}
                        title={isStarred ? "Bỏ đánh dấu" : "Đánh dấu câu hỏi này"}
                    >
                        {isStarred ? <RiStarFill /> : <RiStarLine />}
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onToggleRead(item.id); }}
                        className={`text-2xl transition-all duration-500 hover:scale-125 ${isRead ? 'text-emerald-500 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'text-slate-700 hover:text-slate-500'}`}
                        title={isRead ? "Đã thành thạo" : "Đánh dấu đã học"}
                    >
                        {isRead ? <RiCheckboxCircleFill /> : <RiCheckboxCircleFill className="opacity-20" />}
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.5, ease: "circOut" }}
                    >
                        <div className="px-8 pb-8 pt-2 ml-16 mr-8 border-t border-white/5">
                            <div className="bg-white/5 rounded-3xl p-8 text-slate-300 text-lg leading-relaxed font-jakarta overflow-hidden">
                                {renderContent(item.answer)}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
});

const QuestionList = memo(({ data, readIds, toggleRead, starredIds, toggleStar, searchTerm }) => {
    if (data.length === 0) {
        return (
            <div className="text-center py-40 bg-slate-900/20 rounded-[3rem] border border-dashed border-white/5 backdrop-blur-sm">
                <div className="text-4xl text-slate-800 mb-4 tracking-tighter font-black uppercase opacity-20">No Data Synchronized</div>
            </div>
        );
    }
    return (
        <div className="grid gap-3">
            <AnimatePresence mode="popLayout">
                {data.map((item) => (
                    <QuestionCard
                        key={item.id}
                        item={item}
                        isRead={readIds.includes(item.id)}
                        onToggleRead={toggleRead}
                        isStarred={starredIds.includes(item.id)}
                        onToggleStar={toggleStar}
                        searchTerm={searchTerm}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
});

const DecorativeBackground = memo(() => (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '3s' }} />
        <div className="absolute top-[20%] right-[10%] w-[15%] h-[15%] bg-cyan-500/5 rounded-full blur-[80px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] contrast-150" />
    </div>
));

const StatsWidget = memo(({ currentDataSet, readIds, starredIds }) => {
    const stats = [
        { label: 'Total Challenges', value: currentDataSet.length, icon: <RiGlobalLine />, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
        { label: 'Mastered', value: currentDataSet.filter(item => readIds.includes(item.id)).length, icon: <RiCheckboxCircleFill />, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
        { label: 'Starred', value: currentDataSet.filter(item => starredIds.includes(item.id)).length, icon: <RiStarFill />, color: 'text-amber-400', bg: 'bg-amber-500/10' },
        { label: 'Learning Velocity', value: 'High', icon: <RiFlashlightFill />, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16 font-jakarta">
            {stats.map((stat, i) => (
                <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.8 }}
                    className="bg-slate-950/40 p-6 rounded-[2.5rem] border border-white/5 backdrop-blur-3xl flex items-center gap-6 group hover:border-indigo-500/20 hover:bg-slate-950/60 transition-all duration-700 shadow-2xl"
                >
                    <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} text-2xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-inner`}>
                        {stat.icon}
                    </div>
                    <div>
                        <div className="text-[9px] font-extrabold text-slate-500 uppercase tracking-[0.3em] mb-1">{stat.label}</div>
                        <div className={`text-2xl font-extrabold tracking-tighter ${stat.color}`}>{stat.value}</div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
});

const LearnPage = () => {
    const [activeTab, setActiveTab] = useState('general');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedLevel, setSelectedLevel] = useState('All');
    const [selectedDomain, setSelectedDomain] = useState('All');
    const [showUnreadOnly, setShowUnreadOnly] = useState(false);

    const [isStudyMode, setIsStudyMode] = useState(false);
    const [readIds, setReadIds] = useState(() => {
        const saved = localStorage.getItem('learn_read_ids');
        return saved ? JSON.parse(saved) : [];
    });
    const [starredIds, setStarredIds] = useState(() => {
        const saved = localStorage.getItem('learn_starred_ids');
        return saved ? JSON.parse(saved) : [];
    });
    const [showStarredOnly, setShowStarredOnly] = useState(false);
    const [randomQuestion, setRandomQuestion] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [dbQuestions, setDbQuestions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const { data, error } = await supabase
                    .from('interview_questions')
                    .select('*');
                if (error) throw error;
                if (data && data.length > 0) setDbQuestions(data);
            } catch (err) {
                console.error("Supabase fetch failed:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchQuestions();
    }, []);

    const currentDataSet = useMemo(() => {
        if (dbQuestions.length > 0) {
            const source = activeTab === 'general' ? 'general' : 'jd';
            return dbQuestions.filter(q => q.source === source);
        }
        return [];
    }, [dbQuestions, activeTab]);

    const categories = ['All', ...new Set(currentDataSet.map(item => item.category))];
    const levels = ['All', 'Fresher', 'Junior', 'Middle', 'Senior'];
    const domains = ['All', 'Frontend', 'Backend', 'Mobile'];

    const toggleRead = (id) => {
        setReadIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const toggleStar = (id) => {
        setStarredIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const [debouncedSearch, setDebouncedSearch] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const filteredData = useMemo(() => {
        const lowerSearch = debouncedSearch.toLowerCase();
        return currentDataSet.filter(item => {
            const matchesSearch = !debouncedSearch ||
                item.question.toLowerCase().includes(lowerSearch) ||
                item.answer.toLowerCase().includes(lowerSearch);
            const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
            const matchesLevel = selectedLevel === 'All' || item.level === selectedLevel;
            const matchesDomain = selectedDomain === 'All' || item.domain === selectedDomain;
            const matchesReadMode = !showUnreadOnly || !readIds.includes(item.id);
            const matchesStarred = !showStarredOnly || starredIds.includes(item.id);

            return matchesSearch && matchesCategory && matchesLevel && matchesDomain && matchesReadMode && matchesStarred;
        });
    }, [currentDataSet, debouncedSearch, selectedCategory, selectedLevel, selectedDomain, showUnreadOnly, showStarredOnly, readIds, starredIds]);

    useEffect(() => {
        localStorage.setItem('learn_read_ids', JSON.stringify(readIds));
    }, [readIds]);

    useEffect(() => {
        localStorage.setItem('learn_starred_ids', JSON.stringify(starredIds));
    }, [starredIds]);

    // Keyboard Shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!isStudyMode) return;

            switch (e.key) {
                case 'ArrowRight':
                    if (currentIndex < filteredData.length - 1) setCurrentIndex(prev => prev + 1);
                    break;
                case 'ArrowLeft':
                    if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
                    break;
                case ' ': // Space to flip
                    e.preventDefault();
                    const card = document.querySelector('.perspective-1000');
                    if (card) card.click();
                    break;
                case 'Enter':
                    if (filteredData[currentIndex] && !readIds.includes(filteredData[currentIndex].id)) {
                        toggleRead(filteredData[currentIndex].id);
                    }
                    break;
                case 's':
                case 'S':
                    if (filteredData[currentIndex]) {
                        toggleStar(filteredData[currentIndex].id);
                    }
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isStudyMode, currentIndex, filteredData, readIds, starredIds]);

    const exportToMarkdown = () => {
        const content = filteredData.map(item => (
            `# ${item.question}\n\n**Category:** ${item.category} | **Level:** ${item.level}\n\n## Answer\n${item.answer.replace(/```/g, '\n```')}\n\n---\n`
        )).join('\n');

        const blob = new Blob([content], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Interview_CheatSheet_${activeTab}_${new Date().toLocaleDateString()}.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleRandomize = () => {
        if (filteredData.length === 0) return;
        const randomIndex = Math.floor(Math.random() * filteredData.length);
        setRandomQuestion(filteredData[randomIndex]);
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setSelectedCategory('All');
        setSelectedLevel('All');
        setSelectedDomain('All');
        setSearchTerm('');
        setRandomQuestion(null);
        setCurrentIndex(0);
    };

    const masteredCount = readIds.filter(id => currentDataSet.some(item => item.id === id)).length;
    const progress = currentDataSet.length > 0 ? (masteredCount / currentDataSet.length) * 100 : 0;

    return (
        <div className="pt-32 pb-24 px-6 min-h-screen max-w-[1400px] mx-auto font-jakarta">
            <DecorativeBackground />

            {/* Custom scrollbar style */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@200;300;400;500;600;700;800&display=swap');
                
                .font-jakarta { font-family: 'Plus Jakarta Sans', sans-serif; }
                .perspective-1000 { perspective: 1000px; }
                .preserve-3d { transform-style: preserve-3d; }
                .backface-hidden { backface-visibility: hidden; }
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 20px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.2); }
                @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .animate-spin-slow { animation: spin-slow 12s linear infinite; }
                
                .gradient-heading {
                    background: linear-gradient(135deg, #fff 0%, #a5b4fc 50%, #6366f1 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
            `}</style>

            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-16 relative font-jakarta"
            >
                <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[11px] font-extrabold uppercase tracking-[0.25em] mb-8 shadow-[0_0_30px_rgba(99,102,241,0.15)] backdrop-blur-md">
                    <HiOutlineSparkles className="text-lg animate-pulse" /> The Modern Syllabus
                </div>
                <h1 className="text-6xl md:text-8xl font-extrabold mb-8 tracking-tighter leading-[0.9] gradient-heading">
                    Interview<br /><span className="text-indigo-500">Mastery.</span>
                </h1>

                <p className="max-w-2xl mx-auto text-slate-400 text-lg mb-12 font-medium">
                    Một lộ trình chuẩn hóa giúp bạn chinh phục mọi thử thách phỏng vấn
                    từ <span className="text-indigo-400 font-bold underline decoration-indigo-500/30">Fresher</span> đến <span className="text-purple-400 font-bold underline decoration-purple-500/30">Middle+</span>
                </p>

                {/* Global Progress Bar Enhanced */}
                <div className="max-w-xl mx-auto bg-slate-900/40 p-1.5 rounded-full border border-white/5 shadow-inner relative overflow-hidden group">
                    <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <div className="h-4 w-full bg-black/40 rounded-full overflow-hidden border border-white/5 relative">
                        <motion.div
                            className="h-full bg-gradient-to-r from-indigo-600 via-purple-500 to-indigo-600 bg-[length:200%_100%] shadow-[0_0_15px_rgba(99,102,241,0.4)]"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%`, backgroundPosition: ['0% 0%', '100% 0%'] }}
                            transition={{ width: { duration: 1.5, ease: "circOut" }, backgroundPosition: { duration: 3, repeat: Infinity, ease: "linear" } }}
                        />
                    </div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[9px] font-black uppercase tracking-[0.3em] text-white/40 group-hover:text-white/80 transition-colors pointer-events-none">
                        Mastery Level
                    </div>
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-indigo-400">
                        {Math.round(progress)}% Complete
                    </div>
                </div>
            </motion.div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-40 gap-8">
                    <div className="relative w-24 h-24">
                        <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full" />
                        <div className="absolute inset-0 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                        <div className="absolute inset-4 border-4 border-purple-500/20 rounded-full" />
                        <div className="absolute inset-4 border-4 border-purple-500 border-b-transparent rounded-full animate-spin-slow" />
                    </div>
                    <div className="text-center">
                        <h2 className="text-2xl font-black text-white mb-2 tracking-tight">Synchronizing Protocol...</h2>
                        <p className="text-slate-500 text-sm font-medium">Fetching high-level knowledge from the cloud</p>
                    </div>
                </div>
            ) : (
                <>
                    {/* Mode Switcher Enhanced */}
                    <div className="flex flex-col md:flex-row justify-center items-center gap-6 mb-16 relative z-10">
                        <div className="bg-slate-950/40 p-2 rounded-[2.5rem] border border-white/10 flex gap-2 backdrop-blur-3xl shadow-2xl relative font-jakarta">
                            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-transparent rounded-[2.5rem] pointer-events-none" />
                            {[
                                { id: 'general', label: 'General Knowledge', icon: <RiGraduationCapLine /> },
                                { id: 'jd', label: 'JD Specialized', icon: <RiBriefcase4Line /> }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => handleTabChange(tab.id)}
                                    className={`relative flex items-center gap-3 px-10 py-5 rounded-[2rem] text-[11px] font-extrabold transition-all duration-700 uppercase tracking-widest overflow-hidden group/btn ${activeTab === tab.id
                                        ? 'bg-indigo-600 text-white shadow-[0_15px_40px_rgba(79,70,229,0.4)]'
                                        : 'text-slate-500 hover:text-slate-300'}`}
                                >
                                    {activeTab === tab.id && (
                                        <motion.div layoutId="tab-bg" className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-indigo-500" />
                                    )}
                                    <span className="relative z-10 flex items-center gap-3 group-hover/btn:scale-105 transition-transform duration-500">
                                        <span className={`text-lg ${activeTab === tab.id ? 'text-white' : 'text-slate-400'}`}>{tab.icon}</span>
                                        {tab.label}
                                    </span>
                                </button>
                            ))}
                        </div>

                        <div className="bg-slate-950/40 p-2 rounded-[2.5rem] border border-white/10 flex gap-2 backdrop-blur-3xl shadow-2xl font-jakarta">
                            {[
                                { id: false, label: 'Library View', icon: <RiBookOpenLine /> },
                                { id: true, label: 'Master Engine', icon: <HiOutlineSparkles /> }
                            ].map(mode => (
                                <button
                                    key={String(mode.id)}
                                    onClick={() => { setIsStudyMode(mode.id); setCurrentIndex(0); }}
                                    className={`relative px-10 py-5 rounded-[2rem] text-[11px] font-extrabold transition-all duration-700 uppercase tracking-widest overflow-hidden group/mode ${isStudyMode === mode.id
                                        ? 'text-white'
                                        : 'text-slate-500 hover:text-slate-300'}`}
                                >
                                    {isStudyMode === mode.id && (
                                        <motion.div layoutId="mode-bg" className="absolute inset-0 bg-slate-800 shadow-inner" />
                                    )}
                                    <span className="relative z-10 flex items-center gap-3 group-hover/mode:scale-105 transition-transform duration-500">
                                        <span className={`text-lg ${isStudyMode === mode.id ? 'text-indigo-400' : 'text-slate-400'}`}>{mode.icon}</span>
                                        {mode.label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <StatsWidget
                        currentDataSet={currentDataSet}
                        readIds={readIds}
                        starredIds={starredIds}
                    />

                    {
                        isStudyMode ? (
                            <div className="space-y-12 mb-20">
                                {filteredData.length > 0 ? (
                                    <div className="relative max-w-5xl mx-auto">
                                        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6 bg-slate-900/40 p-6 rounded-[2.5rem] border border-white/10 backdrop-blur-xl">
                                            <div className="flex items-center gap-6">
                                                <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-3xl text-indigo-400 border border-indigo-500/20">
                                                    <FaBolt />
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">Session Analytics</div>
                                                    <div className="text-3xl font-black text-white leading-none">
                                                        {currentIndex + 1} <span className="text-slate-600 text-xl font-medium">/ {filteredData.length}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <Timer key={currentIndex} duration={120} />
                                        </div>

                                        <AnimatePresence mode="wait">
                                            <motion.div
                                                key={currentIndex}
                                                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.95, y: -30 }}
                                                transition={{ type: 'spring', damping: 25, stiffness: 120 }}
                                            >
                                                <Flashcard
                                                    item={filteredData[currentIndex]}
                                                    isRead={readIds.includes(filteredData[currentIndex].id)}
                                                    onToggleRead={toggleRead}
                                                    isStarred={starredIds.includes(filteredData[currentIndex].id)}
                                                    onToggleStar={toggleStar}
                                                    searchTerm={debouncedSearch}
                                                />
                                            </motion.div>
                                        </AnimatePresence>

                                        <div className="flex items-center justify-between mt-16 gap-6 max-w-2xl mx-auto">
                                            <button
                                                disabled={currentIndex === 0}
                                                onClick={() => setCurrentIndex(prev => prev - 1)}
                                                className="group flex items-center justify-center gap-3 px-10 py-6 bg-slate-900 hover:bg-slate-800 disabled:opacity-20 disabled:cursor-not-allowed rounded-[2rem] text-slate-300 font-black text-xs uppercase tracking-widest transition-all border border-white/5 active:scale-95"
                                            >
                                                <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back
                                            </button>

                                            <button
                                                onClick={() => {
                                                    if (!readIds.includes(filteredData[currentIndex].id)) toggleRead(filteredData[currentIndex].id);
                                                    if (currentIndex < filteredData.length - 1) {
                                                        setCurrentIndex(prev => prev + 1);
                                                    } else {
                                                        setIsStudyMode(false);
                                                    }
                                                }}
                                                className="flex-1 flex items-center justify-center gap-4 px-10 py-6 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 rounded-[2rem] text-white font-black text-xs uppercase tracking-[0.2em] transition-all shadow-[0_20px_40px_rgba(79,70,229,0.3)] active:scale-[0.98]"
                                            >
                                                {currentIndex === filteredData.length - 1 ? 'Complete Protocol' : 'Next Transmission'} <FaArrowRight className="animate-pulse" />
                                            </button>
                                        </div>

                                        <div className="mt-12 flex justify-center">
                                            <div className="flex items-center gap-6 text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-900/60 px-8 py-4 rounded-3xl border border-white/10 backdrop-blur-2xl shadow-2xl">
                                                <div className="flex items-center gap-2 text-indigo-400">
                                                    <FaKeyboard className="text-lg" />
                                                    <span>Neural Interface Activation:</span>
                                                </div>
                                                <div className="flex gap-6 h-4 items-center">
                                                    <span className="flex items-center gap-2"><kbd className="bg-slate-800 px-2 py-1 rounded border border-white/10 text-white min-w-[30px] text-center">Space</kbd> Flip</span>
                                                    <div className="w-px h-full bg-white/10" />
                                                    <span className="flex items-center gap-2"><kbd className="bg-slate-800 px-2 py-1 rounded border border-white/10 text-white min-w-[30px] text-center">Enter</kbd> Master</span>
                                                    <div className="w-px h-full bg-white/10" />
                                                    <span className="flex items-center gap-2"><kbd className="bg-slate-800 px-2 py-1 rounded border border-white/10 text-white min-w-[30px] text-center">S</kbd> Star</span>
                                                    <div className="w-px h-full bg-white/10" />
                                                    <span className="flex items-center gap-2"><kbd className="bg-slate-800 px-2 py-1 rounded border border-white/10 text-white min-w-[30px] text-center">←→</kbd> Navigate</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-32 bg-slate-900/40 rounded-[3rem] border border-white/10 backdrop-blur-xl">
                                        <div className="text-6xl text-slate-700 mb-6 flex justify-center"><FaSearch /></div>
                                        <h3 className="text-2xl font-black text-white mb-2">Sector Quiet.</h3>
                                        <p className="text-slate-500 uppercase text-[10px] font-black tracking-widest">No matching challenges in this frequency.</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-16 font-jakarta">
                                {/* Controls Enhanced */}
                                <div className="bg-slate-950/40 p-12 rounded-[3.5rem] border border-white/10 space-y-14 backdrop-blur-3xl shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 blur-[120px] -mr-64 -mt-64 pointer-events-none" />
                                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/5 blur-[100px] -ml-48 -mb-48 pointer-events-none" />

                                    <div className="flex flex-col lg:flex-row gap-8 relative z-10">
                                        <div className="relative flex-1 group/search">
                                            <RiSearch2Line className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/search:text-indigo-400 group-focus-within/search:scale-110 transition-all duration-500 text-2xl" />
                                            <input
                                                type="text"
                                                placeholder="Scouring the mainframe for specific signals..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="w-full bg-slate-950/80 border border-white/10 rounded-[2.5rem] py-8 pl-20 pr-10 text-white focus:outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 transition-all font-jakarta text-xl placeholder:text-slate-700 shadow-inner"
                                            />
                                        </div>
                                        <div className="flex flex-wrap gap-4">
                                            <button
                                                onClick={() => setShowUnreadOnly(!showUnreadOnly)}
                                                className={`flex items-center gap-4 px-10 py-6 rounded-[2rem] text-[11px] font-extrabold uppercase tracking-[0.25em] transition-all duration-500 border-2 ${showUnreadOnly
                                                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400 shadow-[0_0_40px_rgba(16,185,129,0.2)]'
                                                    : 'bg-white/5 border-white/5 text-slate-500 hover:text-slate-300 hover:border-white/10'
                                                    }`}
                                            >
                                                <RiCheckboxCircleFill className={`text-xl ${showUnreadOnly ? 'animate-pulse' : ''}`} /> {showUnreadOnly ? 'Target: Unread' : 'Scan Read'}
                                            </button>
                                            <button
                                                onClick={() => setShowStarredOnly(!showStarredOnly)}
                                                className={`flex items-center gap-4 px-10 py-6 rounded-[2rem] text-[11px] font-extrabold uppercase tracking-[0.25em] transition-all duration-500 border-2 ${showStarredOnly
                                                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-400 shadow-[0_0_40px_rgba(245,158,11,0.2)]'
                                                    : 'bg-white/5 border-white/5 text-slate-500 hover:text-slate-300 hover:border-white/10'
                                                    }`}
                                            >
                                                {showStarredOnly ? <RiStarFill className="text-xl animate-pulse" /> : <RiStarLine className="text-xl" />} {showStarredOnly ? 'Targets: Starred' : 'Stars Offline'}
                                            </button>
                                            <button
                                                onClick={exportToMarkdown}
                                                disabled={filteredData.length === 0}
                                                className="flex items-center justify-center gap-4 px-10 py-6 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white font-extrabold text-[11px] uppercase tracking-[0.25em] rounded-[2rem] transition-all border border-white/10 hover:shadow-2xl"
                                            >
                                                <RiDownload2Line className="text-xl" /> Export Protocol
                                            </button>
                                            <button
                                                onClick={handleRandomize}
                                                className="flex items-center justify-center gap-5 px-12 py-6 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-[11px] uppercase tracking-[0.3em] rounded-[2rem] transition-all shadow-[0_20px_60px_rgba(79,70,229,0.4)] active:scale-95 whitespace-nowrap overflow-hidden group/random"
                                            >
                                                <RiShuffleLine className="text-xl group-hover/random:rotate-180 transition-transform duration-700" /> Random Sync
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 pt-16 border-t border-white/5 relative z-10">
                                        {[
                                            { title: 'Core Domains', data: domains, selected: selectedDomain, setter: setSelectedDomain, icons: domainIcons, isLvl: false, span: 'lg:col-span-3' },
                                            { title: 'Difficulty Tier', data: levels, selected: selectedLevel, setter: setSelectedLevel, icons: null, isLvl: true, span: 'lg:col-span-3' },
                                            { title: 'Specific Nodes', data: categories, selected: selectedCategory, setter: setSelectedCategory, icons: null, isLvl: false, isCat: true, span: 'lg:col-span-6' }
                                        ].map((group, idx) => (
                                            <div key={idx} className={`space-y-6 ${group.span}`}>
                                                <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] block px-1">
                                                    {group.title}
                                                </span>
                                                <div className="flex flex-wrap gap-2.5">
                                                    {(group.isCat ? group.data.sort((a, b) => a === 'All' ? -1 : b === 'All' ? 1 : a.localeCompare(b)) : group.data).map(item => {
                                                        const isActive = group.selected === item;
                                                        const count = currentDataSet.filter(q => {
                                                            if (group.isCat) return item === 'All' || q.category === item;
                                                            if (group.isLvl) return item === 'All' || q.level === item;
                                                            return item === 'All' || q.domain === item;
                                                        }).length;

                                                        return (
                                                            <button
                                                                key={item}
                                                                onClick={() => group.setter(item)}
                                                                className={`group flex items-center gap-3 px-4 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all duration-300 ${isActive
                                                                    ? 'bg-white text-slate-950 border-white shadow-xl scale-105'
                                                                    : 'bg-white/5 border-white/5 text-slate-500 hover:bg-white/10 hover:text-slate-300'}`}
                                                            >
                                                                {group.icons?.[item]}
                                                                <span>{item}</span>
                                                                <span className={`text-[9px] font-bold opacity-40 group-hover:opacity-100 ${isActive ? 'text-indigo-600' : ''}`}>
                                                                    [{count}]
                                                                </span>
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {randomQuestion && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9, y: 30 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        className="relative"
                                    >
                                        <div className="absolute -top-4 left-10 px-6 py-2 bg-gradient-to-r from-red-500 to-indigo-600 text-white text-[10px] font-black rounded-full z-10 shadow-2xl tracking-[0.2em]">ANOMALY DETECTED</div>
                                        <button onClick={() => setRandomQuestion(null)} className="absolute top-4 right-4 text-slate-500 hover:text-white z-20 p-3 bg-black/20 rounded-full backdrop-blur-md transition-colors"><FaTimes /></button>
                                        <QuestionCard
                                            item={randomQuestion}
                                            isRead={readIds.includes(randomQuestion.id)}
                                            onToggleRead={toggleRead}
                                            isStarred={starredIds.includes(randomQuestion.id)}
                                            onToggleStar={toggleStar}
                                            searchTerm={debouncedSearch}
                                            highlight={true}
                                        />
                                    </motion.div>
                                )}

                                <div className="space-y-8">
                                    <div className="flex flex-col md:flex-row items-end justify-between mb-4 px-8 gap-6">
                                        <div className="space-y-2">
                                            <h2 className="text-3xl font-black text-white tracking-tighter flex items-center gap-4">
                                                Knowledge Repository
                                                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                                            </h2>
                                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                                                Displaying <span className="text-indigo-400">{filteredData.length}</span> synchronized data nodes
                                            </p>
                                        </div>
                                    </div>

                                    <QuestionList
                                        data={filteredData}
                                        readIds={readIds}
                                        toggleRead={toggleRead}
                                        starredIds={starredIds}
                                        toggleStar={toggleStar}
                                        searchTerm={debouncedSearch}
                                    />
                                </div>
                            </div>
                        )
                    }
                </>
            )}
        </div >
    );
};

export default LearnPage;
