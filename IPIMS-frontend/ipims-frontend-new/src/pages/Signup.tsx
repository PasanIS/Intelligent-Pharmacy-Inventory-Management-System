import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import logoImage from '../assets/images/ipims_logo.png';

const SignUpPage: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // -----Client-side validation
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const success = await signup(fullName, email, password, confirmPassword);
      if (success) {
        setSuccess('Sign up successful! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 2000); // ----Redirect after 2 seconds
      } else {
        setError('Sign up failed. Please try again.');
      }
    } catch (err) {
      setError('An error occurred during sign up.');
      console.error('Sign up failed:', err);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/20 via-slate-950 to-slate-950 pointer-events-none" />
      <div className="absolute -top-[20%] -right-[10%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-[20%] -left-[10%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <Card className="w-full max-w-lg border-slate-800 bg-slate-900/50 backdrop-blur-xl shadow-2xl relative z-10">
        <CardHeader className="space-y-4 text-center flex flex-col items-center">
          <div className="w-24 h-24 mb-2 relative">
            <img src={logoImage} alt="IPIMS Logo" className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(6,182,212,0.5)] rounded-lg" />
          </div>
          <div className="space-y-1">
            <h2 className="text-3xl font-bold tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
              Create Account
            </h2>
            <CardDescription className="text-slate-400 text-base">
              Join Intelligent Pharmacy Management System
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-slate-300">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="bg-slate-950/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-300">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-slate-950/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500/20"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-300">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-slate-950/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-slate-300">Confirm</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="bg-slate-950/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500/20"
                />
              </div>
            </div>

            {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-md text-center">{error}</div>}
            {success && <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm p-3 rounded-md text-center">{success}</div>}

            <Button type="submit" className="w-full bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 text-white font-bold py-5 shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] border-none mt-2">
              Create Account
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center border-t border-slate-800/50 p-6">
          <p className="text-sm text-slate-400">
            Already have an account?{" "}
            <Link to="/login" className="font-bold text-emerald-400 hover:text-emerald-300 transition-colors">
              Log in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignUpPage;