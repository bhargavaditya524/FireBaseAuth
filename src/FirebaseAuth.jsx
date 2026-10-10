/**
 * ─────────────────────────────────────────────────────────────
 *  FIREBASE AUTHENTICATION COMPONENT
 *  Features: Login · Register · Forgot Password
 *  Routing:  React Router v6 — redirects to "/" on success
 * ─────────────────────────────────────────────────────────────
 */


import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "./firebase";

const friendlyError = (code) => {
  const map = {
    "auth/user-not-found":         "No account found with this email.",
    "auth/wrong-password":         "Incorrect password. Please try again.",
    "auth/email-already-in-use":   "An account with this email already exists.",
    "auth/weak-password":          "Password must be at least 6 characters.",
    "auth/invalid-email":          "Please enter a valid email address.",
    "auth/too-many-requests":      "Too many attempts. Please try again later.",
    "auth/network-request-failed": "Network error. Check your connection.",
  };
  return map[code] ?? "Something went wrong. Please try again.";
};

const S = {
  overlay: {
    minHeight: "100vh", display: "flex", alignItems: "center",
    justifyContent: "center", background: "#f8f8f6",
    fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif", padding: "24px",
  },
  card: {
    background: "#ffffff", borderRadius: "16px", padding: "48px 44px 40px",
    width: "100%", maxWidth: "400px",
    boxShadow: "0 2px 24px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.04)",
  },
  logo: {
    width: 40, height: 40, background: "#111", borderRadius: "10px",
    display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "28px",
  },
  logoText: { color: "#fff", fontWeight: 700, fontSize: 18 },
  heading: { fontSize: "22px", fontWeight: 700, color: "#111", margin: "0 0 6px", letterSpacing: "-0.3px" },
  subheading: { fontSize: "14px", color: "#888", margin: "0 0 32px" },
  label: { display: "block", fontSize: "13px", fontWeight: 600, color: "#444", marginBottom: "6px" },
  input: {
    width: "100%", padding: "11px 14px", fontSize: "14px",
    border: "1.5px solid #e5e5e5", borderRadius: "9px", outline: "none",
    background: "#fafafa", color: "#111", boxSizing: "border-box", transition: "border-color .15s",
  },
  inputFocus: { borderColor: "#111" },
  fieldWrap: { marginBottom: "16px" },
  btn: {
    width: "100%", padding: "12px", background: "#111", color: "#fff",
    border: "none", borderRadius: "9px", fontSize: "14px", fontWeight: 600,
    cursor: "pointer", marginTop: "8px", transition: "opacity .15s",
  },
  btnDisabled: { opacity: 0.55, cursor: "not-allowed" },
  error: {
    background: "#fff1f1", border: "1px solid #ffd0d0", color: "#c0392b",
    borderRadius: "8px", padding: "10px 12px", fontSize: "13px", marginBottom: "16px",
  },
  success: {
    background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#166534",
    borderRadius: "8px", padding: "10px 12px", fontSize: "13px", marginBottom: "16px",
  },
  link: {
    background: "none", border: "none", color: "#111", fontWeight: 600,
    fontSize: "13px", cursor: "pointer", padding: 0,
    textDecoration: "underline", textUnderlineOffset: "3px",
  },
  footer: {
    textAlign: "center", marginTop: "24px", fontSize: "13px", color: "#888",
    display: "flex", gap: "4px", justifyContent: "center", flexWrap: "wrap",
  },
  divider: { margin: "20px 0", border: "none", borderTop: "1px solid #ebebeb" },
};

function Input({ label, type = "text", value, onChange, placeholder, autoComplete }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={S.fieldWrap}>
      {label && <label style={S.label}>{label}</label>}
      <input
        type={type} value={value} onChange={onChange}
        placeholder={placeholder} autoComplete={autoComplete}
        style={{ ...S.input, ...(focused ? S.inputFocus : {}) }}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
      />
    </div>
  );
}

