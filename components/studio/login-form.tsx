"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/client";
import { isAdminEmail } from "@/lib/auth/admin";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"email" | "code">("email");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function sendCode(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!isAdminEmail(email)) {
      setError("This address is not authorized. Studio is for the administrator only.");
      return;
    }
    setBusy(true);
    try {
      const result = await authClient.emailOtp.sendVerificationOtp({ email: email.trim().toLowerCase(), type: "sign-in" });
      if (result.error) setError("Could not send a code. Please try again in a minute.");
      else setStep("code");
    } catch {
      setError("Could not send a code. Please try again in a minute.");
    } finally {
      setBusy(false);
    }
  }

  async function verifyCode(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!/^\d{6}$/.test(otp)) {
      setError("Enter the six-digit code from your email.");
      return;
    }
    setBusy(true);
    try {
      const result = await authClient.signIn.emailOtp({ email: email.trim().toLowerCase(), otp });
      if (result.error) {
        setError("Invalid or expired code. Check your email and try again.");
        return;
      }
      router.replace("/studio");
      router.refresh();
    } catch {
      setError("Sign-in failed. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return <div className="login-form">
    <p className="eyebrow">PRIVATE ACCESS</p>
    <h1>Studio</h1>
    <p className="studio-login-note">This area is for admin purposes only. Only the museum owner can sign in.</p>
    {step === "email" ? <form onSubmit={sendCode}>
      <div className="field"><label htmlFor="email">Admin email</label><input id="email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoFocus /></div>
      {error && <p role="alert" className="form-error">{error}</p>}
      <button className="studio-action" type="submit" disabled={busy}>{busy ? "SENDING CODE…" : "EMAIL ME A CODE"}</button>
    </form> : <form onSubmit={verifyCode}>
      <p className="studio-code-note">A six-digit code was sent to {email.trim().toLowerCase()}. It expires in five minutes.</p>
      <div className="field"><label htmlFor="otp">Six-digit code</label><input id="otp" type="text" inputMode="numeric" pattern="[0-9]{6}" autoComplete="one-time-code" maxLength={6} value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, ""))} required autoFocus /></div>
      {error && <p role="alert" className="form-error">{error}</p>}
      <div className="form-actions"><button className="studio-action" type="submit" disabled={busy}>{busy ? "VERIFYING…" : "ENTER STUDIO"}</button><button className="studio-text-button" type="button" onClick={() => { setStep("email"); setOtp(""); setError(""); }}>CHANGE EMAIL</button></div>
    </form>}
  </div>;
}
