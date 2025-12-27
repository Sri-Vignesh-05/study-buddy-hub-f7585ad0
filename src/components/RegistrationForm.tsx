import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Stethoscope, Heart, Sparkles } from 'lucide-react';
import { useStudent } from '@/hooks/useStudent';
import { toast } from 'sonner';

interface RegistrationFormProps {
  onSuccess: () => void;
}

const RegistrationForm = ({ onSuccess }: RegistrationFormProps) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { registerStudent } = useStudent();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !age) {
      toast.error('Please fill in all fields');
      return;
    }

    const ageNum = parseInt(age);
    if (ageNum < 14 || ageNum > 30) {
      toast.error('Please enter a valid age between 14 and 30');
      return;
    }

    setIsSubmitting(true);
    try {
      await registerStudent(name.trim(), ageNum);
      toast.success('Welcome to your NEET journey! 🎯');
      onSuccess();
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
            Welcome, Future Doctor!
          </CardTitle>
          <p className="text-muted-foreground">
            Begin your journey to medical excellence. Let's track your NEET preparation together.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground font-semibold">
                Your Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-12 text-lg bg-background/50 border-border focus:border-primary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age" className="text-foreground font-semibold">
                Your Age
              </Label>
              <Input
                id="age"
                type="number"
                placeholder="Enter your age"
                min={14}
                max={30}
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="h-12 text-lg bg-background/50 border-border focus:border-primary"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full h-14 text-lg font-bold gradient-hero hover:opacity-90 transition-opacity"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Starting Your Journey...' : 'Start My Journey 🚀'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegistrationForm;
