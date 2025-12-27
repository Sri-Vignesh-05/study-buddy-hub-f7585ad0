import { getTodaysQuote } from '@/data/motivationalQuotes';
import { Quote, Sparkles } from 'lucide-react';

const MotivationalBanner = () => {
  const { quote, author } = getTodaysQuote();

  return (
    <div className="relative overflow-hidden rounded-2xl gradient-hero p-6 md:p-8 text-primary-foreground">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,rgba(255,255,255,0.08),transparent_50%)]" />
      
      <div className="absolute top-4 right-4 animate-float">
        <Sparkles className="w-6 h-6 text-primary-foreground/50" />
      </div>
      
      <div className="relative z-10 flex items-start gap-4">
        <div className="hidden md:flex shrink-0 w-12 h-12 rounded-full bg-primary-foreground/20 items-center justify-center">
          <Quote className="w-6 h-6" />
        </div>
        <div className="space-y-3">
          <p className="text-xl md:text-2xl font-display font-bold leading-relaxed">
            "{quote}"
          </p>
          <p className="text-primary-foreground/80 font-medium">
            — {author}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MotivationalBanner;
