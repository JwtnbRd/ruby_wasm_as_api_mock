import { Book } from '@/type/books/Book';
import BookCard from './bookCard';

interface BookListProps {
  books: Book[];
}

const BookList = ({ books }: BookListProps) => {
  return (
    <>
      {books?.map((book) => <BookCard book={book} />)}
    </>
  )
}

export default BookList