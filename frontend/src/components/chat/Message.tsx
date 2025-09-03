import { format } from 'date-fns';
import { Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ChatMessage } from './ChatInterface';

interface MessageProps {
  message: ChatMessage;
}

export const Message = ({ message }: MessageProps) => {
  const isUser = message.role === 'user';
  const isAssistant = message.role === 'assistant';

  return (
    <div
      className={cn(
        'message-enter flex gap-3 group',
        isUser && 'flex-row-reverse'
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
          isUser
            ? 'bg-gradient-primary shadow-glow'
            : 'bg-muted border border-border'
        )}
      >
        {isUser ? (
          <User className="w-4 h-4 text-primary-foreground" />
        ) : (
          <Bot className="w-4 h-4 text-muted-foreground" />
        )}
      </div>

      {/* Message Content */}
      <div
        className={cn(
          'flex-1 max-w-[80%] space-y-1',
          isUser && 'flex flex-col items-end'
        )}
      >
        {/* Message Bubble */}
        <div
          className={cn(
            'px-4 py-3 rounded-2xl shadow-message transition-all duration-200 hover:shadow-lg',
            isUser
              ? 'bg-gradient-primary text-primary-foreground rounded-br-md'
              : 'bg-chat-bot border border-border/50 hover:bg-chat-hover rounded-bl-md',
            'group-hover:scale-[1.02] transform-gpu'
          )}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
            {message.content}
          </p>
        </div>

        {/* Timestamp */}
        <div
          className={cn(
            'text-xs text-muted-foreground/70 px-2 opacity-0 group-hover:opacity-100 transition-opacity',
            isUser && 'text-right'
          )}
        >
          {format(message.timestamp, 'HH:mm')}
        </div>
      </div>
    </div>
  );
};