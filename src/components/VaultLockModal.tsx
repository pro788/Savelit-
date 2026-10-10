import React, { useState } from 'react';
import { Lock, Unlock, KeyRound, AlertCircle, X, Shield } from 'lucide-react';

interface VaultLockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  savedPin: string;
}

export const VaultLockModal: React.FC<VaultLockModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  savedPin,
}) => {
  const [pin, setPin] = useState<string>('');
  const [error, setError] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleKeyPress = (num: string) => {
    if (pin.length >= 4) return;
    const nextPin = pin + num;
    setPin(nextPin);
    setError(false);

    if (nextPin.length === 4) {
      if (nextPin === savedPin) {
        setTimeout(() => {
          setPin('');
          onSuccess();
        }, 150);
      } else {
        setError(true);
        setTimeout(() => {
          setPin('');
        }, 600);
      }
    }
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
    setError(false);
  };

  const handleQuickDemoPin = () => {
    setPin(savedPin);
    setTimeout(() => {
      setPin('');
      onSuccess();
    }, 150);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-xs bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-500 hover:text-slate-300 rounded-full hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-4 shadow-lg shadow-rose-500/10">
          <Lock className="w-7 h-7" />
        </div>

        <h3 className="font-bold text-slate-100 text-base mb-1">Private Vault Locked</h3>
        <p className="text-xs text-slate-400 mb-6">
          Enter your 4-digit PIN code to reveal protected bookmarks and secret notes.
        </p>

        {/* PIN Indicators */}
        <div className={`flex items-center gap-3 mb-6 ${error ? 'animate-bounce' : ''}`}>
          {[0, 1, 2, 3].map((index) => {
            const isFilled = pin.length > index;
            return (
              <div
                key={index}
                className={`w-3.5 h-3.5 rounded-full transition-all duration-150 ${
                  isFilled
                    ? 'bg-rose-500 scale-110 shadow-sm shadow-rose-500/50'
                    : 'bg-slate-800 border border-slate-700'
                }`}
              />
            );
          })}
        </div>

        {error && (
          <p className="text-xs text-rose-400 font-medium mb-3 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" /> Incorrect PIN. Try default (1234)
          </p>
        )}

        {/* Numeric Keypad */}
        <div className="grid grid-cols-3 gap-3 w-full mb-4">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              onClick={() => handleKeyPress(digit)}
              className="h-12 rounded-2xl bg-slate-800 hover:bg-slate-750 active:bg-slate-700 text-slate-200 text-lg font-semibold transition-all border border-slate-700/60 shadow-sm flex items-center justify-center"
            >
              {digit}
            </button>
          ))}
          <button
            onClick={handleQuickDemoPin}
            className="h-12 rounded-2xl text-[10px] uppercase font-bold text-slate-400 hover:text-rose-300 transition-colors flex items-center justify-center"
            title="Auto-fill default 1234"
          >
            Auto 1234
          </button>
          <button
            onClick={() => handleKeyPress('0')}
            className="h-12 rounded-2xl bg-slate-800 hover:bg-slate-750 active:bg-slate-700 text-slate-200 text-lg font-semibold transition-all border border-slate-700/60 shadow-sm flex items-center justify-center"
          >
            0
          </button>
          <button
            onClick={handleDelete}
            className="h-12 rounded-2xl text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors flex items-center justify-center"
          >
            Delete
          </button>
        </div>

        <div className="pt-2 border-t border-slate-800/80 w-full flex items-center justify-center">
          <span className="text-[11px] text-slate-500 flex items-center gap-1">
            <Shield className="w-3 h-3 text-emerald-400" /> Default Passcode: 1234
          </span>
        </div>
      </div>
    </div>
  );
};
