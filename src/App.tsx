import { Route, Routes } from 'react-router-dom'
import '@/App.css'
import { AuthProvider } from '@/context/Authcontext'
import LoginPage from '@/pages/users/login'
import SignupPage from '@/pages/users/signup'
import UserPage from '@/pages/users'
import PrivateRoute from '@/routes/PrivateRoute'
import { createTheme, ThemeProvider } from '@mui/material'
import BookPage from '@/pages/books/book'

const theme = createTheme({
  palette: {
    text: {
      primary: "#fff",
    },
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          color: "inherit",
          "& fieldset": {
            borderColor: "inherit",
          },
          "&: hover fieldset": {
            borderColor: "inherit",
          },
          "&.Mui-focused fieldset": {
            borderColor: "inherit",
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "inherit",
        },
      },
    },
  },
});


function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          <Route element={<PrivateRoute />}>
            <Route path="/" element={<UserPage />} />
            <Route path="/books/:id" element={<BookPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
