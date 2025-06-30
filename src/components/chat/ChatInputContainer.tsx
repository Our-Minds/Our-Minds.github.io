
import ChatInput from '@/components/chat/ChatInput';
import { FileUploadResult } from '@/utils/fileUpload';
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface ChatInputContainerProps {
  onSendMessage: (content: string, attachment?: FileUploadResult) => void;
  isMobile: boolean;
}

// We'll render the container for mobile input fixed at the viewport bottom, using portal.
export default function ChatInputContainer({
  onSendMessage,
  isMobile
}: ChatInputContainerProps) {
  const portalRootId = 'chat-mobile-input-portal';
  const localRef = useRef<HTMLDivElement | null>(null);

  // Create the portal root only on the client (avoid SSR issues)
  useEffect(() => {
    if (isMobile) {
      let div = document.getElementById(portalRootId);
      if (!div) {
        div = document.createElement('div');
        div.id = portalRootId;
        document.body.appendChild(div);
      }
      // Only assign if it's truly a div, for type safety
      if (div instanceof HTMLDivElement) {
        localRef.current = div;
      } else {
        localRef.current = null;
      }
      return () => {
        if (div && div.parentNode && div.childElementCount === 0) {
          div.parentNode.removeChild(div);
        }
      };
    }
  }, [isMobile]);

  // Mobile: Use React Portal at the page root, so parent scroll doesn't affect position
  if (isMobile && localRef.current) {
    return createPortal(
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-[#1a1a1a] border-t border-gray-200 dark:border-[#2a2a2a] shadow-lg">
        <div className="pb-safe">
          <ChatInput onSendMessage={onSendMessage} />
        </div>
      </div>,
      localRef.current
    );
  }

  // Desktop: parent is not scrollable so normal sticky works fine
  return (
    <div className="sticky bottom-0 z-20 shrink-0 border-t border-gray-200 dark:border-[#2a2a2a] bg-white dark:bg-[#1a1a1a] shadow-lg">
      <ChatInput onSendMessage={onSendMessage} />
    </div>
  );
}
