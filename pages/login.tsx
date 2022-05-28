import { signIn } from "next-auth/react";
import Image from "next/image";
import Layout from "../components/Layout";

export default function Login() {
  const handleLogin = () => {
    signIn("spotify", { callbackUrl: "http://localhost:3000" });
  };

  return (
    <Layout title="Login to Spotify">
      <div className="flex flex-col items-center justify-center w-screen h-screen gap-20  bg-black">
        <Image
          src="https://rb.gy/y9mwtb"
          alt="spotify logo"
          width={350}
          height={300}
          objectFit="contain"
        />
        <button
          className="flex px-12 py-2 text-lg tracking-widest uppercase rounded-full focus:outline-none bg-primary hover:bg-opacity-80"
          onClick={handleLogin}
        >
          Login to spotify
        </button>
      </div>
    </Layout>
  );
}