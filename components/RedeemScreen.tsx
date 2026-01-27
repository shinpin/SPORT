
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Copy, CheckCircle, Camera, Loader2, Download, ArrowLeft, MapPin, User, Sparkles } from 'lucide-react';
import { Prize, Team } from '../types';
import { GoogleGenAI } from "@google/genai";

interface RedeemScreenProps {
  prize: Prize;
  team: Team;
  score: number;
  userId: string;
  onRestart: () => void;
  onBack: () => void;
}

const RedeemScreen: React.FC<RedeemScreenProps> = ({ prize, team, score, userId, onRestart, onBack }) => {
  const [otp, setOtp] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [showCameraSim, setShowCameraSim] = useState(false);
  const [captureCountdown, setCaptureCountdown] = useState<number | null>(null);
  const [playerCard, setPlayerCard] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isShiny, setIsShiny] = useState(false);
  const [flash, setFlash] = useState(false);

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtp(val);
    if (val.length === 6) setTimeout(() => setIsVerified(true), 800);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(prize.couponCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const startSimulation = () => {
    setShowCameraSim(true);
    setCaptureCountdown(3);
  };

  useEffect(() => {
    if (captureCountdown === null) return;
    if (captureCountdown > 0) {
      const timer = setTimeout(() => setCaptureCountdown(captureCountdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setFlash(true);
      setTimeout(() => {
        setFlash(false);
        generateMockCard();
      }, 150);
      setCaptureCountdown(null);
    }
  }, [captureCountdown]);

  const generateMockCard = async () => {
    setShowCameraSim(false);
    setIsGenerating(true);
    setIsShiny(Math.random() < 0.4);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `A professional football trading card of a male athlete wearing the official ${team.name} soccer jersey. High-end sports photography, dramatic lighting. ${isShiny ? 'Epic golden holographic background with light rays.' : 'Modern stadium background.'}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            { text: prompt }
          ]
        },
        config: { imageConfig: { aspectRatio: "3:4" } }
      });

      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          setPlayerCard(`data:image/png;base64,${part.inlineData.data}`);
          break;
        }
      }
    } catch (err) {
      console.error(err);
      alert("生成失敗，系統繁忙中，請重試。");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="h-full w-full overflow-y-auto bg-[#0a0f1a] text-white pb-10 relative">
      {/* Header */}
      <div className={`p-8 pt-12 text-white rounded-b-[3.5rem] shadow-2xl relative overflow-hidden bg-gradient-to-r ${team.gradient}`}>
        <button onClick={onBack} className="absolute top-6 left-6 p-2 bg-white/20 backdrop-blur-md rounded-full z-30 active:scale-90 transition-transform">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="relative z-10">
          <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-[10px] font-black mb-2 uppercase tracking-[0.2em]">比賽獎勵</div>
          <h2 className="text-4xl font-black italic tracking-tighter mb-1 leading-none">榮耀時刻</h2>
        </div>
      </div>

      <div className="p-6 -mt-10 relative z-20">
        {/* 獎項核銷區 */}
        <div className="bg-white/5 backdrop-blur-3xl rounded-[2.5rem] p-6 mb-8 border border-white/10">
          {!isVerified ? (
            <div className="space-y-4">
              <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">請輸入門市人員提供的核銷碼</span>
              <input 
                type="text" 
                value={otp} 
                onChange={handleOtpChange} 
                maxLength={6} 
                className="w-full bg-white/5 border-2 border-white/10 rounded-3xl px-4 py-5 text-center text-4xl font-mono font-black placeholder:text-white/10" 
                placeholder="000000" 
              />
            </div>
          ) : (
            <div className="p-5 bg-blue-500/10 rounded-3xl border border-blue-500/30 flex items-center justify-between">
              <div>
                <div className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">優惠代碼</div>
                <div className="text-2xl font-mono font-black text-white">{prize.couponCode}</div>
              </div>
              <button onClick={handleCopyCode} className="p-4 bg-blue-500 rounded-2xl active:scale-90 transition-transform">
                {isCopied ? <CheckCircle className="w-6 h-6" /> : <Copy className="w-6 h-6" />}
              </button>
            </div>
          )}
        </div>

        {/* 製作卡片入口 */}
        <AnimatePresence>
          {!playerCard && !showCameraSim && isVerified && (
            <motion.button 
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              onClick={startSimulation}
              className="w-full h-40 bg-gradient-to-br from-blue-600 to-blue-900 rounded-[2.5rem] flex flex-col items-center justify-center gap-2 border border-white/20 shadow-2xl mb-8"
            >
              <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center">
                <Camera className="w-7 h-7" />
              </div>
              <span className="text-xl font-black italic uppercase tracking-tighter">製作專屬球員卡</span>
            </motion.button>
          )}

          {/* 展示生成的球員卡 */}
          {playerCard && (
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center mb-10">
              <h3 className="text-2xl font-black italic text-white uppercase mb-6 tracking-tighter">你的專屬傳奇閃卡</h3>
              
              <div className="relative w-full max-w-[320px] aspect-[1/1.4] group">
                {/* 卡片本體 */}
                <div className="absolute inset-0 bg-black rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] border-[6px] border-white/10">
                   <img src={playerCard} className="w-full h-full object-cover" alt="Legend Card" />
                   
                   {/* 卡面 UI 覆蓋層 */}
                   <div className="absolute inset-0 pointer-events-none p-5 flex flex-col justify-between bg-gradient-to-b from-black/20 via-transparent to-black/60">
                      <div className="flex justify-between items-start">
                         <div className="bg-white/10 backdrop-blur-xl px-2 py-1 rounded-lg border border-white/20">
                            <div className="text-[8px] font-black text-white/60">綜合評分</div>
                            <div className="text-xl font-black italic leading-none">94</div>
                         </div>
                         <div className="w-10 h-10 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/20 text-xl">
                            {team.flagEmoji}
                         </div>
                      </div>
                      
                      <div className="p-1">
                         <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest leading-none mb-1">職業前鋒</span>
                         <h4 className="text-3xl font-black italic tracking-tighter uppercase leading-none mb-2">終極球員</h4>
                         <div className="flex gap-4 border-t border-white/10 pt-2">
                            <div className="flex flex-col">
                               <span className="text-[7px] font-black text-white/40 uppercase">分數</span>
                               <span className="text-lg font-black italic tabular-nums">{score}</span>
                            </div>
                            <div className="flex flex-col">
                               <span className="text-[7px] font-black text-white/40 uppercase">排名</span>
                               <span className="text-lg font-black italic uppercase">MVP</span>
                            </div>
                         </div>
                      </div>
                   </div>

                   <motion.div 
                     animate={{ left: ['-100%', '200%'] }}
                     transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                     className="absolute top-0 bottom-0 w-32 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-25deg] z-40"
                   />
                </div>
                
                {isShiny && (
                  <div className="absolute -top-3 -right-3 z-50 bg-yellow-400 text-black px-4 py-1 rounded-full text-[10px] font-black italic tracking-tighter border-2 border-white shadow-xl rotate-12 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> 限量閃卡
                  </div>
                )}
              </div>

              <div className="flex gap-4 mt-8 w-full px-4">
                <a href={playerCard} download="legend_card.png" className="flex-1 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex items-center justify-center gap-2 font-black italic uppercase">
                  <Download className="w-5 h-5" /> 長按保存
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="bg-white/5 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 p-6 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <MapPin className="w-6 h-6 text-blue-400" />
            <h3 className="text-xl font-black italic uppercase tracking-tighter">兌獎門市</h3>
          </div>
          <p className="text-xs text-white/50 font-medium">地址：台北市信義區忠孝東路五段 8 號</p>
        </div>

        <button onClick={onRestart} className="w-full bg-white text-black py-5 rounded-3xl font-black italic uppercase tracking-tighter text-xl shadow-xl active:scale-95 transition-transform">
          繼續獲得獎勵
        </button>
      </div>

      {showCameraSim && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center">
          <div className="w-full p-8 text-center pt-16">
             <h3 className="text-2xl font-black italic text-white uppercase tracking-tighter">製作專屬球員卡</h3>
          </div>

          <div className="relative w-full max-sm aspect-[3/4] overflow-hidden bg-slate-900 rounded-[2rem] border-4 border-white/10 shadow-2xl mx-6">
            <div className="absolute inset-0 bg-[#111] flex items-center justify-center">
               <div className="w-full h-full opacity-20 bg-[url('https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800')] bg-cover bg-center grayscale"></div>
            </div>
            
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
               <div className="w-[85%] h-[85%] border-2 border-white/30 rounded-[2.5rem] flex flex-col items-center justify-center">
                  <div className="w-48 h-48 border-2 border-white/20 rounded-full flex items-center justify-center mb-10">
                     <User className="w-32 h-32 text-white/10" />
                  </div>
                  <span className="text-xs font-black text-white/80 uppercase tracking-widest text-center px-10">
                     請將臉部對準圓框
                  </span>
               </div>
            </div>

            <AnimatePresence>
              {flash && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-white z-[110]" />
              )}
            </AnimatePresence>

            {captureCountdown !== null && (
              <div className="absolute inset-0 flex items-center justify-center z-[120]">
                <motion.span 
                  key={captureCountdown}
                  initial={{ scale: 2.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-9xl font-black italic text-white drop-shadow-[0_0_50px_rgba(0,0,0,0.8)]"
                >
                  {captureCountdown}
                </motion.span>
              </div>
            )}
          </div>

          <div className="flex-1 w-full flex flex-col items-center justify-center p-10">
             <div className="text-white/40 font-black uppercase tracking-widest text-xs animate-pulse">
                模擬定位中...
             </div>
          </div>
        </div>
      )}

      {isGenerating && (
        <div className="fixed inset-0 z-[150] bg-black/95 flex flex-col items-center justify-center p-10 text-center">
          <Loader2 className="w-16 h-16 text-blue-500 animate-spin mb-6" />
          <h3 className="text-3xl font-black text-white italic mb-2 uppercase tracking-tighter">渲染中...</h3>
          <p className="text-white/40 text-xs font-bold uppercase tracking-widest leading-relaxed">
            正在結合 AI 運算，為您生成專屬傳奇球員卡
          </p>
        </div>
      )}
    </div>
  );
};

export default RedeemScreen;
