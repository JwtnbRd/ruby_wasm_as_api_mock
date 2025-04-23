import { Box, Button, Card, CardContent, Typography } from '@mui/material';
import { blueGrey } from '@mui/material/colors';
import { Book } from '@/type/books/Book';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import axiosInstance from '@/utils/axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Review } from '@/type/review/Review';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import BookReviewForm from './bookReviewForm';
import EditIcon from '@mui/icons-material/Edit';

interface BookReviewCardProps {
  review: Review;
  book: Book;
}

const ReviewCard = ({ review, book }: BookReviewCardProps) => {
  const deleteReview = async () => {
    const response = await axiosInstance.delete(`http://localhost:3000/books/${book.id}/reviews`);
    return response;
  }
  const navigate = useNavigate();
  const [isUpdating, setIsUpdating] = useState(false)

  const onClickDelete = async (e: React.MouseEvent<HTMLSpanElement>) => {
    try {
      e.stopPropagation();
      e.preventDefault();
      await deleteReview()
      alert("レビューを削除しました")
      navigate(0)
    } catch {
      alert("レビューの削除に失敗しました")
    }
  }

  const onClickEdit = async (e: React.MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation();
    e.preventDefault();
    setIsUpdating(true)
  }

  return (
    <>
    {isUpdating ?
      <BookReviewForm review={review} book={book} setIsUpdating={setIsUpdating} />
      :
      <Card
        variant="outlined"
        sx={{
          display: 'flex',
          alignItems: 'center',
          maxWidth: 500,
          px: 5,
          py: 1,
          boxShadow: 2,
          mx: 'auto',
          my: 3,
          background: blueGrey[900],
          '&:hover': {
            cursor: 'pointer',
            bgcolor: 'primary.dark',
            transition: 'all 0.5s 0.1s ease'
          },
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
          <CardContent sx={{ flex: '1 0 auto' }} style={{ textAlign: 'left' }}>
            <Typography component="div" variant="h5" sx={{ mb: 1 }}>
              {[...Array(5)].map((_, i) => {
                if ((i + 1) <= review.rating) {
                  return <StarIcon />
                } else {
                  return <StarBorderIcon />
                }
              })}
            </Typography>
            <Typography
              variant="subtitle1"
              component="div"
            >
              {review.created_at}
            </Typography>
            <Typography
              variant="subtitle1"
              component="div"
            >
              {review.comment}
            </Typography>
          </CardContent>
        </Box>
        <Box>
          <Button
            variant="outlined"
            color="secondary"
            onClick={(e) => {
              onClickEdit(e)
            }}
          >
            <EditIcon />
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={(e) => {
              onClickDelete(e)
            }}
          >
            <DeleteForeverIcon />
          </Button>
        </Box>
      </Card>
    }
    </>
  )
}

export default ReviewCard