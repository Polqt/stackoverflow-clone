import { useState } from "react"


function LoginPage() {
    
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
    }
  return (
    <div>LoginPage</div>
  )
}

export default LoginPage