import { getTodaysQuote } from '@/data/motivationalQuotes';
import { Quote, Sparkles } from 'lucide-react';

const MotivationalBanner = () => {
  const { quote, author } = getTodaysQuote();

  return (
    <div className="relative overflow-hidden rounded-xl sm:rounded-2xl gradient-hero p-4 sm:p-6 md:p-8 text-primary-foreground">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,rgba(255,255,255,0.08),transparent_50%)]" />

      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 animate-float">
        <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground/50" />
      </div>

      <div className="relative z-10 flex items-start gap-3 sm:gap-4">
        <div className="hidden sm:flex shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary-foreground/20 items-center justify-center">
          <Quote className="w-5 h-5 md:w-6 md:h-6" />
        </div>
        <div className="space-y-2 sm:space-y-3 min-w-0">
          <p className="text-base sm:text-xl md:text-2xl font-display font-bold leading-relaxed break-words">
            "{quote}"
          </p>
          {author !== 'Unknown' && (
            <p className="text-primary-foreground/80 font-medium text-sm sm:text-base">
              — {author}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MotivationalBanner;
