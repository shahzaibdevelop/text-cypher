import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Lock, Unlock, Copy, Code } from 'lucide-react';

function App() {
  const [inputText, setInputText] = useState("");
  const [resultText, setResultText] = useState("");
  const [mode, setMode] = useState("cipher");
  const [copySuccess, setCopySuccess] = useState("");
  const [magicAlgo, setMagicAlgo] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  // Rest of the state management and handler functions remain the same
  const parseMagicAlgo = (algo) => {
    return algo.split("").map((char, i) => {
      let shift = parseInt(char, 10);
      return i % 2 === 1 ? -shift : shift;
    });
  };

  const processText = (text, shiftPattern, isCipher) => {
    let result = "";
    for (let i = 0; i < text.length; i++) {
      let shift = shiftPattern[i % shiftPattern.length];
      if (!isCipher) shift = -shift;
      result += String.fromCharCode(text.charCodeAt(i) + shift);
    }
    return result;
  };

  const handleProcess = () => {
    setLoading(true);
    setResultText("");

    const startTime = performance.now();
    let shiftPattern = magicAlgo.trim() ? parseMagicAlgo(magicAlgo) : [2, -2, 9, -6];
    let output = processText(inputText, shiftPattern, mode === "cipher");
    const endTime = performance.now();

    setTimeout(() => {
      setResultText(output);
      setLoading(false);
    }, endTime - startTime);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(resultText)
      .then(() => {
        setCopySuccess("Copied!");
        setTimeout(() => setCopySuccess(""), 2000);
      })
      .catch((err) => console.error("Failed to copy: ", err));
  };

  // CSS for custom scrollbar
  const scrollbarStyles = `
    .custom-scrollbar::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }
    
    .custom-scrollbar::-webkit-scrollbar-track {
      background: rgba(16, 185, 129, 0.1);
      border-radius: 4px;
    }
    
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: #10B981;
      border-radius: 4px;
      border: 2px solid rgba(16, 185, 129, 0.1);
    }
    
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: #059669;
    }
  `;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <style>{scrollbarStyles}</style>
        <div className="relative">
          {/* Matrix-like characters background */}
          <div className="absolute inset-0 overflow-hidden opacity-20">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="absolute text-green-500 text-2xl font-mono"
                style={{
                  left: `${i * 10}%`,
                  animation: `matrixRain ${1 + Math.random() * 2}s linear infinite`,
                  animationDelay: `${Math.random() * 2}s`,
                }}
              >
                {"01".split("").map((char, index) => (
                  <div
                    key={index}
                    style={{
                      animation: `matrixFade 1.5s infinite`,
                      animationDelay: `${index * 0.1}s`,
                    }}
                  >
                    {char}
                  </div>
                ))}
              </div>
            ))}
          </div>
          
          {/* Main loader animation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative z-10 flex flex-col items-center"
          >
            <div className="relative">
              <div className="w-24 h-24 border-4 border-green-500/20 border-t-green-500 rounded-full animate-spin">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 border-4 border-green-400/20 border-t-green-400 rounded-full animate-spin animate-delay-150" />
                </div>
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-8 text-green-500 font-mono text-xl"
            >
              INITIALIZING SYSTEM...
            </motion.div>
          </motion.div>
        </div>
        <style jsx>{`
          @keyframes matrixRain {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(100vh); }
          }
          @keyframes matrixFade {
            0%, 100% { opacity: 0; }
            50% { opacity: 1; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-green-400 p-4">
      <style>{scrollbarStyles}</style>
      <header className="py-8 text-center relative">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10"
        >
          <Terminal className="w-16 h-16 mx-auto mb-4 text-green-400" />
          <h1 className="text-5xl font-extrabold font-mono bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-600">
            H4CK3R CYPH3R
          </h1>
        </motion.div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.1),transparent)] z-0" />
      </header>

      <div className="max-w-6xl mx-auto mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 p-6 rounded-lg bg-gray-900/50 backdrop-blur-sm border border-green-500/20">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-4"
        >
          <div className="relative">
            <motion.textarea
              className="custom-scrollbar w-full h-64 p-4 bg-black/50 text-green-400 border border-green-500/50 rounded-lg focus:outline-none focus:border-green-400 font-mono resize-none transition-colors duration-200 placeholder-green-700"
              placeholder="Enter text to encrypt..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={loading}
              whileFocus={{ scale: 1.01 }}
            />
            <Code className="absolute top-4 right-4 text-green-600/50" />
          </div>

          <div className="relative">
            <motion.input
              type="text"
              className="w-full p-4 bg-black/50 text-green-400 border border-green-500/50 rounded-lg focus:outline-none focus:border-green-400 font-mono transition-colors duration-200 placeholder-green-700"
              placeholder="Magic algorithm (e.g., 142)"
              value={magicAlgo}
              onChange={(e) => setMagicAlgo(e.target.value.replace(/[^0-9]/g, ""))}
              disabled={loading}
              whileFocus={{ scale: 1.01 }}
            />
          </div>

          <div className="flex space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setMode("cipher")}
              className={`flex-1 px-6 py-3 rounded-lg cursor-pointer font-mono border transition-colors duration-200 flex items-center justify-center space-x-2 ${
                mode === "cipher" 
                  ? "bg-green-500 text-black border-transparent" 
                  : "border-green-500/50 hover:bg-green-500/10"
              }`}
              disabled={loading}
            >
              <Lock className="w-4 h-4" />
              <span>Cipher</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setMode("decipher")}
              className={`flex-1 px-6 py-3 cursor-pointer rounded-lg font-mono border transition-colors duration-200 flex items-center justify-center space-x-2 ${
                mode === "decipher" 
                  ? "bg-green-500 text-black border-transparent" 
                  : "border-green-500/50 hover:bg-green-500/10"
              }`}
              disabled={loading}
            >
              <Unlock className="w-4 h-4" />
              <span>Decipher</span>
            </motion.button>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleProcess}
            className="w-full px-6 py-3 bg-green-500 cursor-pointer text-black rounded-lg font-mono font-bold transition-colors duration-200 hover:bg-green-400 flex items-center justify-center space-x-2"
            disabled={loading}
          >
            <Terminal className="w-4 h-4" />
            <span>{loading ? "Processing..." : "Execute"}</span>
          </motion.button>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-64 border border-green-500/50 rounded-lg flex items-center justify-center bg-black/50"
              >
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-green-500/20 border-t-green-500 rounded-full animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-green-400/20 border-t-green-400 rounded-full animate-spin animate-delay-150" />
                  </div>
                </div>
              </motion.div>
            ) : (
              resultText && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="relative group"
                >
                  <textarea
                    className="custom-scrollbar w-full h-64 p-4 bg-black/50 text-green-400 border border-green-500/50 rounded-lg font-mono resize-none focus:outline-none placeholder-green-700"
                    value={resultText}
                    readOnly
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCopy}
                    className="absolute bottom-4 cursor-pointer right-4 px-4 py-2 bg-green-500 text-black rounded-lg font-mono flex items-center space-x-2  transition-opacity duration-200"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Copy</span>
                  </motion.button>
                  <AnimatePresence>
                    {copySuccess && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-4 right-4 bg-green-500 text-black px-3 py-1 rounded-lg text-sm font-mono"
                      >
                        {copySuccess}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}

export default App;