"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import BookCard from "@/components/BookCard";
import Link from "next/link";

interface Book {
  id: string;
  author: string;
  title: string;
  imageLink: string;
  subscriptionRequired: boolean;
  // add other needed props
}

export default function ForYouPage() {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [recommendedBooks, setRecommendedBooks] = useState<Book[]>([]);
  const [suggestedBooks, setSuggestedBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBooks() {
      setLoading(true);
      try {
        const selectedRes = await fetch(
          "https://us-central1-summaristt.cloudfunctions.net/getBooks?status=selected"
        );
        const selectedData = await selectedRes.json();
        setSelectedBook(selectedData);

        const recommendedRes = await fetch(
          "https://us-central1-summaristt.cloudfunctions.net/getBooks?status=recommended"
        );
        const recommendedData = await recommendedRes.json();
        setRecommendedBooks(recommendedData);

        const suggestedRes = await fetch(
          "https://us-central1-summaristt.cloudfunctions.net/getBooks?status=suggested"
        );
        const suggestedData = await suggestedRes.json();
        setSuggestedBooks(suggestedData);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
      setLoading(false);
    }

    fetchBooks();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header at the top */}
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-extrabold mb-8">For You</h1>

        {loading ? (
          <p>Loading books...</p>
        ) : (
          <>
            {/* Selected Book */}
            {selectedBook && (
              <section className="mb-12">
                <h2 className="text-2xl font-semibold mb-4">Selected Book</h2>
                <Link href={`/book/${selectedBook.id}`}>
                  <a>
                    <BookCard book={selectedBook} />
                  </a>
                </Link>
              </section>
            )}

            {/* Recommended Books */}
            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Recommended Books</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {recommendedBooks.map((book) => (
                  <Link key={book.id} href={`/book/${book.id}`}>
                    <a>
                      <BookCard book={book} />
                    </a>
                  </Link>
                ))}
              </div>
            </section>

            {/* Suggested Books */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Suggested Books</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {suggestedBooks.map((book) => (
                  <Link key={book.id} href={`/book/${book.id}`}>
                    <a>
                      <BookCard book={book} />
                    </a>
                  </Link>
                ))}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
