import { LoginForm } from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="glass w-full max-w-md rounded-2xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="text-4xl">🔐</div>
          <h1 className="text-2xl font-bold">Hey stranger!</h1>
          <p className="text-sm text-text-muted">Log in to manage the pack.</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
