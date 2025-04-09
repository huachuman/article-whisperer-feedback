
import React from 'react';
import { MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeedbackIconProps {
  isVisible: boolean;
  onClick: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const FeedbackIcon: React.FC<FeedbackIconProps> = ({ 
  isVisible, 
  onClick,
  onMouseEnter,
  onMouseLeave
}) => {
  return (
    <div 
      className={cn(
        "fixed transition-opacity duration-200 bg-white rounded-full p-2 shadow-md cursor-pointer hover:bg-gray-100",
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <MessageCircle className="w-5 h-5 text-blue-600" />
    </div>
  );
};

export default FeedbackIcon;
