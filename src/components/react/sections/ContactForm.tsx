import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { useScrambleText } from '../hooks/useScrambleText';
import { delay } from '../../../lib/utils';

type FormState = 'idle' | 'validating' | 'sending' | 'success';

const isBusy = (s: FormState) => s === 'sending' || s === 'success';

export const ContactForm: React.FC = () => {
  const [formState, setFormState] = useState<FormState>('idle');
  const [formData, setFormData] = useState({ name: '', email: '', message: '', website: '' });
  const [scannedErrors, setScannedErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState('');
  const { displayText: buttonText, scramble: scrambleButton, setDisplayText: setButtonText } =
    useScrambleText('SEND MESSAGE');

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
    await delay(600);

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

    // Go straight to sending — no artificial compiling delay
    setFormState('sending');

    try {
      const apiUrl = import.meta.env.PUBLIC_CONTACT_API_URL;
      if (apiUrl) {
        const res = await fetch(`${apiUrl}/v1/contact`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...formData, origin: 'blog' }),
        });
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));

          if (res.status === 400 && Array.isArray(errorData.errors) && errorData.errors.length > 0) {
            const fieldErrors: Record<string, string> = {};
            (errorData.errors as { field: string; message: string }[]).forEach(({ field, message }) => {
              fieldErrors[field] = `Exception: ${message}`;
            });
            setScannedErrors(fieldErrors);
            setFormState('idle');
            scrambleButton('SEND MESSAGE');
            return;
          }

          if (res.status === 429) {
            throw new Error('RATE LIMIT EXCEEDED. RETRY IN 15 MINUTES.');
          }

          throw new Error(errorData.message || 'TRANSMISSION FAILED. RETRY.');
        }
      } else {
        // No API configured — simulate success
        await delay(1200);
      }

      setFormState('success');
      setTimeout(() => {
        setFormState('idle');
        setFormData({ name: '', email: '', message: '', website: '' });
        setButtonText('SEND MESSAGE');
      }, 2000);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'NETWORK OFFLINE. RETRY TRANSMISSION.';
      setGeneralError(message);
      setFormState('idle');
      scrambleButton('SEND MESSAGE');
    }
  };

  const fields = ['name', 'email', 'message'] as const;
  const ease = 'cubic-bezier(0.76, 0, 0.24, 1)';

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-12 relative">

      {/* ── Fields ── */}
      <div className="flex flex-col gap-12">
        {fields.map((fieldName) => (
          <div key={fieldName} className="relative group">

            {/* Error message */}
            <div
              className="absolute -top-6 right-0 text-xs font-mono text-orange-400/80 tracking-widest uppercase"
              style={{
                opacity: scannedErrors[fieldName] ? 1 : 0,
                transform: scannedErrors[fieldName] ? 'translateY(0)' : 'translateY(5px)',
                transition: 'opacity 0.2s ease, transform 0.2s ease',
                pointerEvents: 'none',
              }}
            >
              {scannedErrors[fieldName] ?? '\u00A0'}
            </div>

            {fieldName === 'message' ? (
              <textarea
                id={fieldName}
                value={formData[fieldName]}
                onChange={handleInputChange}
                rows={3}
                disabled={formState !== 'idle'}
                className={`w-full bg-transparent py-4 outline-none transition-opacity peer resize-none text-fg ${
                  isBusy(formState) ? 'opacity-0' : 'opacity-50 focus:opacity-100'
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
                  isBusy(formState) ? 'opacity-0' : 'opacity-50 focus:opacity-100'
                }`}
              />
            )}

            {/* Label */}
            <label
              htmlFor={fieldName}
              style={{
                opacity: isBusy(formState) ? 0 : 0.5,
                transition: 'opacity 0.3s ease',
              }}
              className={`absolute left-0 cursor-text transition-all tracking-widest font-mono uppercase text-fg ${
                formData[fieldName] || formState !== 'idle'
                  ? '-top-6 text-xs'
                  : 'top-4 text-sm peer-focus:-top-6 peer-focus:text-xs'
              }`}
            >
              {fieldName === 'name'
                ? "What's your name?"
                : fieldName === 'message'
                ? 'Question, Comment or Message'
                : 'Your Email'}
            </label>

            {/* Underline — simple fill/clear transition, no scan */}
            <div className="absolute bottom-0 left-0 w-full h-[1px]">
              <div className="absolute inset-0 bg-fg opacity-20" />
              <div
                className={`absolute inset-0 origin-left ${scannedErrors[fieldName] ? 'bg-orange-400' : 'bg-fg'}`}
                style={{
                  transform: `scaleX(${scannedErrors[fieldName] || formData[fieldName] ? 1 : 0})`,
                  transition: 'transform 0.3s ease-in-out',
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Honeypot */}
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

      {/* ── Submit button ── */}
      <button
        type="submit"
        disabled={formState !== 'idle' && formState !== 'validating'}
        className="flex items-center justify-center h-[60px] overflow-hidden relative mt-4 origin-center self-start cursor-pointer active:scale-95"
        style={{
          width: isBusy(formState) ? '60px' : '180px',
          borderRadius: isBusy(formState) ? '30px' : '9999px',
          backgroundColor: formState === 'success' ? '#10b981' : 'var(--theme-fg)',
          color: 'var(--theme-bg)',
          transition: `width 0.5s ${ease}, border-radius 0.5s ${ease}, background-color 0.5s ${ease}, transform 0.1s ease`,
        }}
      >
        {/* Button label */}
        <span
          className="font-medium tracking-widest uppercase text-sm whitespace-nowrap absolute"
          style={{
            opacity: !isBusy(formState) ? 1 : 0,
            transform: !isBusy(formState) ? 'translateY(0)' : 'translateY(-16px)',
            transition: 'opacity 0.15s ease, transform 0.15s ease',
          }}
        >
          {buttonText}
        </span>

        {/* Circular progress arc */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 60 60"
          style={{
            opacity: formState === 'sending' ? 1 : 0,
            transform: `scale(${formState === 'sending' ? 1 : 0.6})`,
            transition: 'opacity 0.2s ease, transform 0.2s ease',
          }}
        >
          <circle
            cx="30"
            cy="30"
            r="28"
            stroke="var(--theme-bg)"
            strokeWidth="2"
            fill="none"
            strokeDasharray="176"
            strokeLinecap="round"
            className="origin-center -rotate-90"
            style={{
              strokeDashoffset: formState === 'sending' ? 0 : 176,
              transition: 'stroke-dashoffset 1.5s ease-in-out',
            }}
          />
        </svg>

        {/* Success checkmark */}
        {formState === 'success' && (
          <span
            className="animate-pop-in flex items-center justify-center absolute"
            style={{ color: 'var(--theme-bg)' }}
          >
            <Check size={24} />
          </span>
        )}
      </button>

      {generalError && (
        <p className="text-orange-500 font-mono text-xs uppercase tracking-widest mt-2">
          {generalError}
        </p>
      )}
    </form>
  );
};
