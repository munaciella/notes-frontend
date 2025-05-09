import Link from "next/link";
import { SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import logo from "../../public/logo.png";
import ThemeToggle from "./theme/ThemeToggle";

const Navbar = () => {
  return (
    <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-md transition-colors duration-300 bg-white/80 dark:bg-slate-900/80 shadow">
      <div className="flex items-center justify-between px-2 md:px-4 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src={logo}
            alt="Logo"
            width={60}
            height={60}
            priority
          />
          <span className="text-lg font-bold text-gray-900 dark:text-white">
            Notes
          </span>
        </Link>

        {/* Dashboard, Auth & Toggle */}
        <div className="flex items-center space-x-2 mr-2">
          <Link href="/notes" passHref>
            <Button 
            variant="link"
            className="cursor-pointer"
            >Notes</Button>
          </Link>

            <ThemeToggle />
          <UserButton />
          <SignedOut>
            <SignInButton
              mode="modal"
              forceRedirectUrl="/dashboard"
              fallbackRedirectUrl="/"
            />
          </SignedOut>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
