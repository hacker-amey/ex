import React, { useState, useEffect } from 'react';
import { Project } from '../../shared/types';
import { 
  Smartphone, 
  Mic, 
  MicOff, 
  Send, 
  Bot, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Play, 
  RefreshCw, 
  ShieldCheck, 
  CheckCircle2, 
  X,
  Layers
} from 'lucide-react';

interface MobileCommandCenterProps {
  currentProject: Project | null;
  onTriggerBuild: () => void;
  onDeploy: () => void;
  onNavigateSection: (section: string) => void;
  onClose?: () => void;
}

interface Message {
  id: string;
  sender: 'user' | 'buildora';
  text: string;
  timestamp: string;
}

export const MobileCommandCenter: React.FC<MobileCommandCenterProps> = ({
  currentProject,
  onTriggerBuild,
  onDeploy,
  onNavigateSection,
  onClose
}) => {
  const [isListening, setIsListening] = useState(false);
  const [inputText, setInputText] = useState('');
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'buildora',
      text: `Hello Founder! I am Buildora Voice AI. Ask me about build status, dispatch agents, run self-healing tests, or deploy ${currentProject?.name || 'your product'}.`,
      timestamp: 'Just now'
    }
  ]);

  const quickCommands = [
    'Show build status',
    'Run all tests',
    'Explain the latest error',
    `Deploy ${currentProject?.productType || 'Product'} to production`,
    'Show me security risks',
    'What are backend agents doing?'
  ];

  const speakText = (text: string) => {
    if (!speechEnabled || typeof window === 'undefined' || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
    }
  };

  const handleExecuteCommand = (cmd: string) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: cmd,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');

    // Generate intelligent AI response based on command
    setTimeout(() => {
      let reply = '';
      const lower = cmd.toLowerCase();

      if (lower.includes('build status') || lower.includes('progress')) {
        reply = `Current build stage is ${currentProject?.stage} at ${currentProject?.progress}% completion. Quality score is ${currentProject?.qualityScore}/100 with 10 agents allocated.`;
      } else if (lower.includes('run all tests') || lower.includes('test')) {
        reply = `Running 47 automated test assertions across Unit, Integration, API, Security, and Performance suites. All 47 tests passed after self-healing patch!`;
        onNavigateSection('testing');
      } else if (lower.includes('error') || lower.includes('debug') || lower.includes('explain')) {
        reply = `Intercepted TypeError in orderService.js (line 42:15): NullPointer dereference. Debugger Kaito Tanaka synthesized and verified an AST null-safe guard patch.`;
        onNavigateSection('testing');
      } else if (lower.includes('deploy') || lower.includes('production')) {
        reply = `Initiating production rollout for ${currentProject?.name}. Ingress endpoint provisioned on Cloud Run with 3 healthy replicas.`;
        onDeploy();
        onNavigateSection('deployment');
      } else if (lower.includes('security') || lower.includes('risk')) {
        reply = `Security agent Zoe Thorne completed SAST scan. Zero critical OWASP vulnerabilities remaining. All SQL queries parameterized and token guards active.`;
        onNavigateSection('security');
      } else if (lower.includes('agent') || lower.includes('doing')) {
        reply = `10 specialized agents are active. Frontend Engineer Maya Lin assembled React components, while Backend Engineer Marcus Vance verified REST and SSE stream handlers.`;
        onNavigateSection('workforce');
      } else {
        reply = `Understood. Analyzing requirement "${cmd}". Buildora Orchestrator dispatching agents to execute task graph.`;
      }

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'buildora',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
      speakText(reply);
    }, 400);
  };

  const toggleMic = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      try {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => setIsListening(true);
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setIsListening(false);
          if (transcript) {
            handleExecuteCommand(transcript);
          }
        };
        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);
        recognition.start();
      } catch (err) {
        setIsListening(false);
        // Fallback simulation
        handleExecuteCommand('Show build status');
      }
    } else {
      // Simulate listening in browsers without webkitSpeech
      setIsListening(true);
      setTimeout(() => {
        setIsListening(false);
        handleExecuteCommand('Show build status');
      }, 1500);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto p-4 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between p-6 rounded-2xl bg-[#0e1017] border border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-violet-500/20">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white tracking-tight">Mobile Command Center</h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                VOICE AI ACTIVE
              </span>
            </div>
            <p className="text-xs text-zinc-400">Founder voice and conversational control over engineering agents.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSpeechEnabled(!speechEnabled)}
            className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
            title={speechEnabled ? 'Mute AI Voice' : 'Enable AI Voice'}
          >
            {speechEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4" />}
          </button>
          {onClose && (
            <button onClick={onClose} className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Mobile Device Frame Simulation */}
      <div className="rounded-3xl bg-[#0a0c13] border-4 border-zinc-800 p-6 shadow-2xl space-y-6">
        {/* Quick Voice Command Chips */}
        <div className="space-y-2">
          <span className="text-xs font-mono text-zinc-400">QUICK VOICE COMMANDS:</span>
          <div className="flex flex-wrap gap-2">
            {quickCommands.map((cmd, i) => (
              <button
                key={i}
                onClick={() => handleExecuteCommand(cmd)}
                className="px-3 py-1.5 rounded-lg bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700/80 text-xs font-mono text-cyan-300 hover:text-white transition-all flex items-center gap-1.5"
              >
                <Sparkles className="w-3 h-3 text-cyan-400" />
                <span>{cmd}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Conversation Stream */}
        <div className="h-80 overflow-y-auto space-y-3 p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800/80">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3.5 text-xs ${
                  m.sender === 'user'
                    ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-br-none'
                    : 'bg-zinc-900 text-zinc-200 border border-zinc-800 rounded-bl-none'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1 font-mono text-[10px] opacity-70">
                  {m.sender === 'buildora' && <Bot className="w-3 h-3 text-cyan-400" />}
                  <span>{m.sender === 'user' ? 'Founder' : 'Buildora Voice AI'}</span>
                  <span>• {m.timestamp}</span>
                </div>
                <p className="leading-relaxed whitespace-pre-wrap">{m.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Voice Input & Action Bar */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={toggleMic}
            id="btn-voice-mic-toggle"
            className={`p-3.5 rounded-2xl transition-all shadow-lg ${
              isListening
                ? 'bg-rose-500 text-white animate-pulse shadow-rose-500/30'
                : 'bg-gradient-to-tr from-violet-600 to-cyan-500 text-white shadow-indigo-500/20 hover:scale-105 active:scale-95'
            }`}
            title="Voice Mic Input"
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <input
            type="text"
            placeholder={isListening ? 'Listening to voice...' : 'Type a command or click mic...'}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && inputText.trim()) {
                handleExecuteCommand(inputText);
              }
            }}
            className="flex-1 px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500 font-mono"
          />

          <button
            onClick={() => {
              if (inputText.trim()) handleExecuteCommand(inputText);
            }}
            disabled={!inputText.trim()}
            className="p-3.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-cyan-400 disabled:opacity-40 transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
