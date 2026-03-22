import { useState } from 'react';
import { Check, AlertCircle, Loader2 } from '../ui/Icons';

interface Props {
  endpoint: string;
  source: string;
}

type FormState = 'idle' | 'submitting' | 'success' | 'error';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const NewsletterSection: React.FC<Props> = ({ endpoint, source }) => {
  const [email, setEmail]         = useState('');
  const [state, setState]         = useState<FormState>('idle');
  const [errorMsg, setErrorMsg]   = useState('');
  const [fieldError, setFieldError] = useState('');

  function validateEmail(value: string): string {
    if (!value.trim()) return 'Email address is required.';
    if (!EMAIL_REGEX.test(value.trim())) return 'Please enter a valid email address.';
    return '';
  }

  const handleBlur = () => {
    setFieldError(validateEmail(email));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    // Clear field error as soon as user starts correcting
    if (fieldError) setFieldError(validateEmail(e.target.value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (state === 'submitting' || state === 'success') return;

    // Client-side validation before hitting the network
    const err = validateEmail(email);
    if (err) {
      setFieldError(err);
      return;
    }

    setState('submitting');
    setErrorMsg('');
    setFieldError('');

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          source,
          website: '', // honeypot — always empty from legitimate submissions
        }),
      });

      const data = await res.json().catch(() => ({ success: false, message: 'Unexpected error.' }));

      if (!res.ok || !data.success) {
        const msg =
          data.message ||
          (res.status === 429
            ? 'Too many attempts. Please try again later.'
            : 'Something went wrong. Please try again.');
        setState('error');
        setErrorMsg(msg);
        return;
      }

      setState('success');
    } catch {
      setState('error');
      setErrorMsg('Unable to connect. Please check your connection and try again.');
    }
  };

  const handleRetry = () => {
    setState('idle');
    setErrorMsg('');
  };

  return (
    <section className="py-24 px-8 lg:px-24 border-t border-line-faint">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-2xl animate-fade-slide-up">
          <span className="font-mono text-xs text-fg-faint uppercase tracking-widest mb-4 block">
            Newsletter
          </span>
          <h2 className="text-4xl font-display font-bold text-fg tracking-tight mb-4">
            Stay in the loop
          </h2>
          <p className="text-fg-muted leading-relaxed mb-8">
            New articles about architecture, deep dives, and engineering culture — delivered when
            they're ready, not on a fixed schedule.
          </p>

          {/* ── Success state ── */}
          {state === 'success' && (
            <div className="flex items-center gap-3 text-green-400 font-mono text-sm">
              <Check size={16} aria-hidden="true" />
              You're subscribed. Welcome aboard.
            </div>
          )}

          {/* ── Error state ── */}
          {state === 'error' && (
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3 text-red-400 font-mono text-sm">
                <AlertCircle size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
                <span>{errorMsg}</span>
              </div>
              <button
                onClick={handleRetry}
                className="self-start font-mono text-xs uppercase tracking-widest text-fg-faint hover:text-fg transition-colors underline underline-offset-4 cursor-pointer"
              >
                Try again
              </button>
            </div>
          )}

          {/* ── Form (idle + submitting) ── */}
          {(state === 'idle' || state === 'submitting') && (
            <div className="flex flex-col gap-2">
              <form onSubmit={handleSubmit} noValidate className="flex gap-3">
                {/* Honeypot — hidden from real users, bots fill it in */}
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  aria-hidden="true"
                  className="hidden"
                  autoComplete="off"
                />
                <input
                  type="email"
                  value={email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="your@email.com"
                  required
                  aria-label="Email address"
                  aria-describedby={fieldError ? 'newsletter-field-error' : undefined}
                  aria-invalid={!!fieldError}
                  disabled={state === 'submitting'}
                  className={`flex-1 bg-surface-raised border rounded-full px-6 py-3 text-fg placeholder-fg-faint font-mono text-sm outline-none transition-colors disabled:opacity-60 ${
                    fieldError
                      ? 'border-red-400 focus:border-red-400'
                      : 'border-line focus:border-line-strong'
                  }`}
                />
                <button
                  type="submit"
                  disabled={state === 'submitting'}
                  className="flex items-center gap-2 px-6 py-3 bg-fg text-surface rounded-full font-mono text-sm uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
                >
                  {state === 'submitting' ? (
                    <>
                      <Loader2 size={14} className="animate-spin" aria-hidden="true" />
                      Subscribing
                    </>
                  ) : (
                    'Subscribe'
                  )}
                </button>
              </form>

              {/* Inline field validation error */}
              {fieldError && (
                <p id="newsletter-field-error" className="pl-6 font-mono text-xs text-red-400" role="alert">
                  {fieldError}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
