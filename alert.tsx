import { useState, useEffect, useRef } from 'react';
import { 
  Eye, EyeOff, Mail, Lock, User, ArrowRight, Shield, 
  RefreshCw, CheckCircle, XCircle, Sparkles, Zap, KeyRound,
  Send, RotateCcw, LogOut, UserPlus, LogIn
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';

// User data storage (in-memory backend)
interface UserData {
  email: string;
  password: string;
  name: string;
}

const userDatabase: UserData[] = [
  { email: 'user@example.com', password: 'User@123', name: 'Demo User' }
];

// Mouse tracking hook
function useMousePosition() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  return mousePosition;
}

// Generate strong password
function generateStrongPassword(): string {
  const patterns = [
    () => 'Steve@' + Math.floor(100 + Math.random() * 900),
    () => 'Pika@' + Math.floor(1000 + Math.random() * 9000),
    () => 'Secure@' + Math.floor(100 + Math.random() * 900),
    () => 'Auth@' + Math.floor(1000 + Math.random() * 9000),
  ];
  return patterns[Math.floor(Math.random() * patterns.length)]();
}

// Generate CAPTCHA items
function generateCaptchaItems(): string[] {
  const words = ['PIKA', 'SAFE', 'LOCK', 'GUARD', 'SHIELD', 'SECURE'];
  const numbers = ['42', '88', '99', '77', '55', '33'];
  const items = [...words, ...numbers];
  return items.sort(() => Math.random() - 0.5).slice(0, 6);
}

// Generate 9x9 grid
function generateGrid(targetItems: string[]): string[] {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const grid: string[] = [];
  
  // Fill most cells with random chars
  for (let i = 0; i < 81; i++) {
    grid.push(chars[Math.floor(Math.random() * chars.length)]);
  }
  
  // Ensure target items are in the grid
  targetItems.forEach(item => {
    const chars = item.split('');
    chars.forEach(char => {
      const randomPos = Math.floor(Math.random() * 81);
      grid[randomPos] = char;
    });
  });
  
  return grid;
}

// Enhanced Pikachu Character Component with cursor tracking
function PikachuCharacter({ 
  isPasswordFocused, 
  mousePosition,
  isSignUpMode
}: { 
  isPasswordFocused: boolean; 
  mousePosition: { x: number; y: number };
  isSignUpMode: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });
  const [bounce, setBounce] = useState(0);

  useEffect(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Calculate rotation based on mouse position
      const rotateY = ((mousePosition.x - centerX) / window.innerWidth) * 30;
      const rotateX = ((centerY - mousePosition.y) / window.innerHeight) * 30;
      setRotation({ x: rotateX, y: rotateY });
      
      // Calculate eye tracking offset
      const eyeX = ((mousePosition.x - centerX) / window.innerWidth) * 15;
      const eyeY = ((mousePosition.y - centerY) / window.innerHeight) * 10;
      setEyeOffset({ x: eyeX, y: eyeY });
      
      // Bounce effect when mouse moves
      setBounce(Math.sin(Date.now() / 200) * 3);
    }
  }, [mousePosition]);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full flex items-center justify-center"
    >
      <div 
        className="relative transition-transform duration-100 ease-out"
        style={{
          transform: `
            perspective(1000px) 
            rotateX(${rotation.x}deg) 
            rotateY(${rotation.y}deg)
            translateY(${bounce}px)
            scale(${isSignUpMode ? 1.05 : 1})
          `,
        }}
      >
        {/* Glow effect */}
        <div 
          className={`absolute inset-0 blur-3xl rounded-full scale-150 transition-all duration-500 ${
            isSignUpMode ? 'bg-green-400/30' : 'bg-yellow-400/20'
          }`}
          style={{
            animation: 'pulse 2s ease-in-out infinite',
          }}
        />
        
        {/* Pikachu image container */}
        <div className="relative">
          <img 
            src={isPasswordFocused ? '/pikachu-closed.png' : '/pikachu-open.png'}
            alt="Pikachu"
            className="relative z-10 w-80 h-auto object-contain drop-shadow-2xl transition-all duration-300"
            style={{
              filter: isSignUpMode 
                ? 'drop-shadow(0 0 40px rgba(74, 222, 128, 0.6))' 
                : 'drop-shadow(0 0 30px rgba(234, 179, 8, 0.5))',
            }}
          />
          
          {/* Animated eyes that follow cursor (only when eyes are open) */}
          {!isPasswordFocused && (
            <>
              <div 
                className="absolute top-[28%] left-[32%] w-4 h-4 bg-black rounded-full transition-all duration-75"
                style={{
                  transform: `translate(${eyeOffset.x}px, ${eyeOffset.y}px)`,
                }}
              />
              <div 
                className="absolute top-[28%] left-[52%] w-4 h-4 bg-black rounded-full transition-all duration-75"
                style={{
                  transform: `translate(${eyeOffset.x}px, ${eyeOffset.y}px)`,
                }}
              />
            </>
          )}
        </div>
        
        {/* Electric sparkles */}
        {isPasswordFocused && (
          <>
            <Sparkles 
              className="absolute top-5 left-0 w-8 h-8 text-yellow-400 animate-bounce" 
              style={{ animationDelay: '0s' }}
            />
            <Zap 
              className="absolute top-16 right-0 w-6 h-6 text-yellow-300 animate-pulse" 
              style={{ animationDelay: '0.2s' }}
            />
            <Sparkles 
              className="absolute bottom-24 left-5 w-6 h-6 text-yellow-400 animate-pulse" 
              style={{ animationDelay: '0.4s' }}
            />
            <Zap 
              className="absolute top-1/3 left-[-20px] w-5 h-5 text-yellow-300 animate-bounce" 
              style={{ animationDelay: '0.6s' }}
            />
            <Sparkles 
              className="absolute bottom-1/3 right-[-15px] w-7 h-7 text-yellow-400 animate-pulse" 
              style={{ animationDelay: '0.8s' }}
            />
          </>
        )}
        
        {/* Welcome sparkles for sign up */}
        {isSignUpMode && (
          <>
            <Sparkles 
              className="absolute top-0 right-10 w-10 h-10 text-green-400 animate-bounce" 
              style={{ animationDelay: '0.1s' }}
            />
            <Sparkles 
              className="absolute bottom-10 left-0 w-8 h-8 text-green-300 animate-pulse" 
              style={{ animationDelay: '0.3s' }}
            />
            <Zap 
              className="absolute top-20 right-[-10px] w-6 h-6 text-green-400 animate-pulse" 
              style={{ animationDelay: '0.5s' }}
            />
          </>
        )}
      </div>
    </div>
  );
}

