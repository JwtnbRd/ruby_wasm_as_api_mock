import { AuthorizedUser } from "../type/users/AuthorizedUser"
import axios from "../utils/axios"

export const getUser = async () => {
  const response = await axios.get<AuthorizedUser>("/users")
  return response
}