import React from 'react';
import { Star } from 'lucide-react';

interface Book {
  id: string;
  title: string;
  author: string;
  imageLink: string;
  subscriptionRequired: boolean;
  averageRating: number;
}

interface BookCardProps {
  book: Book;
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const { title, author, imageLink, subscriptionRequired, averageRating } = book;

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
      <div className="relative">
        <img 
          src={imageLink} 
          alt={title}
          className="w-full h-64 object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-200"
        />
        {subscriptionRequired && (
          <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full font-medium">
            Premium
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2 leading-tight">
          {title}
        </h3>
        <p className="text-gray-600 text-xs mb-2">{author}</p>
        
        <div className="flex items-center gap-1">
          <Star className="w-3 h-3 text-yellow-400 fill-current" />
          <span className="text-xs text-gray-600">{averageRating}</span>
        </div>
      </div>
    </div>
  );
};

export default BookCard;