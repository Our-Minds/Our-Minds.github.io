
import { Message, formatFileSize, isImageType } from '@/utils/chatFormatters';

interface MessageAttachmentProps {
  message: Message;
  isMobile: boolean;
}

export function MessageAttachment({ message, isMobile }: MessageAttachmentProps) {
  if (!message.attachment_url) return null;

  const isImage = message.attachment_type && isImageType(message.attachment_type);

  return (
    <div className="mt-2">
      {isImage ? (
        <img
          src={message.attachment_url}
          alt={message.attachment_name || 'Attachment'}
          className={`
            rounded-md max-w-full cursor-pointer
            ${isMobile ? 'max-h-48' : 'max-h-64'}
          `}
          onClick={() => window.open(message.attachment_url, '_blank')}
        />
      ) : (
        <div className="bg-white/10 dark:bg-black/20 rounded-md p-3 border border-white/20 dark:border-gray-600/30">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/20 dark:bg-gray-600/30 rounded flex items-center justify-center">
              📄
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {message.attachment_name || 'File'}
              </p>
              {message.attachment_size && (
                <p className="text-xs opacity-75">
                  {formatFileSize(message.attachment_size)}
                </p>
              )}
            </div>
            <button
              onClick={() => window.open(message.attachment_url, '_blank')}
              className="text-xs px-2 py-1 bg-white/20 dark:bg-gray-600/30 rounded hover:bg-white/30 dark:hover:bg-gray-600/50"
            >
              Open
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MessageAttachment;