function LoginView({ onSwitch }) {
  const navigate = useNavigate();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const handleLogin = async () => {
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setError(""); setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/home");           // ✅ redirect to home on login
    } catch (e) {
      setError(friendlyError(e.code));
    } finally { setLoading(false); }
  };

  return (
    <>
      <div style={S.logo}><span style={S.logoText}>A</span></div>
      <h1 style={S.heading}>Welcome back</h1>
      <p style={S.subheading}>Sign in to your account to continue.</p>
      {error && <div style={S.error}>{error}</div>}
      <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)}
        placeholder="you@example.com" autoComplete="email" />
      <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)}
        placeholder="••••••••" autoComplete="current-password" />
      <div style={{ textAlign: "right", marginTop: "-8px", marginBottom: "16px" }}>
        <button style={S.link} onClick={() => onSwitch("forgot")}>Forgot password?</button>
      </div>
      <button style={{ ...S.btn, ...(loading ? S.btnDisabled : {}) }} onClick={handleLogin} disabled={loading}>
        {loading ? "Signing in…" : "Sign in"}
      </button>
      <div style={S.footer}>
        <span>Don't have an account?</span>
        <button style={S.link} onClick={() => onSwitch("register")}>Create one</button>
      </div>
    </>
  );
}

function RegisterView({ onSwitch }) {
  const navigate = useNavigate();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm]   = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const handleRegister = async () => {
    if (!email || !password || !confirm) { setError("Please fill in all fields."); return; }
    if (password !== confirm)            { setError("Passwords do not match."); return; }
    if (password.length < 6)             { setError("Password must be at least 6 characters."); return; }
    setError(""); setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/");           // ✅ redirect to home on register
    } catch (e) {
      setError(friendlyError(e.code));
    } finally { setLoading(false); }
  };

  return (
    <>
      <div style={S.logo}><span style={S.logoText}>A</span></div>
      <h1 style={S.heading}>Create an account</h1>
      <p style={S.subheading}>Start by entering your details below.</p>
      {error && <div style={S.error}>{error}</div>}
      <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)}
        placeholder="you@example.com" autoComplete="email" />
      <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)}
        placeholder="Min. 6 characters" autoComplete="new-password" />
      <Input label="Confirm Password" type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
        placeholder="Repeat password" autoComplete="new-password" />
      <button style={{ ...S.btn, ...(loading ? S.btnDisabled : {}) }} onClick={handleRegister} disabled={loading}>
        {loading ? "Creating account…" : "Create account"}
      </button>
      <div style={S.footer}>
        <span>Already have an account?</span>
        <button style={S.link} onClick={() => onSwitch("login")}>Sign in</button>
      </div>
    </>
  );
}

function ForgotView({ onSwitch }) {
  const [email, setEmail]     = useState("");
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!email) { setError("Please enter your email address."); return; }
    setError(""); setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess("Reset link sent! Check your inbox (and spam folder).");
    } catch (e) {
      setError(friendlyError(e.code));
    } finally { setLoading(false); }
  };

  return (
    <>
      <div style={S.logo}><span style={S.logoText}>A</span></div>
      <h1 style={S.heading}>Reset password</h1>
      <p style={S.subheading}>We'll email you a link to reset your password.</p>
      {error   && <div style={S.error}>{error}</div>}
      {success && <div style={S.success}>{success}</div>}
      {!success && (
        <>
          <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com" autoComplete="email" />
          <button style={{ ...S.btn, ...(loading ? S.btnDisabled : {}) }} onClick={handleReset} disabled={loading}>
            {loading ? "Sending…" : "Send reset link"}
          </button>
        </>
      )}
      <hr style={S.divider} />
      <div style={S.footer}>
        <button style={S.link} onClick={() => onSwitch("login")}>← Back to sign in</button>
      </div>
    </>
  );
}

export default function FirebaseAuth({ initialView = "login" }) {
  const [view, setView] = useState(initialView);
  return (
    <div style={S.overlay}>
      <div style={S.card}>
        {view === "login"    && <LoginView    onSwitch={setView} />}
        {view === "register" && <RegisterView onSwitch={setView} />}
        {view === "forgot"   && <ForgotView   onSwitch={setView} />}
      </div>
    </div>
  );
}
