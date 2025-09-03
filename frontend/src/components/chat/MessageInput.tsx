import { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
}

export const MessageInput = ({ onSendMessage, isLoading = false }: MessageInputProps) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim());
      setMessage('');
      resetTextareaHeight();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const resetTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const newHeight = Math.min(textarea.scrollHeight, 120); // Max height of ~6 lines
      textarea.style.height = `${newHeight}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [message]);

  const canSend = message.trim().length > 0 && !isLoading;

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative flex items-end gap-3 p-4 rounded-2xl bg-card border border-border/50 shadow-elegant hover:border-border transition-colors">
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className={cn(
            'flex-1 min-h-[20px] max-h-[120px] resize-none border-0 bg-transparent p-0 text-sm',
            'placeholder:text-muted-foreground/70 focus-visible:ring-0 focus-visible:ring-offset-0',
            'scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent'
          )}
          style={{ height: 'auto' }}
          disabled={isLoading}
        />
        
        <Button
          type="submit"
          size="sm"
          disabled={!canSend}
          className={cn(
            'flex-shrink-0 h-8 w-8 p-0 rounded-full transition-all duration-200',
            canSend
              ? 'bg-gradient-primary hover:shadow-glow hover:scale-105 transform-gpu'
              : 'bg-muted text-muted-foreground cursor-not-allowed'
          )}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </Button>
      </div>
      
      {/* Send hint */}
      <div className="flex justify-between items-center mt-2 px-2">
        <p className="text-xs text-muted-foreground/50">
          Press Enter to send, Shift + Enter for new line
        </p>
        <div className="text-xs text-muted-foreground/50">
          {message.length > 0 && `${message.length} characters`}
        </div>
      </div>
    </form>
  );
};