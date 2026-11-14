export interface Usuario {
  id: number
  username: string
  full_name: string
  email: string
  role: string
  disabled: boolean
} 

export interface UsuarioCreatePayload {
  username: string
  full_name: string
  email: string
  password: string
}

