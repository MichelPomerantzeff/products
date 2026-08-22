import { SignUp } from "@clerk/react-router";

export default function SignUpPage() {
  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center bg-background text-foreground">
      <SignUp />
    </div>
  );
}
