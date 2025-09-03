import { useState, useRef, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Message } from './Message';
import { MessageInput } from './MessageInput';
import { TypingIndicator } from './TypingIndicator';
import { ScrollArea } from '@/components/ui/scroll-area';

export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export const ChatInterface = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: "Hello! I'm your AI assistant. How can I help you today?",
      role: 'assistant',
      timestamp: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollArea = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollArea) {
        scrollArea.scrollTop = scrollArea.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      const response = await fetch('http://localhost:3001/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: content }),
      });
      if (!response.ok) {
        throw new Error('API request failed');
      }
      const data = await response.json();
      // Adjust this depending on your API response structure
      return data.result || data.response || JSON.stringify(data);
    },
    onMutate: async (content: string) => {
      // Add user message immediately
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        content,
        role: 'user',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, userMessage]);
      setIsTyping(true);
    },
    onSuccess: (response) => {
      setIsTyping(false);
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: 'assistant',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    },
    onError: () => {
      setIsTyping(false);
      // Handle error - could show error message
    },
  });

  const handleSendMessage = (content: string) => {
    if (content.trim() && !sendMessageMutation.isPending) {
      sendMessageMutation.mutate(content);
    }
  };

  return (
    <div className="flex flex-col h-screen max-h-screen bg-gradient-chat">
      {/* Header */}
      <div className="flex-shrink-0 border-b border-border/20 bg-card/80 backdrop-blur-sm">
        <div className="px-6 py-4">
          <h1 className="text-xl font-semibold bg-gradient-primary bg-clip-text text-transparent">
            AI Assistant
          </h1>
          <p className="text-sm text-muted-foreground">
            Powered by advanced AI technology
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 min-h-0">
        <ScrollArea ref={scrollAreaRef} className="h-full">
          <div className="px-6 py-4 space-y-4">
            {messages.map((message) => (
              <Message key={message.id} message={message} />
            ))}
            {isTyping && <TypingIndicator />}
          </div>
        </ScrollArea>
      </div>

      {/* Input */}
      <div className="flex-shrink-0 border-t border-border/20 bg-card/80 backdrop-blur-sm">
        <div className="p-6">
          <MessageInput
            onSendMessage={handleSendMessage}
            isLoading={sendMessageMutation.isPending}
          />
        </div>
      </div>
    </div>
  );
};