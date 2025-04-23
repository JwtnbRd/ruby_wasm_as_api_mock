import { useForm } from 'react-hook-form'
import { Button, Card, TextField } from '@mui/material';
import { blueGrey } from '@mui/material/colors';
import { BookInput } from '@/type/books/BookInput';
import axiosInstance from '@/utils/axios';
import { Book } from '@/type/books/Book';
import React from 'react';

interface BookFormProps {
  books: Book[];
  setBooks: React.Dispatch<React.SetStateAction<Book[]>>;
  setIsBookFromVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const BookForm = ({ books, setBooks, setIsBookFromVisible }: BookFormProps) => {
  const {
    register, handleSubmit, formState: { errors },
  } = useForm<BookInput>();

  const postBook = async (data: BookInput) => {
    const response = await axiosInstance.post("http://localhost:3000/books", { book: data });
    return response;
  }

  const onSubmit = async (data: BookInput) => {
    try {
      const response = await postBook(data)
      if (response.status === 201)
      alert("登録に成功しました")
      const prevBooks = books;
      const newBooks = [...prevBooks, response.data]
      setBooks(newBooks)
      setIsBookFromVisible(false)
    } catch (error) {
      alert(error);
    }
  }

  const handleCloseClick = () => {
    setIsBookFromVisible(false)
  }

  return (
    <>
      <Card variant="outlined" sx={{ maxWidth: 500, p: 5, boxShadow: 2, mx: 'auto', background: blueGrey[900] }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <TextField
              label="本のタイトル"
              error={errors.title ? true : false}
              helperText={errors?.title?.message}
              margin="normal"
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
              sx={{ flexGrow: 1, marginRight: 2 }}
              {...register("author", { required: "必須項目です" })}
            />
            <TextField
              label="発行者"
              error={errors.publisher ? true : false}
              helperText={errors?.publisher?.message}
              margin="normal"
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
              fullWidth
              multiline
              rows={4}
              {...register("description", { required: "必須項目です" })}
            />
          </div>
          <Button sx={{ width: 194, my: 2, fontWeight: 'bold', marginRight: 2 }} type="submit" variant="contained" color="secondary">登録</Button>
          <Button sx={{ width: 194, my: 2, fontWeight: 'bold' }} variant="outlined" color="secondary" onClick={handleCloseClick}>閉じる</Button>
        </form>
      </Card>
    </>
  )
}

export default BookForm
