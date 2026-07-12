import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { registerSchema, type RegisterInput } from '../schemas';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { Mail, Lock, User as UserIcon, UserPlus, ArrowLeft } from 'lucide-react';
import registerCar from '../assets/register_car.png';

export const Register: React.FC = () => {
  const { register: registerApi } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'USER',
    },
  });

  const onSubmit = async (data: RegisterInput) => {
    setSubmitting(true);
    try {
      await registerApi(data);
      toast.success('Registration successful! Please login.');
      navigate('/login');
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
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
        
        {/* Left Side: Brand Banner */}
        <div className="w-full md:w-[45%] bg-[#0b1329]/95 p-8 flex flex-col justify-between relative overflow-hidden text-left min-h-[240px] md:min-h-[460px] border-b md:border-b-0 md:border-r border-white/5">
          {/* Subtle logo banner glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.1),transparent_50%)] pointer-events-none" />
          
          <div className="relative z-10 space-y-2">
            <span className="inline-flex px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest bg-brand-500/20 text-brand-300 border border-brand-500/30">
              Registration
            </span>
            <h2 className="text-2xl font-black text-white tracking-tight">Create Account</h2>
            <p className="text-neutral-400 text-xs leading-relaxed max-w-[220px]">
              Register to join the CarVanta community and explore premium showroom details.
            </p>
          </div>

          <div className="relative z-10 mt-6 md:mt-0 flex justify-center">
            <img 
              src={registerCar} 
              alt="Register Car" 
              className="w-full max-w-[180px] md:max-w-none h-auto object-contain filter drop-shadow-[0_15px_30px_rgba(99,102,241,0.25)] transition-transform duration-500 hover:scale-103"
            />
          </div>
        </div>

        {/* Right Side: Form Content (Interactive Dark inputs) */}
        <div className="w-full md:w-[55%] p-8 sm:p-10 flex flex-col justify-center text-left bg-[#0f172a]/30 text-white">
          
          <div className="mb-6">
            <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-white to-brand-400 bg-clip-text text-transparent">
              Register
            </h1>
            <p className="text-xs text-neutral-400 mt-1">Create your dealership portal account</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                Full Name
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-neutral-450">
                  <UserIcon className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  {...register('name')}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-10 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-brand-500 focus:bg-white/10 focus:ring-1 focus:ring-brand-500/35 transition-all duration-200"
                />
              </div>
              {errors.name && (
                <p className="text-[10px] text-red-400 mt-1 font-semibold">{errors.name.message}</p>
              )}
            </div>

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
              <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-neutral-450">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  type="password"
                  placeholder="Min. 6 characters"
                  {...register('password')}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-10 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-brand-500 focus:bg-white/10 focus:ring-1 focus:ring-brand-500/35 transition-all duration-200"
                />
              </div>
              {errors.password && (
                <p className="text-[10px] text-red-400 mt-1 font-semibold">{errors.password.message}</p>
              )}
            </div>

            {/* Account Role */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                Account Role
              </label>
              <select
                {...register('role')}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-500 focus:bg-white/10 focus:ring-1 focus:ring-brand-500/35 transition-all duration-200 cursor-pointer"
              >
                <option value="USER" className="bg-[#0b1329] text-white">Standard Client (USER)</option>
                <option value="ADMIN" className="bg-[#0b1329] text-white">Inventory Manager (ADMIN)</option>
              </select>
              {errors.role && (
                <p className="text-[10px] text-red-400 mt-1 font-semibold">{errors.role.message}</p>
              )}
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
                  <UserPlus className="w-4 h-4" />
                  <span>Register</span>
                </>
              )}
            </button>
          </form>

          {/* Bottom Redirect */}
          <div className="mt-6 pt-5 border-t border-white/5 text-center">
            <Link
              to="/login"
              className="text-xs text-neutral-400 hover:text-white font-bold inline-flex items-center space-x-2 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to login</span>
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
};
