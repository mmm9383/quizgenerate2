import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (description: string) => void;
  performanceMessages: Record<string, string>;
  setPerformanceMessages: (messages: Record<string, string>) => void;
  onNext: () => void;
};

export default function CoverPage({
  title,
  setTitle,
  description,
  setDescription,
  performanceMessages,
  setPerformanceMessages,
  onNext,
}: Props) {
  const updateMessage = (score: string, message: string) => {
    setPerformanceMessages({
      ...performanceMessages,
      [score]: message,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/10 p-8">
      <div className="container max-w-2xl">
        <h1 className="text-3xl font-bold mb-8">Create New Quiz</h1>

        <Card>
          <CardHeader>
            <CardTitle>Quiz Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="title">Quiz Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter quiz title"
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your quiz"
                className="mt-1"
              />
            </div>

            <div>
              <Label>Performance Messages</Label>
              <div className="grid gap-4 mt-2">
                {Object.entries(performanceMessages).map(([score, message]) => (
                  <div key={score} className="flex gap-2 items-center">
                    <div className="w-16 text-sm text-muted-foreground">
                      {score}%
                    </div>
                    <Input
                      value={message}
                      onChange={(e) => updateMessage(score, e.target.value)}
                      placeholder={`Message for ${score}% score`}
                    />
                  </div>
                ))}
              </div>
            </div>

            <Button
              onClick={onNext}
              className="w-full"
              disabled={!title.trim()}
            >
              Next: Add Questions
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
