import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/Authcontext';
import { Button, Card, TextField } from '@mui/material';
import { blueGrey } from '@mui/material/colors';
import { LoginUserInput } from '@/type/users/LoginUserInput';

function LoginPage() {
  const {
    register, handleSubmit, formState: { errors },
  } = useForm<LoginUserInput>();
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data: LoginUserInput) => {
    try {
      await login(data)
      navigate("/")
    } catch (error) {
      alert(error);
    }
  }

  return (
    <>
      <h1>ログイン</h1>
      <Card variant="outlined" sx={{ maxWidth: 400, py: 5, boxShadow: 2, mx: 'auto',  background: blueGrey[900] }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <TextField
              label="メールアドレス"
              error={errors.email_address ? true : false}
              helperText={errors?.email_address?.message}
              margin="normal"
              {...register("email_address", { required: "必須項目です" })}
            />
          </div>
          <div>
            <TextField
              label="パスワード"
              type="password"
              autoComplete="current-password"
              margin="normal"
              error={errors.password ? true : false}
              helperText={errors?.password?.message}
              {...register("password", { required: "必須項目です" })}
            />
          </div>
          <Button sx={{ width: 194, my: 2, fontWeight: 'bold' }} type="submit" variant="contained" color="secondary">ログイン</Button>
        </form>
        <a href='/signup' >アカウントをお持ちでない方はこちら</a>
      </Card>
    </>
  )
}

export default LoginPage
