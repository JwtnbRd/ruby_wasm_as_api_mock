import { Box, Button, Card, CardContent, Typography } from '@mui/material';
import { blueGrey } from '@mui/material/colors';
import { Book } from '@/type/books/Book';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import axiosInstance from '@/utils/axios';
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface BookCardProps {
  book: Book;
}

const BookCard = ({ book }: BookCardProps) => {
  const deleteBook = async (id: string) => {
    const response = await axiosInstance.delete(`http://localhost:3000/books/${id}`);
    return response;
  }
  const navigate = useNavigate();

  const onClickDelete = async (e: React.MouseEvent<HTMLSpanElement>, id: string) => {
    try {
      e.stopPropagation();
      e.preventDefault();
      await deleteBook(id)
      alert("本を削除しました")
      navigate(0)
    } catch {
      alert("本の削除に失敗しました")
    }
  }

  return (
    <a href={`/books/${book.id}`}>
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
        <Box
          sx={{
            width: 100,
            height: 100,
            borderRadius: 2,
            bgcolor: '#fff',
            fontSize: '3rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 2,
          }}
        >
          📗
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
          <CardContent sx={{ flex: '1 0 auto' }} style={{ textAlign: 'left' }}>
            <Typography component="div" variant="h5" sx={{ mb: 1 }}>
              {book.title}
            </Typography>
            <Typography
              variant="subtitle1"
              component="div"
            >
              {book.author}
            </Typography>
            <Typography
              variant="subtitle1"
              component="div"
            >
              {book.publisher}
            </Typography>
          </CardContent>
        </Box>
        <Box>
          <Button
            variant="outlined"
            color="error"
            onClick={(e) => {
              onClickDelete(e, book.id)
            }}
          >
            <DeleteForeverIcon />
          </Button>
        </Box>
      </Card>
    </a>
  )
}

export default BookCard