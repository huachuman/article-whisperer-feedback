
import React, { useRef, useState } from 'react';
import { useArticleFeedback } from '@/hooks/use-article-feedback';
import FeedbackIcon from './FeedbackIcon';
import FeedbackDialog from './FeedbackDialog';

interface WordpressArticleFeedbackProps {
  articleSelector?: string;
  feedbackLabel?: string;
}

const WordpressArticleFeedback: React.FC<WordpressArticleFeedbackProps> = ({
  articleSelector = ".entry-content",
  feedbackLabel = "Submit feedback for this paragraph"
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const {
    activeElement,
    iconPosition,
    isIconVisible,
    selectedText,
    isDialogOpen,
    handleIconClick,
    handleCloseDialog
  } = useArticleFeedback({
    containerRef,
    selectors: ['p', 'h2', 'h3', 'h4', 'h5', 'h6', 'li', 'blockquote'] 
  });

  // In a real implementation, this would inject styles into the parent document
  // For now, we'll just include them in our component
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .feedback-highlight {
        background-color: rgba(66, 133, 244, 0.1);
        transition: background-color 0.3s ease;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Find and wrap the WordPress article content
  React.useEffect(() => {
    const articleContent = document.querySelector(articleSelector);
    if (articleContent && containerRef.current) {
      // In a real implementation, we would add our ref to the article container
      // For demo purposes, we're just simulating that connection
      containerRef.current = articleContent as HTMLDivElement;
    }
  }, [articleSelector]);

  return (
    <>
      <div 
        style={{
          position: 'fixed',
          top: `${iconPosition.top}px`,
          left: `${iconPosition.left}px`,
          zIndex: 9999,
        }}
      >
        <FeedbackIcon 
          isVisible={isIconVisible} 
          onClick={handleIconClick} 
        />
      </div>
      
      <FeedbackDialog 
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        selectedText={selectedText}
      />
      
      {/* This div is just a reference holder for our hook */}
      <div ref={containerRef} style={{ display: 'none' }}></div>
    </>
  );
};

export default WordpressArticleFeedback;
