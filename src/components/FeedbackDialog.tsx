
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface FeedbackOption {
  id: string;
  label: string;
}

interface FeedbackDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedText: string;
}

const feedbackOptions: FeedbackOption[] = [
  { id: 'inaccurate', label: 'Inaccurate - doesn\'t match what I see in the product' },
  { id: 'hard-to-understand', label: 'Hard to understand - unclear or translation is wrong' },
  { id: 'missing-info', label: 'Missing info - relevant but not comprehensive' },
  { id: 'irrelevant', label: 'Irrelevant - doesn\'t match the title and/or my expectations' },
  { id: 'minor-errors', label: 'Minor errors - formatting issues, typos, and/or broken links' },
  { id: 'other', label: 'Other suggestions - ideas to improve the content' }
];

const FeedbackDialog: React.FC<FeedbackDialogProps> = ({ isOpen, onClose, selectedText }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [additionalInfo, setAdditionalInfo] = useState('');

  const handleSubmit = () => {
    if (!selectedOption) {
      toast.error('Please select a feedback option');
      return;
    }

    // Here you would typically send the data to your backend
    console.log({
      feedbackType: selectedOption,
      additionalInfo,
      selectedText
    });

    toast.success('Feedback submitted successfully');
    setSelectedOption(null);
    setAdditionalInfo('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>What is the issue with this selection?</DialogTitle>
          <DialogDescription className="text-xs text-gray-500 pt-2">
            Providing feedback about: 
            <span className="italic block mt-1 p-2 bg-gray-50 rounded border border-gray-100">
              {selectedText.substring(0, 100)}{selectedText.length > 100 ? '...' : ''}
            </span>
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <RadioGroup value={selectedOption || ''} onValueChange={setSelectedOption}>
            {feedbackOptions.map((option) => (
              <div className="flex items-start space-x-2 mb-3" key={option.id}>
                <RadioGroupItem value={option.id} id={option.id} className="mt-1" />
                <Label htmlFor={option.id} className="font-normal text-sm">{option.label}</Label>
              </div>
            ))}
          </RadioGroup>

          <div className="mt-4">
            <Label htmlFor="additional-info" className="text-sm font-medium">
              Share additional info or suggestions
            </Label>
            <Textarea 
              id="additional-info"
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              className="mt-1"
              rows={4}
            />
            <p className="text-xs text-gray-500 mt-1">
              Do not share any personal info
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackDialog;
