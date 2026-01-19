import AuthForm from "../../components/AuthForm";

export const metadata = {
  title: "Sign Up | Amazing App",
  description: "Create a new account",
};

export default function SignupPage() {
  return <AuthForm mode="signup" />;
}
