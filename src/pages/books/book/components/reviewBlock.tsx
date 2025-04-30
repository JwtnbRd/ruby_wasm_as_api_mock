import axiosInstance from '@/utils/axios';
import { Book } from '@/type/books/Book';
import { useEffect, useState } from 'react';
import BookReviewForm from './bookReviewForm';
import { Review } from '@/type/review/Review';
import ReviewCard from './ReviewCard';
import { mockAPIRequest } from '@/api/mockAPI';

interface ReviewFormProps {
  book: Book;
}

const ReviewBlock = ({ book }: ReviewFormProps) => {
  const [review, setReview] = useState<Review | null>(null);
  const getReviews = async () => {
    // const response = await axiosInstance.get<Review>(`http://localhost:3000/books/${book.id}/reviews`);
    const response = await mockAPIRequest(`/books/${book.id}/reviews`)
    setReview(response.data)
  };

  useEffect(() => {
    getReviews();
  }, [])

  return (
    <>
    {review ?
      <>
        <h2>この本のレビュー</h2>
        <ReviewCard review={review} book={book} />
      </>
    :
      <>
        <h2>この本をレビューする</h2>
        <BookReviewForm book={book} />
      </>
    }
    </>
  )
}

export default ReviewBlock