// 9x9 CAPTCHA Component
function CaptchaGrid({ 
  targetItems, 
  onVerify, 
  onCancel 
}: { 
  targetItems: string[]; 
  onVerify: (success: boolean) => void;
  onCancel: () => void;
}) {
  const [grid] = useState(() => generateGrid(targetItems));
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [foundItems, setFoundItems] = useState<Set<string>>(new Set());

  const handleCellClick = (index: number) => {
    const newSelected = new Set(selected);
    
    if (selected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelected(newSelected);
    
    // Check if any target item is fully selected
    targetItems.forEach(item => {
      const chars = item.split('');
      const selectedValues = Array.from(newSelected).map(i => grid[i]);
      const allCharsFound = chars.every(char => selectedValues.includes(char));
      
      if (allCharsFound && !foundItems.has(item)) {
        setFoundItems(prev => new Set([...prev, item]));
        toast.success(`Found: ${item}!`);
      }
    });
  };

  const handleVerify = () => {
    if (foundItems.size >= targetItems.length * 0.5) {
      toast.success('CAPTCHA verified successfully!');
      onVerify(true);
    } else {
      toast.error('CAPTCHA failed! Please find more items.');
      setSelected(new Set());
      setFoundItems(new Set());
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <p className="text-white mb-3 font-medium">Find these items in the grid:</p>
        <div className="flex flex-wrap justify-center gap-2">
          {targetItems.map((item, idx) => (
            <span 
              key={idx}
              className={`px-3 py-1.5 rounded-full text-sm font-bold transition-all ${
                foundItems.has(item) 
                  ? 'bg-green-500 text-white scale-110' 
                  : 'bg-yellow-500 text-black'
              }`}
            >
              {foundItems.has(item) && <CheckCircle className="w-3 h-3 inline mr-1" />}
              {item}
            </span>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-2">
          Click on cells to select. Find at least {Math.ceil(targetItems.length * 0.5)} items.
        </p>
      </div>
      
      <div className="grid grid-cols-9 gap-1 p-4 bg-black/50 rounded-lg border border-yellow-500/30">
        {grid.map((char, index) => (
          <button
            key={index}
            onClick={() => handleCellClick(index)}
            className={`w-8 h-8 text-xs font-mono font-bold rounded transition-all duration-150 ${
              selected.has(index)
                ? 'bg-yellow-500 text-black scale-110 shadow-lg shadow-yellow-500/50'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:scale-105'
            }`}
          >
            {char}
          </button>
        ))}
      </div>
      
      <div className="flex gap-3 justify-center">
        <Button 
          onClick={handleVerify}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          Verify
        </Button>
        <Button 
          onClick={onCancel}
          variant="outline"
          className="border-red-500 text-red-500 hover:bg-red-500/10"
        >
          <XCircle className="w-4 h-4 mr-2" />
          Cancel
        </Button>
      </div>
    </div>
  );
}

// Main App Component
function App() {
  const mousePosition = useMousePosition();
  
  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Auth mode: 'signin' or 'signup'
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  
  // Flow states
  const [currentView, setCurrentView] = useState<'auth' | 'forgot' | 'otp' | 'captcha' | 'reset' | 'success'>('auth');
  
  // Forgot password states
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [captchaItems, setCaptchaItems] = useState<string[]>([]);
  const [newPassword, setNewPassword] = useState('');
  const [suggestedPassword, setSuggestedPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');

  // Generate OTP
  const generateOTP = () => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otp);
    return otp;
  };

  // Handle sign in
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const user = userDatabase.find(u => u.email === email && u.password === password);
    
    if (user) {
      setIsLoggedIn(true);
      setUserName(user.name);
      toast.success(`Welcome back, ${user.name}!`);
    } else {
      toast.error('Invalid email or password!');
    }
    
    setIsLoading(false);
  };

  // Handle sign up
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Check if user already exists
    const existingUser = userDatabase.find(u => u.email === email);
    if (existingUser) {
      toast.error('User already exists! Please sign in instead.');
      setIsLoading(false);
      return;
    }
    
    // Add new user to database
    userDatabase.push({ email, password, name });
    
    setIsLoggedIn(true);
    setUserName(name);
    toast.success(`Welcome, ${name}! Your account has been created.`);
    
    setIsLoading(false);
  };

  // Handle forgot password
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email address!');
      return;
    }
    
    const user = userDatabase.find(u => u.email === email);
    if (!user) {
      toast.error('Email not found in our records!');
      return;
    }
    
    const otp = generateOTP();
    toast.info(
      <div className="space-y-2">
        <p className="font-bold">OTP Sent to your email!</p>
        <p className="text-sm">Your verification code is: <span className="font-mono text-yellow-400 text-lg">{otp}</span></p>
        <p className="text-xs text-gray-400">(In a real app, this would be sent via email)</p>
      </div>,
      { duration: 10000 }
    );
    
    setCurrentView('otp');
  };

  // Handle OTP verification
  const handleOtpVerify = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (otp === generatedOtp) {
      toast.success('OTP verified successfully!');
      setCaptchaItems(generateCaptchaItems());
      setCurrentView('captcha');
    } else {
      toast.error('Invalid OTP! Please try again.');
    }
  };

  // Handle CAPTCHA verification
  const handleCaptchaVerify = (success: boolean) => {
    if (success) {
      toast.success('CAPTCHA verified! Create your new password.');
      setSuggestedPassword(generateStrongPassword());
      setCurrentView('reset');
    }
  };

  // Handle password reset
  const handlePasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters!');
      return;
    }
    
    // Update user password
    const userIndex = userDatabase.findIndex(u => u.email === email);
    if (userIndex !== -1) {
      userDatabase[userIndex].password = newPassword;
    }
    
    toast.success('Password reset successful! Please sign in with your new password.');
    setCurrentView('auth');
    setAuthMode('signin');
    setPassword('');
    setOtp('');
    setNewPassword('');
  };

  // Handle logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserName('');
    setEmail('');
    setPassword('');
    setName('');
    toast.info('You have been logged out.');
  };

  // Switch between sign in and sign up
  const toggleAuthMode = () => {
    setAuthMode(prev => prev === 'signin' ? 'signup' : 'signin');
    setEmail('');
    setPassword('');
    setName('');
  };

  // Background particles
  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 1,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5,
  }));

  if (isLoggedIn) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
        {/* Background particles */}
        {particles.map(p => (
          <div
            key={p.id}
            className="absolute rounded-full bg-yellow-400/20"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              animation: `float ${p.duration}s ease-in-out ${p.delay}s infinite`,
            }}
          />
        ))}
        
        <Card className="w-full max-w-md mx-4 bg-black/80 border-yellow-500/30 backdrop-blur-xl">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <img 
                src="/pikachu-open.png" 
                alt="Welcome" 
                className="w-32 h-auto mx-auto rounded-full border-4 border-yellow-500"
              />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Welcome, {userName}!</h2>
            <p className="text-gray-400 mb-6">You have successfully logged in.</p>
            <Button 
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </CardContent>
        </Card>
        
        <Toaster />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
      {/* Animated background gradient following cursor */}
      <div 
        className="absolute inset-0 opacity-30 transition-all duration-300"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(234, 179, 8, 0.4) 0%, transparent 50%)`,
        }}
      />
      
      {/* Floating particles */}
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute rounded-full bg-yellow-400/20"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animation: `float ${p.duration}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}
      
      {/* Main content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 py-8 flex flex-col lg:flex-row items-center justify-center gap-8">
        
        {/* Left side - Form */}
        <Card 
          className="w-full max-w-md bg-black/80 border-yellow-500/30 backdrop-blur-xl"
          style={{
            transform: `perspective(1000px) rotateY(${(mousePosition.x - window.innerWidth / 2) / 100}deg) rotateX(${(window.innerHeight / 2 - mousePosition.y) / 100}deg)`,
            transition: 'transform 0.1s ease-out',
          }}
        >
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                authMode === 'signup' ? 'bg-green-500' : 'bg-yellow-500'
              }`}>
                {authMode === 'signup' ? (
                  <UserPlus className="w-8 h-8 text-black" />
                ) : (
                  <Zap className="w-8 h-8 text-black" />
                )}
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-white">
              {currentView === 'auth' && (authMode === 'signin' ? 'Welcome Back' : 'Create Account')}
              {currentView === 'forgot' && 'Forgot Password'}
              {currentView === 'otp' && 'Verify OTP'}
              {currentView === 'captcha' && 'Human Verification'}
              {currentView === 'reset' && 'Reset Password'}
            </CardTitle>
            <CardDescription className="text-gray-400">
              {currentView === 'auth' && (authMode === 'signin' ? 'Sign in to your account' : 'Create a new account')}
              {currentView === 'forgot' && 'Enter your email to receive OTP'}
              {currentView === 'otp' && 'Enter the 6-digit code sent to your email'}
              {currentView === 'captcha' && 'Complete the CAPTCHA to continue'}
              {currentView === 'reset' && 'Create a strong new password'}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {/* Auth Form (Sign In / Sign Up) */}
            {currentView === 'auth' && (
              <form onSubmit={authMode === 'signin' ? handleSignIn : handleSignUp} className="space-y-4">
                {/* Name field for Sign Up */}
                {authMode === 'signup' && (
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-300 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 focus:border-green-500"
                      required
                    />
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-300 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 ${
                      authMode === 'signup' ? 'focus:border-green-500' : 'focus:border-yellow-500'
                    }`}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-300 flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setIsPasswordFocused(true)}
                      onBlur={() => setIsPasswordFocused(false)}
                      className={`bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 pr-10 ${
                        authMode === 'signup' ? 'focus:border-green-500' : 'focus:border-yellow-500'
                      }`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                
                {/* Forgot Password - Only for Sign In */}
                {authMode === 'signin' && (
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setCurrentView('forgot')}
                      className="text-sm text-yellow-500 hover:text-yellow-400 transition-colors"
                    >
                      Forgot Password?
                    </button>
                  </div>
                )}
                
                <Button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full font-bold ${
                    authMode === 'signup' 
                      ? 'bg-green-500 hover:bg-green-600 text-black' 
                      : 'bg-yellow-500 hover:bg-yellow-600 text-black'
                  }`}
                >
                  {isLoading ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : authMode === 'signup' ? (
                    <UserPlus className="w-4 h-4 mr-2" />
                  ) : (
                    <LogIn className="w-4 h-4 mr-2" />
                  )}
                  {isLoading 
                    ? (authMode === 'signup' ? 'Creating account...' : 'Signing in...') 
                    : (authMode === 'signup' ? 'Sign Up' : 'Sign In')
                  }
                </Button>
                
                {/* Toggle between Sign In and Sign Up */}
                <div className="text-center pt-2">
                  <p className="text-gray-400 text-sm">
                    {authMode === 'signin' ? "Don't have an account?" : "Already have an account?"}
                    <button
                      type="button"
                      onClick={toggleAuthMode}
                      className={`ml-2 font-medium transition-colors ${
                        authMode === 'signin' 
                          ? 'text-green-500 hover:text-green-400' 
                          : 'text-yellow-500 hover:text-yellow-400'
                      }`}
                    >
                      {authMode === 'signin' ? 'Sign Up' : 'Sign In'}
                    </button>
                  </p>
                </div>
              </form>
            )}
            
            {/* Forgot Password Form */}
            {currentView === 'forgot' && (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="forgot-email" className="text-gray-300 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email Address
                  </Label>
                  <Input
                    id="forgot-email"
                    type="email"
                    placeholder="Enter your registered email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 focus:border-yellow-500"
                    required
                  />
                </div>
                
                <Button
                  type="submit"
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send OTP
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentView('auth')}
                  className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
                  Back to Sign In
                </Button>
              </form>
            )}
            
            {/* OTP Verification */}
            {currentView === 'otp' && (
              <form onSubmit={handleOtpVerify} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp" className="text-gray-300 flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Enter OTP
                  </Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="000000"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 focus:border-yellow-500 text-center text-2xl tracking-widest"
                    maxLength={6}
                    required
                  />
                </div>
                
                <Button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Verify OTP
                </Button>
                
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      const newOtp = generateOTP();
                      toast.info(
                        <div>
                          <p>New OTP: <span className="font-mono text-yellow-400 text-lg">{newOtp}</span></p>
                        </div>,
                        { duration: 10000 }
                      );
                    }}
                    className="flex-1 border-yellow-500 text-yellow-500 hover:bg-yellow-500/10"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Resend OTP
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentView('auth')}
                    className="flex-1 border-red-500 text-red-500 hover:bg-red-500/10"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </form>
            )}
            
            {/* CAPTCHA */}
            {currentView === 'captcha' && (
              <CaptchaGrid
                targetItems={captchaItems}
                onVerify={handleCaptchaVerify}
                onCancel={() => setCurrentView('auth')}
              />
            )}
            
            {/* Reset Password */}
            {currentView === 'reset' && (
              <form onSubmit={handlePasswordReset} className="space-y-4">
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="text-sm text-yellow-400 mb-2 flex items-center gap-2">
                    <KeyRound className="w-4 h-4" />
                    Suggested Strong Password:
                  </p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 bg-black/50 px-3 py-2 rounded text-yellow-300 font-mono">
                      {suggestedPassword}
                    </code>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setNewPassword(suggestedPassword);
                        toast.success('Password applied!');
                      }}
                      className="border-green-500 text-green-500 hover:bg-green-500/10"
                    >
                      Use
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setSuggestedPassword(generateStrongPassword())}
                      className="border-yellow-500 text-yellow-500 hover:bg-yellow-500/10"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="new-password" className="text-gray-300 flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    New Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="new-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter strong password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 focus:border-yellow-500 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                
                <Button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Reset Password
                </Button>
                
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentView('captcha')}
                    className="flex-1 border-yellow-500 text-yellow-500 hover:bg-yellow-500/10"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Try Again
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentView('auth')}
                    className="flex-1 border-red-500 text-red-500 hover:bg-red-500/10"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Bye Bye
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
        
        {/* Right side - Pikachu */}
        <div className="hidden lg:block w-96 h-[500px]">
          <PikachuCharacter 
            isPasswordFocused={isPasswordFocused}
            mousePosition={mousePosition}
            isSignUpMode={authMode === 'signup'}
          />
        </div>
      </div>
      
      {/* Footer with contact info */}
      <footer className="absolute bottom-0 left-0 right-0 py-4 px-4 bg-black/50 backdrop-blur-sm border-t border-yellow-500/20">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-yellow-500" />
            <span>For contact: <a href="mailto:changovindaraj@gmail.com" className="text-yellow-500 hover:underline">changovindaraj@gmail.com</a></span>
          </div>
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-yellow-500" />
            <span>Address: PES University</span>
          </div>
          <div className="text-xs">
            For further enquiry, please reach out via email
          </div>
        </div>
      </footer>
      
      {/* CSS Animations */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0.2;
          }
          25% {
            transform: translateY(-20px) translateX(10px);
            opacity: 0.5;
          }
          50% {
            transform: translateY(-10px) translateX(-10px);
            opacity: 0.3;
          }
          75% {
            transform: translateY(-30px) translateX(5px);
            opacity: 0.4;
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 0.5;
            transform: scale(1.5);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.7);
          }
        }
      `}</style>
      
      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            background: '#1a1a1a',
            color: '#fff',
            border: '1px solid rgba(234, 179, 8, 0.3)',
          },
        }}
      />
    </div>
  );
}

export default App;
