
import React, { useState, useEffect, useRef } from 'react';
import FeedbackIcon from './FeedbackIcon';
import FeedbackDialog from './FeedbackDialog';
import { useToast } from 'sonner';

const ArticleFeedback: React.FC = () => {
  const [activeElement, setActiveElement] = useState<HTMLElement | null>(null);
  const [iconPosition, setIconPosition] = useState({ top: 0, left: 0 });
  const [isIconVisible, setIsIconVisible] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const articleRef = useRef<HTMLDivElement>(null);
  const toast = useToast();
  
  // Find all paragraph elements within the article
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Check if we're hovering over content in our article container
      if (articleRef.current?.contains(target)) {
        // Find the closest paragraph
        const paragraph = findClosestParagraph(target);
        
        if (paragraph) {
          const rect = paragraph.getBoundingClientRect();
          
          // Position icon to the right of the paragraph
          setIconPosition({
            top: rect.top + window.scrollY + rect.height / 2 - 15,
            left: rect.right + window.scrollX + 10
          });
          
          setActiveElement(paragraph);
          setIsIconVisible(true);
          return;
        }
      }
      
      // Hide icon if not hovering over a paragraph
      setIsIconVisible(false);
      setActiveElement(null);
    };
    
    const findClosestParagraph = (element: HTMLElement): HTMLElement | null => {
      // Check if the element is a paragraph or contains text content
      if (element.tagName === 'P' || 
         (element.childNodes.length > 0 && 
          Array.from(element.childNodes).some(node => 
            node.nodeType === Node.TEXT_NODE && node.textContent?.trim()))) {
        return element;
      }
      
      // If not, check if it's within a paragraph
      let current: HTMLElement | null = element;
      while (current && current !== articleRef.current) {
        if (current.tagName === 'P') {
          return current;
        }
        current = current.parentElement;
      }
      
      return null;
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleIconClick = () => {
    if (activeElement) {
      // Add a highlight class to the active element
      activeElement.classList.add('feedback-highlight');
      
      // Get the text content
      setSelectedText(activeElement.textContent || '');
      
      // Open the feedback dialog
      setIsDialogOpen(true);
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    
    // Remove highlight from active element
    if (activeElement) {
      activeElement.classList.remove('feedback-highlight');
    }
  };

  return (
    <>
      <div ref={articleRef} className="article-content">
        {/* The actual article content will be here in WordPress */}
      </div>
      
      <FeedbackIcon 
        isVisible={isIconVisible} 
        onClick={handleIconClick} 
        style={{
          top: `${iconPosition.top}px`,
          left: `${iconPosition.left}px`,
        }}
      />
      
      <FeedbackDialog 
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        selectedText={selectedText}
      />
      
      <style jsx>{`
        .feedback-highlight {
          background-color: rgba(66, 133, 244, 0.1);
          transition: background-color 0.3s ease;
        }
      `}</style>
    </>
  );
};

export default ArticleFeedback;
