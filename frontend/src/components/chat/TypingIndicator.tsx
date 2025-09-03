import { Bot } from 'lucide-react';

export const TypingIndicator = () => {
  return (
    <div className="flex gap-3 message-enter">
      {/* Avatar */}
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center">
        <Bot className="w-4 h-4 text-muted-foreground" />
      </div>

      {/* Typing Animation */}
      <div className="flex-1 max-w-[80%]">
        <div className="px-4 py-3 rounded-2xl rounded-bl-md bg-chat-bot border border-border/50 shadow-message">
          <div className="flex items-center gap-1">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-muted-foreground/60 rounded-full typing-indicator" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-muted-foreground/60 rounded-full typing-indicator" style={{ animationDelay: '200ms' }} />
              <div className="w-2 h-2 bg-muted-foreground/60 rounded-full typing-indicator" style={{ animationDelay: '400ms' }} />
            </div>
            <span className="text-xs text-muted-foreground/70 ml-2">AI is typing...</span>
          </div>
        </div>
      </div>
    </div>
  );
};