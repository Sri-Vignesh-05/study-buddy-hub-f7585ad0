import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Stethoscope, Heart, Sparkles, Mail, Lock, User, Calendar } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { z } from 'zod';

const signInSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

const signUpSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name is too long'),
  age: z.number().min(14, 'Age must be at least 14').max(30, 'Age must be at most 30')
});

const Auth = () => {
  const navigate = useNavigate();
  const { session, loading, signIn, signUp } = useAuth();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('signin');
  
  // Sign In form
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  
  // Sign Up form
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpName, setSignUpName] = useState('');
  const [signUpAge, setSignUpAge] = useState('');

  useEffect(() => {
    if (!loading && session) {
      navigate('/');
    }
  }, [session, loading, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = signInSchema.safeParse({
      email: signInEmail,
      password: signInPassword
    });

    if (!validation.success) {
      toast.error(validation.error.errors[0].message);
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await signIn(signInEmail, signInPassword);
      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          toast.error('Invalid email or password');
        } else {
          toast.error(error.message);
        }
      } else {
        toast.success('Welcome back!');
        navigate('/');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const ageNum = parseInt(signUpAge);
    const validation = signUpSchema.safeParse({
      email: signUpEmail,
      password: signUpPassword,
      name: signUpName,
      age: ageNum
    });

    if (!validation.success) {
      toast.error(validation.error.errors[0].message);
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await signUp(signUpEmail, signUpPassword, signUpName, ageNum);
      if (error) {
        if (error.message.includes('already registered')) {
          toast.error('This email is already registered. Please sign in instead.');
        } else {
          toast.error(error.message);
        }
      } else {
        toast.success('Welcome to your NEET journey! 🎯');
        navigate('/');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 gradient-hero opacity-90" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.2),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.15),transparent_50%)]" />
      
      {/* Floating elements */}
      <div className="absolute top-20 left-10 animate-float">
        <Stethoscope className="w-16 h-16 text-primary-foreground/30" />
      </div>
      <div className="absolute bottom-20 right-10 animate-float" style={{ animationDelay: '1s' }}>
        <Heart className="w-12 h-12 text-primary-foreground/30" />
      </div>
      <div className="absolute top-40 right-20 animate-float" style={{ animationDelay: '2s' }}>
        <Sparkles className="w-10 h-10 text-primary-foreground/30" />
      </div>

      <Card className="w-full max-w-md glass-card animate-scale-in relative z-10">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 rounded-full gradient-warm flex items-center justify-center animate-bounce-subtle">
            <Stethoscope className="w-10 h-10 text-primary-foreground" />
          </div>
          <CardTitle className="font-display text-3xl text-foreground">
            NEET Study Tracker
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Your journey to medical excellence starts here
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email" className="text-foreground font-semibold flex items-center gap-2">
                    <Mail className="w-4 h-4" /> Email
                  </Label>
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="your@email.com"
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                    className="h-12 text-lg bg-background/50 border-border focus:border-primary"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password" className="text-foreground font-semibold flex items-center gap-2">
                    <Lock className="w-4 h-4" /> Password
                  </Label>
                  <Input
                    id="signin-password"
                    type="password"
                    placeholder="••••••••"
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    className="h-12 text-lg bg-background/50 border-border focus:border-primary"
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full h-14 text-lg font-bold gradient-hero hover:opacity-90 transition-opacity"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name" className="text-foreground font-semibold flex items-center gap-2">
                    <User className="w-4 h-4" /> Full Name
                  </Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="Your full name"
                    value={signUpName}
                    onChange={(e) => setSignUpName(e.target.value)}
                    className="h-12 text-lg bg-background/50 border-border focus:border-primary"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-age" className="text-foreground font-semibold flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> Age
                  </Label>
                  <Input
                    id="signup-age"
                    type="number"
                    placeholder="Your age"
                    min={14}
                    max={30}
                    value={signUpAge}
                    onChange={(e) => setSignUpAge(e.target.value)}
                    className="h-12 text-lg bg-background/50 border-border focus:border-primary"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-foreground font-semibold flex items-center gap-2">
                    <Mail className="w-4 h-4" /> Email
                  </Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="your@email.com"
                    value={signUpEmail}
                    onChange={(e) => setSignUpEmail(e.target.value)}
                    className="h-12 text-lg bg-background/50 border-border focus:border-primary"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-foreground font-semibold flex items-center gap-2">
                    <Lock className="w-4 h-4" /> Password
                  </Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="At least 6 characters"
                    value={signUpPassword}
                    onChange={(e) => setSignUpPassword(e.target.value)}
                    className="h-12 text-lg bg-background/50 border-border focus:border-primary"
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full h-14 text-lg font-bold gradient-hero hover:opacity-90 transition-opacity"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Creating account...' : 'Start My Journey 🚀'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
