import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useScrambleText } from '../hooks/useScrambleText';

type FormState = 'idle' | 'validating' | 'compiling' | 'sending' | 'success' | 'error';

export const ContactForm: React.FC = () => {
  const [formState, setFormState] = useState<FormState>('idle');
  const [formData, setFormData] = useState({ name: '', email: '', message: '', website: '' });
  const [scannedErrors, setScannedErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState('');
  const { displayText: buttonText, scramble: scrambleButton, setDisplayText: setButtonText } =
    useScrambleText('SEND MESSAGE');
  const prefersReducedMotion = useReducedMotion();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (scannedErrors[id]) {
      setScannedErrors((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }
  };

  const handleValidationPhase = async (): Promise<boolean> => {
    setFormState('validating');
    scrambleButton('ANALYZING...');
    await new Promise((r) => setTimeout(r, 600));

    let hasError = false;
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Exception: Expected [String], received [Null]';
      hasError = true;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      newErrors.email = 'Exception: Expected [Valid Email], received [Invalid Token]';
      hasError = true;
    }
    if (!formData.message.trim()) {
      newErrors.message = 'Exception: Expected [Content], received [Void]';
      hasError = true;
    }

    if (hasError) {
      setScannedErrors(newErrors);
      setTimeout(() => {
        scrambleButton('SEND MESSAGE');
        setFormState('idle');
      }, 800);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    if (formState !== 'idle') return;
    e.preventDefault();
    setGeneralError('');

    const isValid = await handleValidationPhase();
    if (!isValid) return;

    setFormState('compiling');
    await new Promise((r) => setTimeout(r, 1200));
    setFormState('sending');

    try {
      const apiUrl = import.meta.env.PUBLIC_CONTACT_API_URL;
      if (apiUrl) {
        const res = await fetch(`${apiUrl}/v1/contact`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.message || 'Failed to send message');
        }
      } else {
        // No API configured — simulate success
        await new Promise((r) => setTimeout(r, 800));
      }

      setFormState('success');
      setTimeout(() => {
        setFormState('idle');
        setFormData({ name: '', email: '', message: '', website: '' });
        setButtonText('SEND MESSAGE');
      }, 4000);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'NETWORK OFFLINE. RETRY TRANSMISSION.';
      setGeneralError(message);
      setFormState('idle');
      scrambleButton('SEND MESSAGE');
    }
  };

  const fields = ['name', 'email', 'message'] as const;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-12 relative">
      <motion.div
        className="flex flex-col gap-12"
        animate={
          formState === 'success'
            ? { gap: 0, opacity: 0, x: '100%' }
            : { gap: 48, opacity: 1, x: 0 }
        }
        transition={{
          duration: formState === 'success' ? 0.8 : 0.3,
          ease: formState === 'success' ? [0.76, 0, 0.24, 1] : 'easeOut',
        }}
      >
        {fields.map((fieldName) => (
          <div key={fieldName} className="relative group">
            <AnimatePresence>
              {scannedErrors[fieldName] && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute -top-6 right-0 text-xs font-mono text-orange-400/80 tracking-widest uppercase"
                >
                  {scannedErrors[fieldName]}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Kinetic data stream animation */}
            <AnimatePresence>
              {(formState === 'compiling' || formState === 'sending') && formData[fieldName] && (
                <motion.div className="absolute inset-0 pointer-events-none flex items-center py-4 overflow-hidden z-20">
                  {formData[fieldName].split('').map((char, charIdx) => (
                    <motion.span
                      key={`anim-${charIdx}`}
                      initial={{ opacity: 1, y: 0, x: 0, scale: 1 }}
                      animate={{
                        opacity: 0,
                        y: [0, -20, 50],
                        x: [0, charIdx * 2, 200],
                        scale: [1, 1.5, 0],
                      }}
                      transition={{
                        duration: 0.8,
                        delay: charIdx * 0.02,
                        ease: [0.76, 0, 0.24, 1],
                      }}
                      className="inline-block font-mono text-orange-400"
                    >
                      {char === ' ' ? '\u00A0' : char}
                    </motion.span>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {fieldName === 'message' ? (
              <textarea
                id={fieldName}
                value={formData[fieldName]}
                onChange={handleInputChange}
                rows={3}
                disabled={formState !== 'idle'}
                className={`w-full bg-transparent py-4 outline-none transition-opacity peer resize-none text-fg ${
                  formState !== 'idle' && formState !== 'validating' ? 'opacity-0' : 'opacity-50 focus:opacity-100'
                }`}
              />
            ) : (
              <input
                type={fieldName === 'email' ? 'email' : 'text'}
                id={fieldName}
                value={formData[fieldName]}
                onChange={handleInputChange}
                disabled={formState !== 'idle'}
                className={`w-full bg-transparent py-4 outline-none transition-opacity peer text-fg ${
                  formState !== 'idle' && formState !== 'validating' ? 'opacity-0' : 'opacity-50 focus:opacity-100'
                }`}
              />
            )}

            <motion.label
              htmlFor={fieldName}
              animate={{
                opacity: formState === 'compiling' || formState === 'sending' || formState === 'success' ? 0 : 0.5,
              }}
              className={`absolute left-0 cursor-text transition-all tracking-widest font-mono uppercase text-fg ${
                formData[fieldName] || formState !== 'idle'
                  ? '-top-6 text-xs'
                  : 'top-4 text-sm peer-focus:-top-6 peer-focus:text-xs'
              }`}
            >
              {fieldName === 'name' ? "What's your name?" : fieldName === 'message' ? 'Project Details' : 'Your Email'}
            </motion.label>

            <div className="absolute bottom-0 left-0 w-full h-[1px]">
              <div className="absolute inset-0 bg-fg opacity-20" />
              <motion.div
                className={`absolute inset-0 origin-left ${scannedErrors[fieldName] ? 'bg-orange-400' : 'bg-fg'}`}
                initial={{ scaleX: 0 }}
                animate={{
                  scaleX:
                    formState === 'validating' && !scannedErrors[fieldName]
                      ? [0, 1, 0, 1]
                      : scannedErrors[fieldName]
                      ? 1
                      : formData[fieldName]
                      ? 1
                      : 0,
                }}
                transition={{
                  duration: formState === 'validating' ? 0.6 : 0.3,
                  ease: 'easeInOut',
                  times: formState === 'validating' ? [0, 0.5, 0.51, 1] : undefined,
                }}
              />
            </div>
          </div>
        ))}
      </motion.div>

      {/* Honeypot — hidden from real users, bots fill it */}
      <div style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0, overflow: 'hidden' }} aria-hidden="true">
        <input
          type="text"
          id="website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={formData.website}
          onChange={handleInputChange}
        />
      </div>

      {/* Submit button */}
      <motion.button
        type="submit"
        disabled={formState !== 'idle' && formState !== 'validating'}
        whileTap={formState === 'idle' ? { scale: 0.95 } : {}}
        animate={{
          width:
            formState === 'compiling' || formState === 'sending' || formState === 'success' ? 60 : 180,
          borderRadius:
            formState === 'compiling' || formState === 'sending' || formState === 'success' ? 30 : 9999,
          backgroundColor: formState === 'success' ? '#10b981' : 'var(--theme-fg)',
        }}
        transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
        className="flex items-center justify-center h-[60px] overflow-hidden relative mt-4 origin-center self-start cursor-pointer"
        style={{ color: 'var(--theme-bg)' }}
      >
        <AnimatePresence mode="wait">
          {(formState === 'idle' || formState === 'validating') && (
            <motion.span
              key="text"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="font-medium tracking-widest uppercase text-sm whitespace-nowrap"
            >
              {buttonText}
            </motion.span>
          )}

          {(formState === 'compiling' || formState === 'sending') && (
            <motion.svg
              key="loader"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 60 60"
            >
              <motion.circle
                cx="30"
                cy="30"
                r="28"
                stroke="var(--theme-bg)"
                strokeWidth="2"
                fill="none"
                strokeDasharray="176"
                initial={{ strokeDashoffset: 176 }}
                animate={{ strokeDashoffset: formState === 'sending' ? 0 : 176 }}
                transition={{ duration: 1.5, ease: 'easeInOut' }}
                strokeLinecap="round"
                className="origin-center -rotate-90"
              />
            </motion.svg>
          )}

          {formState === 'success' && (
            <motion.span
              key="success"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center justify-center"
              style={{ color: 'var(--theme-bg)' }}
            >
              <Check size={24} />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {generalError && (
        <p className="text-orange-500 font-mono text-xs uppercase tracking-widest mt-2">
          {generalError}
        </p>
      )}
    </form>
  );
};
