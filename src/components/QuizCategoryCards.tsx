"use client";

import { useState } from 'react';
import { QuizCategory } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calculator, Brain, BookOpen, Code, Clock, Coins } from 'lucide-react';
import { EnhancedQuizModal } from './EnhancedQuizModal';

const categoryData = {
  math: {
    icon: Calculator,
    title: 'Mathematics',
    description: 'Test your mathematical skills with algebra, geometry, and arithmetic problems.',
    color: 'bg-blue-500',
    difficulty: 'Medium'
  },
  aptitude: {
    icon: Brain,
    title: 'Aptitude',
    description: 'Challenge your logical reasoning and problem-solving abilities.',
    color: 'bg-purple-500',
    difficulty: 'Hard'
  },
  grammar: {
    icon: BookOpen,
    title: 'Grammar',
    description: 'Improve your language skills with grammar and vocabulary questions.',
    color: 'bg-green-500',
    difficulty: 'Easy'
  },
  programming: {
    icon: Code,
    title: 'Programming',
    description: 'Test your coding knowledge across various programming languages.',
    color: 'bg-orange-500',
    difficulty: 'Hard'
  }
};

interface QuizCategoryCardsProps {
  onQuizComplete: (category: QuizCategory, score: number, coinsEarned: number) => void;
  userStreaks?: Record<QuizCategory, number>;
  lastQuizDates?: Record<QuizCategory, Date | null>;
}

export function QuizCategoryCards({ onQuizComplete, userStreaks, lastQuizDates }: QuizCategoryCardsProps) {
  const [selectedCategory, setSelectedCategory] = useState<QuizCategory | null>(null);

  const canTakeQuiz = (category: QuizCategory) => {
    const lastDate = lastQuizDates?.[category];
    if (!lastDate) return true;
    
    const today = new Date().toDateString();
    return lastDate.toDateString() !== today;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(categoryData).map(([key, data]) => {
          const category = key as QuizCategory;
          const IconComponent = data.icon;
          const streak = userStreaks?.[category] || 0;
          const canTake = canTakeQuiz(category);
          
          return (
            <Card key={category} className="relative overflow-hidden">
              <div className={`absolute top-0 left-0 right-0 h-1 ${data.color}`} />
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <IconComponent className="h-8 w-8 text-muted-foreground" />
                  <Badge className={getDifficultyColor(data.difficulty)}>
                    {data.difficulty}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{data.title}</CardTitle>
                <CardDescription className="text-sm">
                  {data.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <Coins className="h-4 w-4 text-yellow-500" />
                    <span>Up to 25 coins</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <span>5 min</span>
                  </div>
                </div>
                
                {streak > 0 && (
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      🔥 {streak} day streak
                    </Badge>
                  </div>
                )}
                
                <Button
                  onClick={() => setSelectedCategory(category)}
                  disabled={!canTake}
                  className="w-full"
                  variant={canTake ? "default" : "secondary"}
                >
                  {canTake ? 'Take Quiz' : 'Completed Today'}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {selectedCategory && (
        <EnhancedQuizModal
          isOpen={!!selectedCategory}
          onClose={() => setSelectedCategory(null)}
          category={selectedCategory}
          onQuizComplete={(category, score, coinsEarned) => {
            onQuizComplete(category, score, coinsEarned);
            setSelectedCategory(null);
          }}
        />
      )}
    </>
  );
}
