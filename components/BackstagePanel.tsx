
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Settings, Cpu, Clock, Zap, AlertCircle } from 'lucide-react';

interface BackstageConfig {
  enabled: boolean;
  rounds: number;
}

interface BackstagePanelProps {
  onClose: () => void;
  config: BackstageConfig;
  onUpdateConfig: (config: BackstageConfig) => void;
}

const BackstagePanel: React.FC<BackstagePanelProps> = ({ onClose, config, onUpdateConfig }) => {
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      className="fixed inset-4 z-[500] bg-slate-900/95 backdrop-blur-2xl rounded-[2.5rem] border border-white/20 shadow-[0_0_100px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden"
    >
      <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-blue-400" />
          <h2 className="text-sm font-black uppercase tracking-widest text-white">Debug 後台管理</h2>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <X className="w-5 h-5 text-white/50" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-blue-400">
            <Cpu className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">系統監測</span>
          </div>
          <div className="grid gap-3">
            <div className="bg-black/40 p-4 rounded-2xl border border-white/5">
              <div className="text-[9px] text-white/30 uppercase mb-1">User Agent</div>
              <div className="text-[10px] font-mono text-white/70 break-all leading-relaxed">
                {navigator.userAgent}
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-1 bg-black/40 p-4 rounded-2xl border border-white/5 flex items-center justify-between">
                <div className="text-[9px] text-white/30 uppercase">當前時間</div>
                <div className="text-xs font-mono text-white">{currentTime}</div>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-2 text-yellow-400">
            <Zap className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">測試控制</span>
          </div>
          <div className="bg-blue-600/10 p-5 rounded-3xl border border-blue-500/20">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="text-white text-xs font-bold">自動測試模式</div>
                <div className="text-white/40 text-[9px] mt-1 uppercase tracking-tighter">AI 將模擬使用者行為自動遊戲</div>
              </div>
              <button 
                onClick={() => onUpdateConfig({ ...config, enabled: !config.enabled })}
                className={`w-12 h-6 rounded-full relative transition-colors ${config.enabled ? 'bg-blue-500' : 'bg-white/10'}`}
              >
                <motion.div 
                  animate={{ x: config.enabled ? 26 : 4 }}
                  className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-lg"
                />
              </button>
            </div>
            
            <div className="space-y-3">
              <div className="text-[9px] text-white/40 uppercase font-bold tracking-widest">模擬配置</div>
              <div className="flex gap-2 text-[10px] text-white/60">
                正在使用：{config.enabled ? '開啟中' : '已關閉'}
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="p-6 bg-black/20 border-t border-white/5">
        <div className="flex items-start gap-3 text-white/30 italic">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <p className="text-[9px] leading-relaxed">
            注意：本後台僅供開發測試使用，正式發布前應移除或隱藏更深。
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default BackstagePanel;
