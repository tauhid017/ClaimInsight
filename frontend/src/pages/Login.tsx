import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useToast } from "@/hooks/use-toast";

import { auth, googleProvider, db } from "@/lib/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
  UserCredential,
} from "firebase/auth";

import { setDoc, doc, serverTimestamp } from "firebase/firestore";

export default function Login() {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");

  const navigate = useNavigate();
  const { toast } = useToast();

  // =====================================================
  // 🔥 EMAIL / PASSWORD LOGIN + SIGNUP
  // =====================================================
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      let userCredential: UserCredential;

      if (isLogin) {
        // LOGIN
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      } else {
        // SIGNUP
        userCredential = await createUserWithEmailAndPassword(auth, email, password);

        // Add display name
        await updateProfile(userCredential.user, { displayName: name });

        // Save user to Firestore
        await setDoc(
          doc(db, "users", userCredential.user.uid),
          {
            uid: userCredential.user.uid,
            name: name,
            email: email,
            provider: "email",
            createdAt: serverTimestamp(),
          },
          { merge: true }
        );
      }

      const user = userCredential.user;

      // Save authenticated user locally
      localStorage.setItem(
        "user",
        JSON.stringify({
          email: user.email,
          name: user.displayName ?? name,
          uid: user.uid,
        })
      );

      toast({
        title: isLogin ? "Login Successful" : "Signup Successful",
        description: isLogin ? "Welcome back!" : "Your account has been created.",
      });

      navigate("/upload");
    } catch (error: any) {
      toast({
        title: "Authentication Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // =====================================================
  // 🔥 GOOGLE LOGIN + SAVE TO FIRESTORE
  // =====================================================
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Save user in Firestore
      await setDoc(
        doc(db, "users", user.uid),
        {
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          photo: user.photoURL,
          provider: "google",
          createdAt: serverTimestamp(),
        },
        { merge: true }
      );

      // Save user locally
      localStorage.setItem(
        "user",
        JSON.stringify({
          email: user.email,
          name: user.displayName,
          uid: user.uid,
          photo: user.photoURL,
        })
      );

      toast({
        title: "Google Login Successful",
        description: `Welcome ${user.displayName}`,
      });

      navigate("/upload");
    } catch (error: any) {
      toast({
        title: "Google Login Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple via-purple-light to-cyan flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-cyan rounded-lg px-3 py-2 font-bold text-white text-xl">
              CI
            </div>
            <h1 className="text-cyan text-3xl font-bold">ClaimInsight</h1>
          </div>

          <CardTitle>{isLogin ? "Welcome Back" : "Create Account"}</CardTitle>
          <CardDescription>
            {isLogin ? "Login to your account" : "Sign up for a new account"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={!isLogin}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full">
              {isLogin ? "Login" : "Sign Up"}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>

            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          {/* GOOGLE LOGIN BUTTON */}
          <Button variant="outline" className="w-full" onClick={handleGoogleLogin}>
            <svg
              className="mr-2 h-4 w-4"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="currentColor"
                d="M21.35 11.1H12v2.8h5.35c-.25 1.45-1.5 4.25-5.35 4.25-3.25 0-5.9-2.7-5.9-6s2.65-6 5.9-6c1.85 0 3.1.8 3.8 1.5l2.6-2.5C16.35 3.5 14.35 2.5 12 2.5 6.85 2.5 2.5 6.9 2.5 12s4.35 9.5 9.5 9.5c5.5 0 9.15-3.9 9.15-9.4 0-.65-.1-1.1-.15-1.6Z"
              />
            </svg>
            Continue with Google
          </Button>

          {/* SWITCH LOGIN/SIGNUP */}
          <div className="mt-4 text-center text-sm">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <Button
              variant="link"
              className="ml-1 text-primary"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Sign up" : "Login"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
