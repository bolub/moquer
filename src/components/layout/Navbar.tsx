import React from "react";
// import { Button } from "../ui/button";
import Link from "next/link";

export const Navbar = () => {
  return (
    <nav className="container mx-auto mt-16 flex w-full justify-between items-center">
      <Link href="/" className="font-bold text-lg">
        Moquer
      </Link>

      {/* <div className="flex gap-4">
        <Button asChild>
          <Link href="/login">Login</Link>
        </Button>
      </div> */}
    </nav>
  );
};
