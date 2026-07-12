import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { loginSchema, type LoginInput } from '../schemas';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { Mail, Lock, LogIn, ArrowRight } from 'lucide-react';
import loginCar from '../assets/login_car.png';
export const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setSubmitting(true);
    try {
      await login(data);
      toast.success('Logged in successfully!');
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || 'Invalid email or password');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070b13] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden font-sans">
      {/* Background glow backdrops */}
      <div className="absolute w-96 h-96 rounded-full bg-brand-600/10 blur-[100px] -top-24 -left-24 pointer-events-none" />
      <div className="absolute w-96 h-96 rounded-full bg-indigo-600/10 blur-[100px] -bottom-24 -right-24 pointer-events-none" />

      {/* Split glassmorphic card container */}
      <div className="w-full max-w-4xl bg-neutral-900/40 border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row backdrop-blur-xl animate-fade-in relative z-10">
        
        {/* Left Side: Brand Banner (Solid dark theme with hypercar asset) */}
        <div className="w-full md:w-[45%] bg-[#0b1329]/95 p-8 flex flex-col justify-between relative overflow-hidden text-left min-h-[240px] md:min-h-[460px] border-b md:border-b-0 md:border-r border-white/5">
          {/* Subtle logo banner glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.1),transparent_50%)] pointer-events-none" />
          
          <div className="relative z-10 space-y-2">
            <span className="inline-flex px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest bg-brand-500/20 text-brand-300 border border-brand-500/30">
              Access Portal
            </span>
            <h2 className="text-2xl font-black text-white tracking-tight">Welcome Back!</h2>
            <p className="text-neutral-400 text-xs leading-relaxed max-w-[220px]">
              Login to access customized spec sheets and process secure transactions.
            </p>
          </div>

          <div className="relative z-10 mt-6 md:mt-0 flex justify-center">
            <img 
              src={loginCar} 
              alt="Welcome Car" 
              className="w-full max-w-[180px] md:max-w-none h-auto object-contain filter drop-shadow-[0_15px_30px_rgba(99,102,241,0.25)] transition-transform duration-500 hover:scale-103"
            />
          </div>
        </div>

        {/* Right Side: Form Content (Interactive Dark inputs) */}
        <div className="w-full md:w-[55%] p-8 sm:p-10 flex flex-col justify-center text-left bg-[#0f172a]/30 text-white">
          
          <div className="mb-6">
            <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-white to-brand-400 bg-clip-text text-transparent">
              Login
            </h1>
            <p className="text-xs text-neutral-400 mt-1">CarVanta Dealership Portal</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-neutral-450">
                  <Mail className="h-4 w-4" />
                </span>
                <input
                  type="email"
                  placeholder="Enter your email"
                  {...register('email')}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-10 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-brand-500 focus:bg-white/10 focus:ring-1 focus:ring-brand-500/35 transition-all duration-200"
                />
              </div>
              {errors.email && (
                <p className="text-[10px] text-red-400 mt-1 font-semibold">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                  Password
                </label>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-neutral-450">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  type="password"
                  placeholder="Enter your password"
                  {...register('password')}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-10 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-brand-500 focus:bg-white/10 focus:ring-1 focus:ring-brand-500/35 transition-all duration-200"
                />
              </div>
              {errors.password && (
                <p className="text-[10px] text-red-400 mt-1 font-semibold">{errors.password.message}</p>
              )}
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center">
              <input
                id="remember_me"
                type="checkbox"
                className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-white/10 bg-white/5 rounded cursor-pointer"
              />
              <label htmlFor="remember_me" className="ml-2 block text-xs text-neutral-400 select-none cursor-pointer hover:text-white transition-colors">
                Keep me logged in
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-brand-600 hover:bg-brand-500 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg shadow-brand-600/20 transition-all duration-200 active:scale-95 mt-2"
            >
              {submitting ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </>
              )}
            </button>
          </form>

          {/* Bottom Redirect */}
          <div className="mt-8 pt-5 border-t border-white/5 text-center">
            <p className="text-xs text-neutral-400">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="text-brand-400 hover:text-brand-350 font-bold inline-flex items-center space-x-1"
              >
                <span>Register here</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
