
import React, { useRef, useState } from 'react';
import { useArticleFeedback } from '@/hooks/use-article-feedback';
import FeedbackIcon from './FeedbackIcon';
import FeedbackDialog from './FeedbackDialog';

interface WordpressArticleFeedbackProps {
  articleSelector?: string;
  feedbackLabel?: string;
}

/**
 * WordPress Article Feedback Component
 * 
 * This component can be integrated into WordPress in two ways:
 * 
 * 1. As a WordPress plugin that loads this React component
 *    - Create a WordPress plugin that enqueues the compiled JS/CSS
 *    - Use wp_localize_script to pass WordPress-specific data
 *    - Target the correct article container using the articleSelector prop
 * 
 * 2. As part of a WordPress theme that uses React
 *    - Include this component in your theme's React code
 *    - Mount it on the article pages with the correct selector
 * 
 * In both cases, you'll need a backend endpoint to receive the feedback data.
 * This can be implemented as a WordPress REST API endpoint.
 */
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
    handleCloseDialog,
    handleIconHover
  } = useArticleFeedback({
    containerRef,
    selectors: ['p', 'h2', 'h3', 'h4', 'h5', 'h6', 'li', 'blockquote'] 
  });

  // In a real implementation, this would inject styles into the parent document
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
      // In a real WordPress implementation, this would attach our ref to the article container
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
          onMouseEnter={handleIconHover}
          onMouseLeave={handleIconHover}
        />
      </div>
      
      <FeedbackDialog 
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        selectedText={selectedText}
      />
      
      {/* This div is just a reference holder for our hook in demo mode */}
      <div ref={containerRef} style={{ display: 'none' }}></div>
    </>
  );
};

export default WordpressArticleFeedback;
