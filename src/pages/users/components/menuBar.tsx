import { AppBar, Box, Button, TextField, Toolbar, Typography } from "@mui/material";
import { useAuth } from "@/context/Authcontext";
import axiosInstance from "@/utils/axios";
import { useNavigate, useParams } from "react-router-dom";
import SearchIcon from '@mui/icons-material/Search';
import { useEffect, useState } from "react";
import { Book } from "@/type/books/Book";
import { mockAPIRequest } from "@/api/mockAPI";

interface MenuBarProps {
  setBooks: React.Dispatch<React.SetStateAction<Book[]>>;
}

function MenuBar ({ setBooks }: MenuBarProps) {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState<string>('')
  const { id } = useParams<{ id: string }>();
  const deleteSession = async () => {
    // const response = await axiosInstance.delete("http://localhost:3000/session");
    const response = await mockAPIRequest("/delete_session")
    return response;
  };
  const navigate = useNavigate();
  const getSearchedBooks = async (searchQuery: string) => {
    try {
      // const response = await axiosInstance.get<Book[]>(`http://localhost:3000/books?query=${encodeURIComponent(searchQuery)}`);
      const response = await mockAPIRequest(`/books?query=${encodeURIComponent(searchQuery)}`);
      setBooks(response.data)
    } catch {
      alert('本情報の取得に失敗しました')
    }
  }

  useEffect(() => {
    if (!id) {
      getSearchedBooks(searchQuery)
    }
  }, [searchQuery, id])

  const onClickLogout = async () => {
    try {
      await deleteSession();
      navigate("/login")
    } catch {
      alert("ログアウトに失敗しました")
    }
  }

  return (
    <Box sx={{ marginBottom: 6, maxWidth: '100vw' }}>
      <AppBar position="static" color="transparent">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" component="div">
            {user && user.name}さん
          </Typography>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {!!id ||
              <>
                <SearchIcon />
                <TextField
                  label="タイトルまたは著者名"
                  size="small"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{ marginRight: 2 }}
                />
              </>
            }
            <Button onClick={onClickLogout} variant="contained" color="secondary">ログアウト</Button>
          </div>
        </Toolbar>
      </AppBar>
    </Box>
  )
}

export default MenuBar