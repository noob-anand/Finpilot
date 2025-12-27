'use client';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Bot, Send, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';

const initialQuestions = [
  'Why is my cash flow negative?',
  'What should I improve this month?',
  'Summarize my financial health.',
];

const cannedAnswers = {
  'Why is my cash flow negative?':
    "Your cash flow for the last month appears negative primarily due to two factors:\n\n1.  **High Cash Outflow:** You had a significant one-time marketing campaign expense of $500 and your recurring rent of $1,200.\n2.  **Timing of Payments:** While you have unpaid invoices totaling over $7,000, the cash hasn't been collected yet. Focusing on collecting payment for overdue invoices from 'Global Exports' could quickly improve your cash position.",
  'What should I improve this month?':
    "Based on your recent activity, here are two areas to focus on this month:\n\n1.  **Invoice Collection:** You have one 'overdue' invoice and one large 'unpaid' invoice. Prioritizing the collection of these receivables will significantly boost your cash inflow.\n2.  **Expense Management:** Your cash outflow is higher than your inflow. Review your recurring expenses, like software subscriptions, to see if there are any opportunities for cost savings.",
  'Summarize my financial health.':
    "Here's a quick summary of your financial health:\n\n*   **Profitability:** Your net profit is currently positive, which is a good sign.\n*   **Liquidity:** Your immediate cash flow is negative, indicating a potential short-term liquidity challenge. This is mainly due to high expenses and delayed customer payments.\n*   **Action Item:** The most critical action is to follow up on your unpaid and overdue invoices to improve your cash reserves.",
};

export default function AiCopilot() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const scrollAreaRef = useRef(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, isLoading]);

  const handleSend = async (questionText) => {
    const question = questionText || inputValue;
    if (!question.trim() || isLoading) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      text: question,
      role: 'user',
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setInputValue('');

    // Simulate thinking delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const answer =
      cannedAnswers[question] ||
      "I'm sorry, I am only trained to answer the three initial questions. Please select one of them.";

    const assistantMessage = {
      id: `assistant-${Date.now()}`,
      text: answer,
      role: 'assistant',
    };
    setMessages((prev) => [...prev, assistantMessage]);
    setIsLoading(false);
  };

  const handleInitialQuestion = (question) => {
    // No need to set input value, just send the question directly
    handleSend(question);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger asChild>
          <Button
            size="icon"
            className="rounded-full w-14 h-14 shadow-lg bg-primary hover:bg-primary/90"
          >
            <Bot className="h-7 w-7" />
          </Button>
        </SheetTrigger>
        <SheetContent className="flex flex-col w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2 text-xl">
              <Bot className="text-primary" />
              AI Copilot
            </SheetTitle>
          </SheetHeader>
          <ScrollArea className="flex-1 my-4 pr-4 -mr-6" ref={scrollAreaRef}>
            <div className="space-y-6">
              {messages.length === 0 && (
                <div className="text-center p-4 rounded-lg bg-muted/50 border">
                  <Sparkles className="mx-auto h-8 w-8 text-primary mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Ask me anything about your finances!
                  </p>
                </div>
              )}
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    'flex items-start gap-3',
                    message.role === 'user' && 'justify-end'
                  )}
                >
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 flex items-center justify-center bg-primary rounded-full border">
                      <Bot className="h-5 w-5 text-primary-foreground" />
                    </div>
                  )}
                  <div
                    className={cn(
                      'rounded-lg px-4 py-3 max-w-[80%] text-sm whitespace-pre-wrap',
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    )}
                  >
                    {message.text}
                  </div>
                  {message.role === 'user' && (
                    <Image
                      src="https://picsum.photos/seed/finpilot-user/100"
                      alt="User avatar"
                      width={32}
                      height={32}
                      className="rounded-full border"
                      data-ai-hint="user avatar"
                    />
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 flex items-center justify-center bg-primary rounded-full border">
                    <Bot className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div className="rounded-lg px-4 py-3 max-w-[80%] text-sm bg-muted">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 bg-foreground/50 rounded-full animate-pulse delay-0"></span>
                      <span className="h-2 w-2 bg-foreground/50 rounded-full animate-pulse delay-150"></span>
                      <span className="h-2 w-2 bg-foreground/50 rounded-full animate-pulse delay-300"></span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          <SheetFooter className="mt-auto flex flex-col gap-4">
            {messages.length === 0 && (
              <div className="flex gap-2 flex-wrap justify-start">
                {initialQuestions.map((q) => (
                  <Button
                    key={q}
                    variant="outline"
                    size="sm"
                    className="text-xs h-auto py-1.5"
                    onClick={() => handleInitialQuestion(q)}
                    disabled={isLoading}
                  >
                    {q}
                  </Button>
                ))}
              </div>
            )}
            <div className="flex items-center gap-2">
              <Textarea
                placeholder="Type your message..."
                rows={1}
                className="flex-1 resize-none"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                disabled={isLoading}
              />
              <Button
                onClick={() => handleSend()}
                size="icon"
                className="shrink-0"
                disabled={isLoading || !inputValue.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
