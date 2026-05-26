import { LoginForm } from "./LoginForm";

export const metadata = { title: "Admin login" };

export default function AdminLoginPage() {
  return (
    <main className="container-shell grid min-h-screen place-items-center py-12" dir="ltr" lang="en">
      <section className="w-full max-w-md">
        <p className="text-sm font-bold text-stone">Azadi Coffee</p>
        <h1 className="mt-3 text-4xl font-bold">Admin login</h1>
        <p className="mt-4 leading-7 text-stone">
          Use the production admin credentials configured in environment variables.
        </p>
        <div className="mt-6">
          <LoginForm />
        </div>
      </section>
    </main>
  );
}
