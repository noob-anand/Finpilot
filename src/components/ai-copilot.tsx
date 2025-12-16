'use client';

import { useState, useRef, useEffect } from 'react';
import { Bot, Loader2, Send, User, Sparkles } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { aiCopilotAnswersCashFlowQuestions } from '@/ai/flows/ai-copilot-answers-cash-flow-questions';
import { aiCopilotSuggestsImprovements } from '@/ai/flows/ai-copilot-suggests-improvements';
import { summarizeFinancialData } from '@/ai/flows/ai-summarize-financial-data';
import { getFinancialSummary } from '@/lib/data';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const formSchema = z.object({
  prompt: z.string().min(1, 'Please enter a question.'),
});

type Message = {
  id: string;
  text: string;
  role: 'user' | 'assistant';
};

const suggestedQuestions = [
  'Why is my cash flow negative?',
  'What should I improve this month?',
  'Summarize my financial health.',
];

const MAX_QUESTIONS = 4;

export default function AiCopilot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const questionCount = messages.filter((m) => m.role === 'user').length;
  const isLimitReached = questionCount >= MAX_QUESTIONS;
  const remainingQuestions = MAX_QUESTIONS - questionCount;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: '',
    },
  });

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const handlePrompt = async (promptText: string) => {
    if (isLimitReached) {
      return;
    }
    form.reset();
    setIsLoading(true);

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: promptText,
      role: 'user',
    };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const financialData = getFinancialSummary();
      const {cashInflow, cashOutflow, netCashFlow} = financialData;
      let responseText = '';
      
      if (promptText.toLowerCase().includes('improve')) {
        const response = await aiCopilotSuggestsImprovements({
            ...financialData,
        });
        responseText = response.suggestions;
      } else if (promptText.toLowerCase().includes('summarize')) {
        const delayedReceivablesRatio = 0.2; 
        const expenseRatio = cashInflow > 0 ? cashOutflow / cashInflow : 0;
        const response = await summarizeFinancialData({
            ...financialData,
            delayedReceivablesRatio,
            expenseRatio,
        });
        responseText = `${response.summary}\n\n**Recommendations:**\n${response.recommendations}`;
      } else {
        const response = await aiCopilotAnswersCashFlowQuestions({
          ...financialData,
          question: promptText,
        });
        responseText = response.answer;
      }

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        text: responseText,
        role: 'assistant',
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("AI Copilot Error:", error);
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        text: 'Sorry, I encountered an error. Please try again.',
        role: 'assistant',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    handlePrompt(values.prompt);
  };
  
  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon" className="rounded-full w-14 h-14 shadow-lg bg-primary hover:bg-primary/90">
              <Bot className="h-7 w-7" />
            </Button>
          </SheetTrigger>
          <SheetContent className="flex flex-col w-full sm:max-w-md">
            <SheetHeader>
              <SheetTitle className="flex items-center justify-between text-xl">
                 <div className='flex items-center gap-2'>
                    <Bot className="text-primary" />
                    AI Copilot
                 </div>
                 <div className="text-sm font-normal text-muted-foreground">
                    {remainingQuestions} / {MAX_QUESTIONS} left
                 </div>
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
                      <Avatar className="w-8 h-8 border">
                         <div className="w-8 h-8 flex items-center justify-center bg-primary rounded-full">
                           <Bot className="h-5 w-5 text-primary-foreground" />
                         </div>
                      </Avatar>
                    )}
                    <div
                      className={cn(
                        'rounded-lg px-4 py-3 max-w-[80%] text-sm',
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      )}
                    >
                      <p style={{ whiteSpace: 'pre-wrap' }}>{message.text}</p>
                    </div>
                    {message.role === 'user' && (
                       <Avatar className="w-8 h-8 border">
                        <Image src="https://picsum.photos/seed/finpilot-user/100" alt="User avatar" width={32} height={32} data-ai-hint="user avatar" />
                        <AvatarFallback>U</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
                 {isLoading && (
                    <div className="flex items-start gap-3">
                      <Avatar className="w-8 h-8 border">
                         <div className="w-8 h-8 flex items-center justify-center bg-primary rounded-full">
                           <Bot className="h-5 w-5 text-primary-foreground" />
                         </div>
                      </Avatar>
                      <div className="rounded-lg px-4 py-3 bg-muted">
                        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                      </div>
                    </div>
                  )}
                   {isLimitReached && (
                    <div className="text-center p-4 rounded-lg bg-amber-100 dark:bg-amber-900/50 border border-amber-200 dark:border-amber-800">
                      <p className="text-sm text-amber-800 dark:text-amber-200">
                        You have reached the question limit for this session.
                      </p>
                    </div>
                  )}
              </div>
            </ScrollArea>
            <SheetFooter className="mt-auto flex flex-col gap-2">
               <div className="flex gap-2 flex-wrap">
                  {suggestedQuestions.map((q) => (
                    <Button
                      key={q}
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={() => handlePrompt(q)}
                      disabled={isLoading || isLimitReached}
                    >
                      {q}
                    </Button>
                  ))}
                </div>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex items-center gap-2"
                >
                  <FormField
                    control={form.control}
                    name="prompt"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input
                            placeholder={isLimitReached ? 'Question limit reached' : 'e.g., How can I improve cash flow?'}
                            {...field}
                            disabled={isLoading || isLimitReached}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" size="icon" disabled={isLoading || isLimitReached}>
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </Form>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
