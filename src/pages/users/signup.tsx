import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/Authcontext';
import { Button, Card, TextField } from '@mui/material';
import { SignupUserInput } from '@/type/users/SignupUserInput';
import axiosInstance from '@/utils/axios';
import { blueGrey } from '@mui/material/colors';

function SignupPage() {
  const {
    register, handleSubmit, formState: { errors },
  } = useForm<SignupUserInput>();
  const { login } = useAuth();
  const navigate = useNavigate();

  const postUser = async (data: SignupUserInput) => {
    const response = await axiosInstance.post("http://localhost:3000/users", { user: data });
    return response;
  };

  const onSubmit = async (data: SignupUserInput) => {
    try {
      const response = await postUser(data)
      if (response.status === 201) {
        alert("登録に成功しました")
        const loginInput = {
          email_address: data.email_address,
          password: data.password
        }
        await login(loginInput)
        navigate("/")
      } else {
        throw new Error("登録に失敗しました");
      }
    } catch (error) {
      alert(error);
    }
  }

  return (
    <>
      <h1>サインアップ</h1>
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
              label="ユーザー名"
              error={errors.name ? true : false}
              helperText={errors?.name?.message}
              margin="normal"
              {...register("name", { required: "必須項目です" })}
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
          <div>
            <TextField
              label="パスワード（確認）"
              type="password"
              autoComplete="current-password"
              margin="normal"
              error={errors.password_confirmation ? true : false}
              helperText={errors?.password_confirmation?.message}
              {...register("password_confirmation", { required: "必須項目です" })}
            />
          </div>
          <Button sx={{ width: 194, mt: 2 }} type="submit" variant="contained" color="secondary">サインアップ</Button>
        </form>
      </Card>
    </>
  )
}

export default SignupPage
