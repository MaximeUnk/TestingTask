'use client';

import React, { useState, useEffect } from 'react';
import { Review } from '@/types';

interface ReviewCardProps {
  review: Review;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  const [sanitizedHTML, setSanitizedHTML] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      import('dompurify').then((DOMPurify) => {
        const cleaned = DOMPurify.default.sanitize(review.text, {
          ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
          ALLOWED_ATTR: []
        });
        setSanitizedHTML(cleaned);
      }).catch(() => {
        setSanitizedHTML(review.text.replace(/<[^>]*>/g, ''));
      });
    }
  }, [review.text, isClient]);

  if (!isClient || !sanitizedHTML) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
        <div className="prose prose-sm max-w-none text-gray-700">
          <p>{review.text.replace(/<[^>]*>/g, '')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
      <div 
        className="prose prose-sm max-w-none text-gray-700"
        dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
      />
    </div>
  );
}; 