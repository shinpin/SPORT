
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, CheckCircle, Camera, Loader2, Download, ArrowLeft, MapPin, Sparkles } from 'lucide-react';
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
  const [flash, setFlash] = useState(false);

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 4);
    setOtp(val);
    // 更新驗證碼為 9999
    if (val === '9999') {
      setTimeout(() => setIsVerified(true), 800);
    }
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
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const prompt = `A professional football trading card of a soccer player wearing the ${team.name} jersey. High-end sports photography, dramatic lighting, stadium background.`;
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: prompt }] },
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
      setPlayerCard('https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="h-full w-full overflow-y-auto bg-[#0a0f1a] text-white pb-10 relative">
      <div className={`p-8 pt-12 text-white rounded-b-[3.5rem] bg-gradient-to-r ${team.gradient}`}>
        <button onClick={onBack} className="absolute top-6 left-6 p-2 bg-white/20 rounded-full z-30">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="relative z-10">
          <h2 className="text-4xl font-black italic tracking-tighter mb-1 leading-none uppercase">榮耀時刻</h2>
          <span className="text-[10px] font-black uppercase tracking-widest text-white/60">您的比賽紀錄與獎勵</span>
        </div>
      </div>

      <div className="p-6 -mt-10 relative z-20">
        <div className="bg-white/5 backdrop-blur-3xl rounded-[2.5rem] p-6 mb-8 border border-white/10">
          {!isVerified ? (
            <div className="space-y-4 text-center">
              <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">請輸入門市人員提供的核銷碼</span>
              <input 
                type="text" 
                value={otp} 
                onChange={handleOtpChange} 
                maxLength={4} 
                className="w-full bg-black/40 border-2 border-white/10 rounded-3xl px-4 py-5 text-center text-4xl font-black text-white focus:border-blue-500 outline-none" 
                placeholder="----" 
              />
              <p className="text-[9px] text-white/20 uppercase tracking-widest">提示：9999</p>
            </div>
          ) : (
            <div className="p-5 bg-blue-500/10 rounded-3xl border border-blue-500/30 flex items-center justify-between">
              <div>
                <div className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">優惠代碼</div>
                <div className="text-2xl font-mono font-black text-white">{prize.couponCode}</div>
              </div>
              <button onClick={handleCopyCode} className="p-4 bg-blue-500 rounded-2xl">
                {isCopied ? <CheckCircle className="w-6 h-6" /> : <Copy className="w-6 h-6" />}
              </button>
            </div>
          )}
        </div>

        {isVerified && !playerCard && (
          <button onClick={startSimulation} className="w-full h-40 bg-blue-600 rounded-[2.5rem] flex flex-col items-center justify-center gap-2 border border-white/20 mb-8">
            <Camera className="w-10 h-10" />
            <span className="text-xl font-black italic uppercase tracking-tighter">製作專屬球員卡</span>
          </button>
        )}

        {playerCard && (
          <div className="flex flex-col items-center mb-10">
            <div className="relative w-full max-w-[320px] aspect-[1/1.4] bg-black rounded-[2rem] overflow-hidden border-[6px] border-white/10 shadow-2xl">
              <img src={playerCard} className="w-full h-full object-cover" alt="Legend Card" />
              <div className="absolute inset-0 p-5 flex flex-col justify-between bg-gradient-to-b from-transparent to-black/60">
                 <div className="text-right text-4xl">{team.flagEmoji}</div>
                 <div className="pb-4">
                    <h4 className="text-3xl font-black italic tracking-tighter uppercase leading-none mb-1">終極球員</h4>
                    <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest leading-none">分數：{score}</span>
                 </div>
              </div>
            </div>
          </div>
        )}

        <button onClick={onRestart} className="w-full bg-white text-black py-5 rounded-3xl font-black italic uppercase tracking-tighter text-xl active:scale-95 transition-transform">
          返回首頁
        </button>
      </div>

      <AnimatePresence>
        {showCameraSim && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[500] bg-black flex flex-col items-center justify-center">
            <div className="w-64 h-64 border-2 border-white/20 rounded-full flex items-center justify-center mb-10 overflow-hidden relative">
               <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute inset-0 bg-blue-500/10" />
               <span className="text-9xl font-black text-white">{captureCountdown}</span>
            </div>
            <div className="text-blue-400 font-black uppercase tracking-widest text-xl animate-pulse">擺個最帥的動作!</div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {isGenerating && (
        <div className="fixed inset-0 z-[600] bg-black/90 flex flex-col items-center justify-center p-10 text-center">
          <Loader2 className="w-16 h-16 text-blue-500 animate-spin mb-6" />
          <h3 className="text-3xl font-black text-white italic mb-2 uppercase tracking-tighter">AI 渲染中...</h3>
        </div>
      )}
    </div>
  );
};

export default RedeemScreen;
