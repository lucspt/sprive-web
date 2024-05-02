export interface LoginProps {
  className?: string, 
  navOnSuccess?: boolean, 
  redirectPath?: string
}

export interface AccountCredentials {
  email: string,
  password: string,
}