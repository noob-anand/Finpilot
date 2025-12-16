'use client';

import { useState, useRef, useEffect } from 'react';
import { Bot, Sparkles, Home, Send, Loader } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { qnaTree, rootQuestionIds, type QnaNode } from '@/lib/qna-data';
import { Textarea } from '@/components/ui/textarea';

type Message = {
  id: string;
  text: string;
  role: 'user' | 'assistant';
};

export default function AiCopilot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentQuestionIds, setCurrentQuestionIds] =
    useState<string[]>(rootQuestionIds);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, isLoading]);

  const streamResponse = (node: QnaNode) => {
    const words = node.answerText.split(' ');
    const assistantMessage: Message = {
      id: `assistant-${Date.now()}`,
      text: '',
      role: 'assistant',
    };
    
    setMessages((prev) => [...prev, assistantMessage]);

    let wordIndex = 0;
    const interval = setInterval(() => {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMessage.id
            ? { ...m, text: words.slice(0, wordIndex + 1).join(' ') }
            : m
        )
      );
      wordIndex++;
      if (wordIndex >= words.length) {
        clearInterval(interval);
        setCurrentQuestionIds(node.followUpQuestionIds);
        setIsLoading(false);
      }
    }, 100); // Adjust typing speed here
  };


  const handleQuestionSelect = (questionId: string) => {
    const node: QnaNode = qnaTree[questionId];
    if (!node || isLoading) return;

    setInputValue(node.questionText);

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: node.questionText,
      role: 'user',
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setInputValue('');
    setCurrentQuestionIds([]);


    setTimeout(() => {
      streamResponse(node);
    }, 1000 + Math.random() * 1000); // Simulate "thinking" time
  };

  const handleReset = () => {
    setMessages([]);
    setCurrentQuestionIds(rootQuestionIds);
    setInputValue('');
  };
  
  const handleSend = () => {
    if (!inputValue.trim() || isLoading) return;

    const matchedQuestionId = Object.keys(qnaTree).find(id => qnaTree[id].questionText.toLowerCase() === inputValue.toLowerCase().trim());
    if (matchedQuestionId) {
        handleQuestionSelect(matchedQuestionId);
    } else {
        const userMessage: Message = {
            id: `user-${Date.now()}`,
            text: inputValue,
            role: 'user',
        };
        setMessages((prev) => [...prev, userMessage]);
        setIsLoading(true);
        setInputValue('');
        setCurrentQuestionIds([]);

        setTimeout(() => {
            const fallbackNode: QnaNode = {
                questionText: '',
                answerText: "I'm sorry, I can only respond to the suggested questions. Please select one of the options to continue.",
                followUpQuestionIds: rootQuestionIds,
            };
            streamResponse(fallbackNode);
        }, 1000);
    }
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
                    <p style={{ whiteSpace: 'pre-wrap' }}>{message.text}{message.role === 'assistant' && isLoading && message.id === messages[messages.length - 1]?.id ? '...' : ''}</p>
                  </div>
                  {message.role === 'user' && (
                    <Avatar className="w-8 h-8 border">
                      <Image
                        src="https://picsum.photos/seed/finpilot-user/100"
                        alt="User avatar"
                        width={32}
                        height={32}
                        data-ai-hint="user avatar"
                      />
                    </Avatar>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
          <SheetFooter className="mt-auto flex flex-col gap-4">
            <div className="flex gap-2 flex-wrap justify-start">
              {currentQuestionIds.map((id) => (
                <Button
                  key={id}
                  variant="outline"
                  size="sm"
                  className="text-xs h-auto py-1.5"
                  onClick={() => handleQuestionSelect(id)}
                  disabled={isLoading}
                >
                  {qnaTree[id].questionText}
                </Button>
              ))}
              {messages.length > 0 && currentQuestionIds.length > 0 && !isLoading && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs h-auto py-1.5"
                  onClick={handleReset}
                  disabled={isLoading}
                >
                  <Home className="mr-1 h-3 w-3" />
                  Back to Start
                </Button>
              )}
            </div>
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
                 <Button onClick={handleSend} size="icon" className="shrink-0" disabled={isLoading}>
                    <Send className="h-4 w-4" />
                </Button>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
