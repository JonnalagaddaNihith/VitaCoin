import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BrainCircuit } from "lucide-react";

type QuizCardProps = {
  onPlay: () => void;
};

export function QuizCard({ onPlay }: QuizCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BrainCircuit className="h-5 w-5 text-primary" />
          Daily Quiz
        </CardTitle>
        <CardDescription>Test your knowledge and earn coins!</CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={onPlay} className="w-full">Play Quiz</Button>
        <p className="text-xs text-muted-foreground mt-2 text-center">Earn 5 coins for each correct answer.</p>
      </CardContent>
    </Card>
  );
}
