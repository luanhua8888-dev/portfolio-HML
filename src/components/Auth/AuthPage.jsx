import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    RiMailLine, RiLockPasswordLine, RiEyeLine, RiEyeOffLine,
    RiShieldFlashLine, RiArrowRightSLine, RiUserAddLine,
    RiLoginCircleLine, RiTerminalBoxLine, RiFingerprintLine,
    RiCommandLine, RiPulseLine
} from 'react-icons/ri';
import { supabase } from '../../lib/supabaseClient';

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) navigate('/');
        };
        checkUser();
    }, [navigate]);

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                navigate('/');
            } else {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: window.location.origin,
                    },
                });
                if (error) throw error;
                setMessage('Vui lòng kiểm tra email để xác nhận đăng ký!');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-28 pb-12 px-6 flex items-center justify-center font-jakarta relative overflow-hidden bg-slate-950">
            <style>{`
                @keyframes gradient-slow {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                .animate-gradient-slow {
                    animation: gradient-slow 6s ease infinite;
                }
                @keyframes shimmer {
                    100% { transform: translateX(100%); }
                }
                .group-hover\\/btn\\:animate-shimmer:hover {
                    animation: shimmer 1.5s infinite;
                }
                /* Extra fix for shimmer to work with group-hover */
                .group\\/btn:hover .group-hover\\/btn\\:animate-shimmer {
                    animation: shimmer 1.5s infinite;
                }
            `}</style>
            {/* Extended Background System */}
            <div className="fixed inset-0 -z-10">
                <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-indigo-600/10 rounded-full blur-[160px] animate-pulse" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-purple-600/10 rounded-full blur-[160px] animate-pulse" style={{ animationDelay: '4s' }} />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] contrast-150" />

                {/* Decorative Grid */}
                <div className="absolute inset-0 opacity-[0.05]"
                    style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.98, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-5xl relative"
            >
                {/* Massive Glass Container - Optimized Height */}
                <div className="bg-slate-900/40 backdrop-blur-[60px] rounded-[3rem] border border-white/10 shadow-[0_80px_150px_-30px_rgba(0,0,0,0.7)] flex flex-col lg:flex-row overflow-hidden">

                    {/* Left Panel: Branding & Meta Info */}
                    <div className="lg:w-[40%] p-10 lg:p-14 relative overflow-hidden flex flex-col justify-between bg-gradient-to-br from-indigo-600/10 to-transparent border-r border-white/5">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px] -mr-32 -mt-32" />

                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-10">
                                <div className="w-12 h-12 bg-white text-slate-950 flex items-center justify-center rounded-xl shadow-2xl">
                                    <RiShieldFlashLine className="text-xl" />
                                </div>
                                <div>
                                    <div className="text-[8px] font-black uppercase tracking-[0.4em] text-indigo-400">Security Node</div>
                                    <div className="text-lg font-black text-white tracking-tighter">HML CORE v2.0</div>
                                </div>
                            </div>

                            <motion.h1
                                layoutId="auth-title"
                                className="text-4xl lg:text-6xl font-black text-white leading-[0.9] tracking-tighter mb-6"
                            >
                                {isLogin ? 'Welcome\nBack.' : 'Join the\nElite.'}
                            </motion.h1>

                            <p className="text-slate-400 text-sm font-medium max-w-[280px] leading-relaxed mb-8">
                                {isLogin
                                    ? 'Tiếp tục hành trình tối ưu hóa kiến thức với giao diện điều khiển mới.'
                                    : 'Khởi tạo danh tính số và bắt đầu đồng bộ dữ liệu ngay.'}
                            </p>

                            <div className="space-y-4">
                                {[
                                    { icon: <RiTerminalBoxLine />, label: 'Real-time Sync' },
                                    { icon: <RiFingerprintLine />, label: 'Encrypted Base' },
                                    { icon: <RiPulseLine />, label: 'Monitoring' }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3 text-slate-500">
                                        <div className="w-7 h-7 rounded-sm bg-white/5 flex items-center justify-center text-indigo-400">
                                            {item.icon}
                                        </div>
                                        <span className="text-[9px] uppercase font-bold tracking-widest">{item.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="relative z-10 pt-8">
                            <div className="flex items-center gap-3 text-slate-600 font-mono text-[8px] uppercase tracking-widest">
                                <RiCommandLine className="text-sm" />
                                <span>Status: Optimal</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel: The Form */}
                    <div className="lg:w-[60%] p-10 lg:p-16 flex flex-col justify-center relative">
                        <div className="max-w-md mx-auto w-full">
                            <div className="mb-10">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[8px] font-black uppercase tracking-widest text-slate-400 mb-4 font-jakarta">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    Access Point Alpha
                                </div>
                                <h3 className="text-2xl font-black text-white tracking-tight mb-1">
                                    {isLogin ? 'Xác thực Danh tính' : 'Khởi tạo Tài khoản'}
                                </h3>
                                <p className="text-slate-500 text-xs font-medium">Nhập thông tin truy cập của bạn.</p>
                            </div>

                            <form onSubmit={handleAuth} className="space-y-8 font-jakarta">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Universal ID / Email</label>
                                    <div className="relative group">
                                        <RiMailLine className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors text-xl" />
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="operative@hml.com"
                                            className="w-full bg-white/5 border border-white/5 rounded-3xl py-6 pl-16 pr-8 text-white text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 transition-all placeholder:text-slate-700"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between items-center px-1">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Access Code / Secret</label>
                                    </div>
                                    <div className="relative group">
                                        <RiLockPasswordLine className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors text-xl" />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full bg-white/5 border border-white/5 rounded-3xl py-6 pl-16 pr-16 text-white text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 transition-all placeholder:text-slate-700 font-mono"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors"
                                        >
                                            {showPassword ? <RiEyeOffLine className="text-xl" /> : <RiEyeLine className="text-xl" />}
                                        </button>
                                    </div>
                                </div>

                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="bg-red-500/10 border border-red-500/20 py-4 px-6 rounded-2xl text-red-400 text-xs font-bold flex items-center gap-3 shadow-lg shadow-red-500/5"
                                    >
                                        <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                                        {error}
                                    </motion.div>
                                )}

                                {message && (
                                    <motion.div
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="bg-emerald-500/10 border border-emerald-500/20 py-4 px-6 rounded-2xl text-emerald-400 text-xs font-bold flex items-center gap-3 shadow-lg shadow-emerald-500/5"
                                    >
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                                        {message}
                                    </motion.div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full relative group/btn h-[72px] rounded-[1.25rem] overflow-hidden transition-all duration-700 active:scale-[0.98] disabled:opacity-50 shadow-[0_0_0_1px_rgba(255,255,255,0.05)] hover:shadow-[0_0_40px_-10px_rgba(79,70,229,0.5)] bg-white/[0.02]"
                                >
                                    {/* Liquid Background Layer */}
                                    <div className="absolute inset-x-0 bottom-0 h-0 bg-gradient-to-t from-indigo-600 to-purple-600 transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover/btn:h-full opacity-90" />

                                    {/* Glass Reflector Top */}
                                    <div className="absolute inset-0 bg-gradient-to-b from-white/[0.08] to-transparent pointer-events-none" />

                                    {/* Border System */}
                                    <div className="absolute inset-0 border border-white/10 rounded-[1.25rem] group-hover/btn:border-white/30 transition-colors duration-500" />
                                    <div className="absolute inset-[-1px] border border-transparent group-hover/btn:border-indigo-500/50 rounded-[1.25rem] blur-[2px] transition-all duration-500" />

                                    {/* Decorative Particles (Optional CSS based) */}
                                    <div className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-1000">
                                        <div className="absolute h-1 w-1 bg-white rounded-full top-2 left-1/4 animate-ping" />
                                        <div className="absolute h-1 w-1 bg-white rounded-full bottom-4 right-1/3 animate-ping" style={{ animationDelay: '0.4s' }} />
                                    </div>

                                    <div className="relative z-10 flex items-center justify-center gap-4">
                                        {loading ? (
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-white animate-bounce [animation-delay:-0.3s]" />
                                                <div className="w-2 h-2 rounded-full bg-white animate-bounce [animation-delay:-0.15s]" />
                                                <div className="w-2 h-2 rounded-full bg-white animate-bounce" />
                                            </div>
                                        ) : (
                                            <>
                                                <div className="relative flex items-center justify-center">
                                                    <AnimatePresence mode="wait">
                                                        <motion.div
                                                            key={isLogin ? 'login' : 'register'}
                                                            initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
                                                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                                            exit={{ opacity: 0, scale: 0.5, rotate: 45 }}
                                                            className="text-2xl"
                                                        >
                                                            {isLogin ? <RiLoginCircleLine /> : <RiUserAddLine />}
                                                        </motion.div>
                                                    </AnimatePresence>

                                                    {/* Glow behind icon on hover */}
                                                    <div className="absolute inset-0 bg-white/40 blur-xl scale-0 group-hover/btn:scale-150 transition-transform duration-700 rounded-full opacity-0 group-hover/btn:opacity-40" />
                                                </div>

                                                <div className="flex flex-col items-start">
                                                    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white group-hover/btn:text-white transition-colors duration-500">
                                                        {isLogin ? 'Initiate Access' : 'Confirm Identity'}
                                                    </span>
                                                    <span className="text-[7px] font-bold uppercase tracking-[0.2em] text-indigo-400 group-hover/btn:text-indigo-200 transition-colors duration-500">
                                                        {isLogin ? 'Secure Gateway' : 'New Operative'}
                                                    </span>
                                                </div>

                                                <RiArrowRightSLine className="text-xl text-white/30 group-hover/btn:text-white group-hover/btn:translate-x-2 transition-all duration-500" />
                                            </>
                                        )}
                                    </div>

                                    {/* Shimmer (Revamped) */}
                                    <div className="absolute inset-y-0 -left-[100%] w-full bg-gradient-to-r from-transparent via-white/[0.08] to-transparent group-hover/btn:left-[100%] transition-all duration-[1200ms] pointer-events-none" />
                                </button>
                            </form>

                            <div className="mt-16 text-center">
                                <button
                                    onClick={() => {
                                        setIsLogin(!isLogin);
                                        setError(null);
                                        setMessage(null);
                                    }}
                                    className="group text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] hover:text-white transition-colors"
                                >
                                    {isLogin ? 'New operative? ' : 'Existing operative? '}
                                    <span className="text-indigo-400 underline underline-offset-[6px] decoration-2 decoration-indigo-500/30 group-hover:decoration-indigo-500 transition-all">{isLogin ? 'Sign up' : 'Sign in'}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Cyberpunk Decorative Tags - Wide Layout */}
                <div className="flex justify-between mt-12 px-10 opacity-30 pointer-events-none">
                    <div className="flex gap-12">
                        <div className="text-[9px] font-mono text-slate-400">UID: 888-HML-LUAN</div>
                        <div className="text-[9px] font-mono text-slate-400 hidden md:block">LOC: PORT-NODE-HML</div>
                    </div>
                    <div className="text-[9px] font-mono text-slate-400 text-right">SYSTEM_COMMIT_HASH: f8a3b2</div>
                </div>
            </motion.div>
        </div>
    );
};

export default AuthPage;
