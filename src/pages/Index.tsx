
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import WordpressArticleFeedback from '@/components/WordpressArticleFeedback';

const Index = () => {
  const articleRef = useRef<HTMLDivElement>(null);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Article Whisperer Feedback</h1>
          <p className="text-gray-600">Hover over paragraphs to provide feedback</p>
        </header>

        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <div ref={articleRef} className="article-content prose max-w-none">
              <h2>Choose topics in your recommendations</h2>

              <p>
                If you're signed in, you'll notice topics on Home and on watch pages to help you refine your 
                recommendations. These topics are based on your existing, personalized suggestions. The 
                topics are also based on content related to what you interact with. These topics are meant to 
                help you find content you want to watch faster.
              </p>

              <p>
                If you find a video that isn't related to the topic you've chosen on Home, let us know by tapping 
                More ⋮ and then Not <topic> ⓘ.
              </p>

              <h2>Another section with multiple paragraphs</h2>

              <p>
                This is the first paragraph of the second section. It demonstrates how the feedback 
                mechanism works across multiple paragraphs and sections. Try hovering over this 
                paragraph to see the feedback icon appear.
              </p>

              <p>
                This is another paragraph that you can interact with. The feedback system should 
                highlight this paragraph when you hover over it, showing a feedback icon to the right.
              </p>

              <blockquote>
                Even blockquotes and other elements can receive feedback. This makes the system 
                versatile enough to work with various content types in your WordPress articles.
              </blockquote>

              <h3>Instructions for website owners</h3>
              
              <p>
                To integrate this feedback system into your WordPress site, you'll need to add the 
                feedback component to your theme and ensure it targets the article content correctly.
              </p>
              
              <ul>
                <li>The feedback mechanism appears when users hover near paragraphs</li>
                <li>Clicking the icon opens a feedback form with predefined options</li>
                <li>Users can provide additional comments in a text field</li>
                <li>The system highlights the active paragraph when providing feedback</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Button variant="outline">Learn More About Article Feedback</Button>
        </div>
      </div>

      {/* The feedback component that enables the feedback mechanism */}
      <WordpressArticleFeedback articleSelector=".article-content" />
    </div>
  );
};

export default Index;
