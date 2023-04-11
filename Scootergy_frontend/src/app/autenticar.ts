export interface Credenciales {
  username: string,
  password: string
}

export interface LoggedInUser {
  id: number,
  token: string,
  username: string
}
