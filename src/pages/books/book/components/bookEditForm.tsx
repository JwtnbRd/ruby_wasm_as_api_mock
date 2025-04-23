import { useForm } from 'react-hook-form'
import { Button, Card, TextField } from '@mui/material';
import { blueGrey } from '@mui/material/colors';
import { BookInput } from '@/type/books/BookInput';
import axiosInstance from '@/utils/axios';
import { Book } from '@/type/books/Book';
import { useNavigate } from 'react-router-dom';

interface BookEditFormProps {
  book: Book;
}

const BookEditForm = ({ book }: BookEditFormProps) => {
  const {
    register, handleSubmit, formState: { errors },
  } = useForm<BookInput>(
    {
      values: {
        id: book.id,
        title: book.title,
        author: book.author,
        publisher: book.publisher,
        description: book.description,
      }
    }
  );
  const navigate = useNavigate();

  const editBook = async (id: string, data: BookInput) => {
    const response = await axiosInstance.patch(`http://localhost:3000/books/${id}`, { book: data });
    return response;
  }

  const onClickBack = () => {
    navigate("/")
  }

  const onSubmit = async (data: BookInput) => {
    const { id, ...restParams } = data;
    try {
      if (id) {
        const response = await editBook(id, restParams)
        if (response.status === 200)
          alert("本を編集しました")
        navigate("/")
      }
    } catch (error) {
      alert(error);
    }
  }

  return (
    <>
      <Card variant="outlined" sx={{ maxWidth: 500, p: 5, boxShadow: 2, mx: 'auto', background: blueGrey[900] }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input type='hidden' name='id' value={book?.id} />
          <div>
            <TextField
              label="本のタイトル"
              error={errors.title ? true : false}
              helperText={errors?.title?.message}
              margin="normal"
              defaultValue={book.title}
              variant='outlined'
              fullWidth
              {...register("title", { required: "必須項目です" })}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between'}}>
            <TextField
              label="本の著者"
              error={errors.author ? true : false}
              helperText={errors?.author?.message}
              margin="normal"
              defaultValue={book.author}
              variant='outlined'
              sx={{ flexGrow: 1, marginRight: 2 }}
              {...register("author", { required: "必須項目です" })}
            />
            <TextField
              label="発行者"
              error={errors.publisher ? true : false}
              helperText={errors?.publisher?.message}
              margin="normal"
              defaultValue={book.publisher}
              variant='outlined'
              sx={{ flexGrow: 1 }}
              {...register("publisher", { required: "必須項目です" })}
            />
          </div>
          <div>
            <TextField
              label="本の概要"
              error={errors.description ? true : false}
              helperText={errors?.description?.message}
              margin="normal"
              defaultValue={book.description}
              variant='outlined'
              fullWidth
              multiline
              rows={4}
              {...register("description", { required: "必須項目です" })}
            />
          </div>
          <Button sx={{ width: 194, my: 2, fontWeight: 'bold', marginRight: 2 }} type="submit" variant="contained" color="secondary">登録</Button>
          <Button sx={{ width: 194, my: 2, fontWeight: 'bold' }} variant="outlined" onClick={onClickBack} color="secondary">戻る</Button>
        </form>
      </Card>
    </>
  )
}

export default BookEditForm
