import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import AuthLayout from "../../components/AuthLayout";
import Button from "../../components/Button";
import api from "../../api/axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [devToken, setDevToken] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    try {
      const res = await api.post("/auth/forgot-password", { email: email.trim() });
      if (res.data.success) {
        setIsSubmitted(true);
        if (res.data.devResetToken) {
          setDevToken(res.data.devResetToken);
        }
        toast.success(res.data.message || "Reset link sent to your email!");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send reset email");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="Enter your academic email address and we'll send you instructions to reset your password."
    >
      <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none transition-colors duration-300">
        {!isSubmitted ? (
          <>
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Forgot Password</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                We'll email you a secure link and code to create a new password.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="name@university.edu"
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-slate-50 dark:bg-slate-800/50 focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full py-3" disabled={isLoading}>
                {isLoading ? "Sending Link..." : "Send Reset Link"}
              </Button>
            </form>
          </>
        ) : (
          <div className="text-center py-4 space-y-4">
            <div className="mx-auto w-14 h-14 bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-full flex items-center justify-center">
              <CheckCircle2 size={32} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Check your email</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
              We've sent a password reset link and verification code to <strong className="text-slate-900 dark:text-white">{email}</strong>.
            </p>

            {devToken && (
              <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-lg text-left text-xs space-y-1 border border-slate-200 dark:border-slate-700 mt-4">
                <span className="font-semibold text-slate-600 dark:text-slate-300">Quick Development Link:</span>
                <Link
                  to={`/reset-password/${devToken}`}
                  className="block text-primary-600 dark:text-primary-400 hover:underline break-all"
                >
                  Click here to proceed directly to Reset Password screen
                </Link>
              </div>
            )}
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft size={16} /> Back to Sign In
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
