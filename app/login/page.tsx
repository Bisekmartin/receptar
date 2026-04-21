import LoginForm from './LoginForm'

export default function LoginPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl text-stone-800 mb-1">Přihlášení</h1>
          <p className="text-stone-400 text-sm">Administrace receptáře</p>
        </div>
        <div className="card p-8">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
