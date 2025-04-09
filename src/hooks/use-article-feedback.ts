
import { useState, useEffect, useRef, RefObject } from 'react';

interface UseFeedbackOptions {
  containerRef: RefObject<HTMLElement>;
  selectors?: string[];
}

interface FeedbackState {
  activeElement: HTMLElement | null;
  iconPosition: { top: number; left: number };
  isIconVisible: boolean;
  selectedText: string;
}

export function useArticleFeedback({ 
  containerRef,
  selectors = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li', 'blockquote'] 
}: UseFeedbackOptions) {
  const [state, setState] = useState<FeedbackState>({
    activeElement: null,
    iconPosition: { top: 0, left: 0 },
    isIconVisible: false,
    selectedText: ''
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const iconTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Check if we're hovering over content in our container
      if (containerRef.current?.contains(target)) {
        // Find the closest element that matches our selectors
        const element = findClosestElement(target, selectors);
        
        if (element) {
          // If we were about to hide the icon, cancel that timeout
          if (iconTimeoutRef.current) {
            clearTimeout(iconTimeoutRef.current);
            iconTimeoutRef.current = null;
          }
          
          const rect = element.getBoundingClientRect();
          
          // Position icon to the right of the element
          setState({
            activeElement: element,
            iconPosition: {
              top: rect.top + window.scrollY + rect.height / 2 - 15,
              left: rect.right + window.scrollX + 10
            },
            isIconVisible: true,
            selectedText: state.selectedText
          });
          return;
        }
      }
      
      // Don't hide immediately if dialog is open
      if (state.isIconVisible && !isDialogOpen) {
        // Set a timeout before hiding the icon to give users time to hover on it
        if (!iconTimeoutRef.current) {
          iconTimeoutRef.current = setTimeout(() => {
            setState(prev => ({ ...prev, isIconVisible: false, activeElement: null }));
            iconTimeoutRef.current = null;
          }, 300); // 300ms delay before hiding
        }
      }
    };
    
    const findClosestElement = (element: HTMLElement, selectors: string[]): HTMLElement | null => {
      // Check if the element matches any of our selectors
      if (selectors.some(selector => element.matches(selector))) {
        return element;
      }
      
      // If not, check if it's within an element that matches
      let current: HTMLElement | null = element;
      while (current && current !== containerRef.current) {
        if (selectors.some(selector => current?.matches(selector))) {
          return current;
        }
        current = current.parentElement;
      }
      
      return null;
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (iconTimeoutRef.current) {
        clearTimeout(iconTimeoutRef.current);
      }
    };
  }, [containerRef, selectors, state.isIconVisible, isDialogOpen]);

  // Function to prevent the icon from disappearing when mouse is over it
  const handleIconHover = () => {
    if (iconTimeoutRef.current) {
      clearTimeout(iconTimeoutRef.current);
      iconTimeoutRef.current = null;
    }
  };

  const handleIconClick = () => {
    if (state.activeElement) {
      // Add a highlight class to the active element
      state.activeElement.classList.add('feedback-highlight');
      
      // Get the text content
      setState(prev => ({ 
        ...prev, 
        selectedText: state.activeElement?.textContent || '' 
      }));
      
      // Open the feedback dialog
      setIsDialogOpen(true);
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    
    // Remove highlight from active element
    if (state.activeElement) {
      state.activeElement.classList.remove('feedback-highlight');
    }
  };

  return {
    ...state,
    isDialogOpen,
    handleIconClick,
    handleCloseDialog,
    handleIconHover
  };
}
