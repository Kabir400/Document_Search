import AuthForm from "../../components/AuthForm";

export const metadata = {
  title: "Login | Amazing App",
  description: "Login to your account",
};

export default function LoginPage() {
  return <AuthForm mode="login" />;
}
