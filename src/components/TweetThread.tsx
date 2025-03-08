"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatThread } from "@/lib/utils/tweet-formatter";
import { Copy } from "lucide-react";
import { toast } from "sonner";

type TweetThreadProps = {
  markdown: string;
};

export function TweetThread({ markdown }: TweetThreadProps) {
  const tweets = formatThread(markdown);

  const copyTweet = (tweet: string) => {
    navigator.clipboard.writeText(tweet);
    toast.success("Tweet copié !");
  };

  const copyThread = () => {
    navigator.clipboard.writeText(tweets.join("\n\n"));
    toast.success("Thread copié !");
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Thread X (Twitter)</h3>
        <Button variant="outline" size="sm" onClick={copyThread}>
          <Copy className="h-4 w-4 mr-2" />
          Copier le thread
        </Button>
      </div>
      <div className="space-y-2">
        {tweets.map((tweet, index) => (
          <Card key={index} className="p-4 relative group">
            <p className="whitespace-pre-line">{tweet}</p>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => copyTweet(tweet)}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
