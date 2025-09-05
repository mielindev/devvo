import { SignedIn, UserButton } from "@clerk/nextjs";
import { Puzzle } from "lucide-react";
import Link from "next/link";
import { ModeToggle } from "./ModeToggle";
import DashboardBtn from "./DashboardBtn";
const Navbar = () => {
  return (
    <nav className="border-b">
      <div className="flex h-16 items-center px-4 container mx-auto">
        {/* Left side */}
        <Link
          href={"/"}
          className="flex items-center gap-2 font-semibold text-2xl mr-6 font-mono hover:opacity-80 transition-opacity"
        >
          <Puzzle className="size-8 text-blue-500" />
          <span className="bg-gradient-to-r from-blue-500 to-sky-400 bg-clip-text text-transparent">
            Devvo
          </span>
        </Link>

        {/* Right Side */}
        <SignedIn>
          <div className="flex items-center space-x-4 ml-auto">
            <DashboardBtn />
            <ModeToggle />
            <UserButton />
          </div>
        </SignedIn>
      </div>
    </nav>
  );
};

export default Navbar;
