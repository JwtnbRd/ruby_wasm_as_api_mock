import { useForm } from 'react-hook-form'
import { Button, Card, TextField } from '@mui/material';
import { blueGrey } from '@mui/material/colors';
import axiosInstance from '@/utils/axios';
import { useNavigate } from 'react-router-dom';
import { ReviewInput } from '@/type/review/reviewInput';
import { Book } from '@/type/books/Book';

interface ReviewFormProps {
  review?: ReviewInput;
  book: Book;
  setIsUpdating?: React.Dispatch<React.SetStateAction<boolean>>;
}

const BookReviewForm = ({ review, book, setIsUpdating }: ReviewFormProps) => {
  const {
    register, handleSubmit, formState: { errors },
  } = useForm<ReviewInput>(
    {
      values: {
        rating: review?.rating || 0,
        comment: review?.comment || '',
      }
    }
  );
  const navigate = useNavigate();

  const postReview = async (data: ReviewInput) => {
    const response = await axiosInstance.post(`http://localhost:3000/books/${book.id}/reviews`, { review: data });
    return response;
  }

  const updateReview = async (data: ReviewInput) => {
    const response = await axiosInstance.patch(`http://localhost:3000/books/${book.id}/reviews`, { review: data });
    return response;
  }

  const onClickQuit = () => {
    if (!setIsUpdating) return

    setIsUpdating(false)
  }

  const onSubmit = async (data: ReviewInput) => {
    try {
      const response = review ? await updateReview(data) : await postReview(data)
      if (response.status === 201) {
        alert("レビューを追加しました")
      } else if (response.status === 200 ) {
        alert("レビューを更新しました")
      }
      navigate(0)
    } catch (error) {
      alert(error);
    }
  }

  return (
    <>
      <Card variant="outlined" sx={{ maxWidth: 500, p: 5, boxShadow: 2, mx: 'auto', background: blueGrey[900] }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <TextField
              id="outlined-number"
              label="Number"
              type="number"
              fullWidth
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
              {...register("rating", { valueAsNumber: true, required: "必須項目です" })}
            />
          </div>
          <div>
            <TextField
              label="コメント"
              error={errors.comment ? true : false}
              helperText={errors?.comment?.message}
              margin="normal"
              defaultValue={review?.comment}
              variant='outlined'
              fullWidth
              multiline
              rows={4}
              {...register("comment", { required: "必須項目です" })}
            />
          </div>
          <Button sx={{ width: 194, my: 2, fontWeight: 'bold', marginRight: 2 }} type="submit" variant="contained" color="secondary">レビューする</Button>
          {review && <Button sx={{ width: 194, my: 2, fontWeight: 'bold'}} onClick={() => onClickQuit()} variant="outlined" color="secondary">戻る</Button>}
        </form>
      </Card>
    </>
  )
}

export default BookReviewForm
