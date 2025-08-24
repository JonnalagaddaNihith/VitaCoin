"use client";

import { useState, useEffect, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

type Question = {
  text: string;
  answer: number;
  options: number[];
};

type QuizModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onQuizComplete: (score: number) => void;
};

function generateQuestions(): Question[] {
  const questions: Question[] = [];
  for (let i = 0; i < 5; i++) {
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    const answer = a + b;
    const options = new Set([answer]);
    while (options.size < 4) {
      options.add(answer + (Math.floor(Math.random() * 10) - 5) || 1);
    }
    questions.push({
      text: `What is ${a} + ${b}?`,
      answer,
      options: Array.from(options).sort(() => Math.random() - 0.5),
    });
  }
  return questions;
}

export function QuizModal({ isOpen, onClose, onQuizComplete }: QuizModalProps) {
  const questions = useMemo(() => generateQuestions(), [isOpen]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCurrentQuestionIndex(0);
      setScore(0);
      setSelectedAnswer(null);
      setIsFinished(false);
    }
  }, [isOpen]);

  const handleAnswerSelect = (option: number) => {
    setSelectedAnswer(option);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === questions[currentQuestionIndex].answer) {
      setScore(prev => prev + 1);
    }

    setSelectedAnswer(null);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  
  const finalScore = selectedAnswer === questions[currentQuestionIndex].answer ? score + 1 : score;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-headline">Daily Math Quiz</DialogTitle>
          {!isFinished && <DialogDescription>Answer 5 questions to earn coins.</DialogDescription>}
        </DialogHeader>
        
        {isFinished ? (
          <div className="py-4 text-center">
            <h2 className="text-2xl font-bold font-headline">Quiz Complete!</h2>
            <p className="text-lg mt-2">You scored {finalScore} out of 5.</p>
            <p className="text-muted-foreground">You've earned {finalScore * 5} coins!</p>
          </div>
        ) : (
          <div className="py-4">
            <Progress value={progress} className="mb-4" />
            <h3 className="text-lg font-semibold mb-4">{currentQuestion?.text}</h3>
            <div className="grid grid-cols-2 gap-4">
              {currentQuestion?.options.map((option) => (
                <Button
                  key={option}
                  variant={selectedAnswer === option ? 'default' : 'outline'}
                  onClick={() => handleAnswerSelect(option)}
                  className="h-16 text-lg"
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>
        )}

        <DialogFooter>
          {isFinished ? (
            <Button onClick={() => onQuizComplete(finalScore)} className="w-full">
              Claim Reward & Close
            </Button>
          ) : (
            <Button onClick={handleNextQuestion} disabled={selectedAnswer === null} className="w-full">
              {currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
