import { SignUp } from "@clerk/react-router";
import { Link } from "react-router";

export default function SignUpPage() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center">
      <Link to="/">
        <h2 className="text-2xl font-bold mb-4">Home</h2>
      </Link>
      <SignUp />
    </div>
  );
}
