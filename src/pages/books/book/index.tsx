import MenuBar from "@/pages/users/components/menuBar";
import { Book } from "@/type/books/Book";
import axiosInstance from "@/utils/axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import BookEditForm from "./components/bookEditForm";
import ReviewBlock from "./components/reviewBlock";

function BookPage() {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<Book>()

  const getBook = async (id: string | undefined) => {
    try {
      if (id) {
        const response = await axiosInstance.get<Book>(`http://localhost:3000/books/${id}`);
        setBook(response.data)
      }
    } catch {
      alert("本情報の取得に失敗しました")
    }
  }

  useEffect(() => {
    getBook(id)
  }, [])

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '200px' }}>
      <MenuBar />
      {book ?  <BookEditForm book={book} /> : <h1>Loading...</h1>}
      <hr style={{ margin: '50px auto' }} />
      {book && <ReviewBlock book={book} />}
    </div>
  )
}

export default BookPage
