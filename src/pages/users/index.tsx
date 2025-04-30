import { Button } from "@mui/material"
import BookForm from "./components/bookForm"
import MenuBar from "./components/menuBar"
import BookList from "./components/bookList"
import { useEffect, useState } from "react"
import { Book } from "@/type/books/Book"
import { mockAPIRequest } from "@/api/mockAPI"

function UserPage() {
  const [books, setBooks] = useState<Book[]>([])
  const [isBookFormVisible, setIsBookFromVisible] = useState(false)
  const getBooks = async () => {
    try {
    // const response = await axiosInstance.get<Book[]>("http://localhost:3000/books");
    const response = await mockAPIRequest("/books");
    setBooks(response.data)
    } catch {
      alert('本情報の取得に失敗しました')
    }
  }

  useEffect(() => {
    getBooks()
  }, [])

  const handleAddClick = () => {
    setIsBookFromVisible(true)
  }


  return (
    <div style={{ minHeight: '100vh', paddingBottom: '200px' }}>
      <MenuBar setBooks={setBooks} />
      {isBookFormVisible ?
        <BookForm books={books} setBooks={setBooks} setIsBookFromVisible={setIsBookFromVisible} />
        :
        <span style={{ marginRight: 'auto' }}>
          <Button variant="contained" onClick={handleAddClick} color="secondary">本を登録する</Button>
        </span>
      }
      <BookList books={books} />
    </div>
  )
}

export default UserPage
