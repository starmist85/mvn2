import { useState } from "react";
import { X, Mail, Lock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";

type LoginStep = "login" | "forgot-password" | "reset-password";

interface LoginModalProps {
  onClose: () => void;
}

export default function LoginModal({ onClose }: LoginModalProps) {
  const [step, setStep] = useState<LoginStep>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Note: These mutations would need to be implemented in your backend
  // For now, we'll show the UI structure
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Redirect to Manus OAuth login
    window.location.href = getLoginUrl();
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // This would send a password reset email
      setSuccess("If an account exists with this email, you will receive a password reset link.");
      setEmail("");
      setTimeout(() => {
        setStep("login");
        setSuccess("");
      }, 3000);
    } catch (err) {
      setError("Failed to send reset email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setIsLoading(true);

    try {
      // This would verify the reset code and update the password
      setSuccess("Password reset successfully! Redirecting to login...");
      setEmail("");
      setResetCode("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        setStep("login");
        setSuccess("");
      }, 2000);
    } catch (err) {
      setError("Failed to reset password. Please check your reset code and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-bold">
            {step === "login" && "Admin Login"}
            {step === "forgot-password" && "Reset Password"}
            {step === "reset-password" && "Set New Password"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-muted rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Error Message */}
          {error && (
            <div className="p-3 bg-destructive/10 text-destructive rounded text-sm">
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="p-3 bg-green-500/10 text-green-500 rounded text-sm">
              {success}
            </div>
          )}

          {/* Login Form */}
          {step === "login" && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full">
                Login with Manus OAuth
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                You will be redirected to the Manus login portal. Use your Manus account credentials to log in.
              </p>
            </form>
          )}

          {/* Forgot Password Form */}
          {step === "forgot-password" && (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Password reset is managed through your Manus account. Please visit the Manus portal to reset your password.
              </p>

              <Button 
                onClick={() => window.open(import.meta.env.VITE_OAUTH_PORTAL_URL, '_blank')}
                className="w-full"
              >
                Go to Manus Portal
              </Button>

              <button
                type="button"
                onClick={() => {
                  setStep("login");
                  setError("");
                }}
                className="w-full flex items-center justify-center gap-2 text-sm text-accent hover:underline"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </button>
            </form>
          )}


        </div>
      </div>
    </div>
  );
}
