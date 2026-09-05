"use client";

import { useState } from "react";
import { useAuth } from "@/lib/context/auth-context";
import { X, Lock, ArrowRight, Loader2, Phone, Check } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  backgroundImageUrl?: string;
}

export function AuthModal({
  isOpen,
  onClose,
  backgroundImageUrl,
}: AuthModalProps) {
  const {
    signInWithGoogle,
    signInWithGithub,
    sendPhoneOtp,
    verifyPhoneOtp,
    lastUsedProvider,
  } = useAuth();

  const [showPhoneLogin, setShowPhoneLogin] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setErrorMsg("");
      await signInWithGoogle(rememberMe);
      onClose();
    } catch (err: unknown) {
      console.error(err);
      setErrorMsg("Google sign-in was cancelled or failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGithubSignIn = async () => {
    try {
      setIsLoading(true);
      setErrorMsg("");
      await signInWithGithub(rememberMe);
      onClose();
    } catch (err: unknown) {
      console.error(err);
      setErrorMsg("GitHub sign-in was cancelled or failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNumber = phoneNumber.replace(/[^0-9]/g, "");
    if (cleanNumber.length < 10) {
      setErrorMsg("Please enter a valid 10-digit Indian mobile number.");
      return;
    }

    const fullNumber = `+91${cleanNumber.slice(-10)}`;

    try {
      setIsLoading(true);
      setErrorMsg("");
      await sendPhoneOtp(fullNumber, "recaptcha-container");
      setOtpSent(true);
    } catch (err: unknown) {
      console.error(err);
      setErrorMsg("Failed to send SMS OTP. Please check mobile number.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 6) {
      setErrorMsg("Please enter the 6-digit OTP received via SMS.");
      return;
    }

    try {
      setIsLoading(true);
      setErrorMsg("");
      await verifyPhoneOtp(otp, rememberMe);
      onClose();
    } catch (err: unknown) {
      console.error(err);
      setErrorMsg("Invalid OTP code. Please verify and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-[380px] rounded-3xl bg-[#09090b] border border-zinc-800 shadow-2xl overflow-hidden p-6 sm:p-7 space-y-5 text-white">
        {/* Optional background image overlay */}
        {backgroundImageUrl && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-25 pointer-events-none mix-blend-luminosity"
            style={{ backgroundImage: `url(${backgroundImageUrl})` }}
          />
        )}

        {/* Ambient atmospheric glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 size-48 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition-colors cursor-pointer z-10"
          title="Close modal"
        >
          <X className="size-4" />
        </button>

        {/* Top Header - Letter Spaced WELCOME CONTRIBUTORS */}
        <div className="text-center space-y-1 relative z-10 pt-2">
          <h2 className="text-xs sm:text-sm font-semibold tracking-[0.35em] text-cyan-400 uppercase drop-shadow-xs">
            W E L C O M E
          </h2>
          <h1 className="text-base sm:text-lg font-bold tracking-[0.28em] text-white uppercase drop-shadow-xs">
            C O N T R I B U T O R S
          </h1>
          <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-zinc-600 to-transparent mx-auto mt-3" />
        </div>

        {/* LAST USED INDICATOR */}
        <div className="text-center relative z-10 pt-1">
          <span className="text-[10px] font-mono tracking-[0.2em] text-zinc-400 uppercase font-semibold">
            LAST USED: {lastUsedProvider || "GOOGLE"}
          </span>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs text-center font-medium relative z-10">
            {errorMsg}
          </div>
        )}

        {/* Invisible reCAPTCHA container for Indian Phone OTP */}
        <div id="recaptcha-container" />

        {/* Main Buttons List */}
        {!showPhoneLogin ? (
          <div className="space-y-2.5 relative z-10">
            {/* 1. Continue with Google (Primary Highlighted Card) */}
            <button
              type="button"
              disabled={isLoading}
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-zinc-200 hover:bg-white text-zinc-950 font-semibold text-xs transition-all shadow-md cursor-pointer disabled:opacity-50 group hover:scale-[1.01] active:scale-[0.99]"
            >
              <svg className="size-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* 2. Continue with GitHub */}
            <button
              type="button"
              disabled={isLoading}
              onClick={handleGithubSignIn}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-[#141416] hover:bg-zinc-900 border border-zinc-800 text-zinc-100 font-semibold text-xs transition-all shadow-sm cursor-pointer disabled:opacity-50 hover:border-zinc-700 hover:scale-[1.01] active:scale-[0.99]"
            >
              <svg className="size-4 fill-white shrink-0" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span>Continue with GitHub</span>
            </button>

            {/* 3. Continue with Indian Mobile (+91 OTP) */}
            <button
              type="button"
              disabled={isLoading}
              onClick={() => {
                setShowPhoneLogin(true);
                setErrorMsg("");
              }}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-[#141416] hover:bg-zinc-900 border border-zinc-800 text-zinc-100 font-semibold text-xs transition-all shadow-sm cursor-pointer disabled:opacity-50 hover:border-zinc-700 hover:scale-[1.01] active:scale-[0.99]"
            >
              <Phone className="size-4 text-emerald-400 shrink-0" />
              <span>Continue with Mobile (+91 OTP)</span>
            </button>
          </div>
        ) : (
          /* Indian Mobile Phone OTP Form */
          <div className="space-y-3.5 relative z-10 animate-in fade-in-50 duration-150">
            <button
              type="button"
              onClick={() => {
                setShowPhoneLogin(false);
                setOtpSent(false);
                setErrorMsg("");
              }}
              className="text-[11px] text-cyan-400 hover:underline cursor-pointer flex items-center gap-1"
            >
              ← Back to all options
            </button>

            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-3">
                <div>
                  <label className="block text-[10px] font-mono tracking-wider text-zinc-400 uppercase mb-1">
                    Enter Indian Mobile Number
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-xs font-bold text-white font-mono">
                      +91
                    </span>
                    <input
                      type="tel"
                      maxLength={10}
                      autoFocus
                      value={phoneNumber}
                      onChange={(e) =>
                        setPhoneNumber(e.target.value.replace(/[^0-9]/g, ""))
                      }
                      placeholder="98765 43210"
                      className="w-full pl-12 pr-3 py-2.5 rounded-xl border border-zinc-800 bg-zinc-900/90 text-xs font-mono font-medium text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 placeholder:text-zinc-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || phoneNumber.length < 10}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold text-xs transition-all shadow-md cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <>
                      <span>Send 6-Digit OTP</span>
                      <ArrowRight className="size-3.5" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[10px] font-mono tracking-wider text-zinc-400 uppercase">
                      Enter 6-Digit SMS OTP
                    </label>
                    <button
                      type="button"
                      onClick={() => setOtpSent(false)}
                      className="text-[10px] text-cyan-400 hover:underline cursor-pointer font-mono"
                    >
                      Change Number
                    </button>
                  </div>
                  <div className="relative flex items-center">
                    <Lock className="absolute left-3 size-3.5 text-zinc-400" />
                    <input
                      type="text"
                      maxLength={6}
                      autoFocus
                      value={otp}
                      onChange={(e) =>
                        setOtp(e.target.value.replace(/[^0-9]/g, ""))
                      }
                      placeholder="123456"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-zinc-800 bg-zinc-900/90 text-xs font-mono font-bold tracking-widest text-center text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                    />
                  </div>
                  <p className="text-[10px] text-zinc-400 mt-1 text-center font-mono">
                    Sent to +91 {phoneNumber}
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || otp.length < 6}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold text-xs transition-all shadow-md cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <span>Verify & Continue</span>
                  )}
                </button>
              </form>
            )}
          </div>
        )}

        {/* Remember Me for 7 Days Checkbox Option */}
        <div className="pt-1 relative z-10 flex items-center justify-center">
          <button
            type="button"
            onClick={() => setRememberMe(!rememberMe)}
            className="flex items-center gap-2 text-xs text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer select-none group"
          >
            <div
              className={`size-4 rounded-md border flex items-center justify-center transition-all ${
                rememberMe
                  ? "bg-cyan-500 border-cyan-500 text-zinc-950"
                  : "border-zinc-700 bg-zinc-900 group-hover:border-zinc-500"
              }`}
            >
              {rememberMe && <Check className="size-3 stroke-[3]" />}
            </div>
            <span className="font-medium text-[11px] tracking-wide">
              Remember me for 7 days
            </span>
          </button>
        </div>

        {/* Bottom Footer - Letter Spaced YOUR PRIVACY IS PROTECTED */}
        <div className="text-center pt-2 relative z-10 border-t border-zinc-800/80">
          <span className="text-[9px] sm:text-[10px] tracking-[0.28em] text-cyan-400/90 uppercase font-mono font-semibold drop-shadow-xs">
            Y O U R &nbsp; P R I V A C Y &nbsp; I S &nbsp; P R O T E C T E D
          </span>
        </div>
      </div>
    </div>
  );
}
