import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, User, Lock, WifiOff, Globe, LogIn } from "lucide-react";
import { PharmaIcon } from "@/components/ui/PharmaIcon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (username && password) {
      toast.success("تم تسجيل الدخول بنجاح");
      navigate("/dashboard");
    } else {
      toast.error("يرجى إدخال اسم المستخدم وكلمة المرور");
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Language Switcher */}
      <button className="absolute top-4 right-4 z-10 p-2 rounded-full bg-card border border-border shadow-soft hover:bg-muted transition-colors">
        <Globe className="w-5 h-5 text-muted-foreground" />
      </button>

      {/* Header Section */}
      <div className="pharma-header text-primary-foreground px-6 pt-12 pb-16 rounded-b-[2.5rem] relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-white/20 blur-3xl" />
        </div>
        
        <div className="relative z-10 flex flex-col items-center text-center">
          <PharmaIcon size="xl" className="mb-4" />
          <h1 className="text-2xl font-bold tracking-wide">ELNADY PHARMACIES</h1>
          <p className="text-primary-foreground/80 mt-1">PharmaLife System</p>
        </div>
      </div>

      {/* Login Form */}
      <div className="flex-1 px-6 -mt-8">
        <div className="pharma-card p-6 animate-slide-up">
          <h2 className="text-xl font-bold text-center mb-4">تسجيل الدخول</h2>
          
          {/* Offline Banner */}
          <div className="offline-banner mb-6">
            <WifiOff className="w-4 h-4" />
            <span>وضع غير متصل بالشبكة</span>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Username */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">اسم المستخدم</label>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="أدخل اسم المستخدم"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pharma-input pl-10 pr-12"
                />
                <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">كلمة المرور</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="أدخل كلمة المرور"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pharma-input px-12"
                />
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">
                  تذكرني
                </label>
              </div>
              <button type="button" className="text-sm text-primary hover:underline">
                نسيت كلمة المرور؟
              </button>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full pharma-btn-primary h-12 text-base font-semibold rounded-xl gap-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>تسجيل الدخول</span>
                  <LogIn className="w-5 h-5 rotate-180" />
                </>
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-border text-center">
            <p className="text-sm text-muted-foreground">PharmaLife v1.0.2</p>
            <p className="text-xs text-muted-foreground mt-1">© ELNADY PHARMACIES 2024</p>
          </div>
        </div>
      </div>
    </div>
  );
}
