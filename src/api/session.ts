import axios from "axios"
import { LoginUserInput } from "@/type/users/LoginUserInput"
import { AuthorizedUser } from "@/type/users/AuthorizedUser"

export const createSession = async (data: LoginUserInput) => {
  const response = await axios.post<AuthorizedUser>("session", {
    user: data
  })
  return response
}

export const deleteSession = async () => {
  const response = await axios.delete("session")
  return response
}