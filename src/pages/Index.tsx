
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import WordpressArticleFeedback from '@/components/WordpressArticleFeedback';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ArrowRight, Download } from 'lucide-react';

const Index = () => {
  const articleRef = useRef<HTMLDivElement>(null);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Article Whisperer Feedback</h1>
          <p className="text-gray-600">Hover over paragraphs to provide feedback</p>
          
          <div className="mt-6 flex justify-center gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="default" className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Installation Guide
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>WordPress Installation</SheetTitle>
                  <SheetDescription>
                    Follow these steps to add feedback to your WordPress site
                  </SheetDescription>
                </SheetHeader>
                
                <div className="mt-6 space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Step 1: Download Files</h3>
                    <p className="text-sm text-gray-600">
                      Download the plugin files by clicking the button below.
                    </p>
                    <Button className="mt-3" size="sm">
                      Download Plugin (.zip)
                    </Button>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Step 2: Upload to WordPress</h3>
                    <p className="text-sm text-gray-600">
                      In your WordPress admin, go to Plugins → Add New → Upload Plugin and select the downloaded zip file.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Step 3: Activate</h3>
                    <p className="text-sm text-gray-600">
                      After installation, click "Activate Plugin" to enable it on your site.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Step 4: Customize (Optional)</h3>
                    <p className="text-sm text-gray-600">
                      If needed, edit the article-feedback.php file to change the article selector to match your theme.
                    </p>
                  </div>
                  
                  <Button variant="outline" onClick={() => window.open('/wordpress-integration-guide.md', '_blank')}>
                    View Full Documentation
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
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
                More ⋮ and then Not &lt;topic&gt; ⓘ.
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
      </div>

      {/* The feedback component that enables the feedback mechanism */}
      <WordpressArticleFeedback articleSelector=".article-content" />
    </div>
  );
};

export default Index;
