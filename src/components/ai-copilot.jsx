'use client';

import { aiCopilotAnswersCashFlowQuestions } from '@/ai/flows/ai-copilot-answers-cash-flow-questions';
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
import { getFinancialSummary } from '@/lib/data';
import { cn } from '@/lib/utils';
import { Bot, Send, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';

const initialQuestions = [
    'Why is my cash flow negative?',
    'What should I improve this month?',
    'Summarize my financial health.',
];

export default function AiCopilot() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const scrollAreaRef = useRef(null);
  
  const financialSummary = getFinancialSummary();

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

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setInputValue('');
    
    try {
      const result = await aiCopilotAnswersCashFlowQuestions({
        question: question,
        ...financialSummary
      });

      const assistantMessage = {
        id: `assistant-${Date.now()}`,
        text: result.answer,
        role: 'assistant',
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error fetching AI response:', error);
      const errorMessage = {
        id: `assistant-${Date.now()}`,
        text: "I'm sorry, I'm having trouble connecting to my brain right now. Please try again in a moment.",
        role: 'assistant',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleInitialQuestion = (question) => {
    setInputValue(question);
    handleSend(question);
  }

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
              {messages.map(message => (
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
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={e => {
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
