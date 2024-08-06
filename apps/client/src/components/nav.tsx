import { ArrowRight, Github } from "lucide-react";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { ModeToggle } from "./mode-toggle";

function Nav() {
  return (
    <nav className="flex items-center justify-between px-6 py-3 border-b">
      <a href="/" className="flex items-center gap-2">
        <img
          src="./public/assets/svg/Icon.svg"
          alt="logo"
          className="dark:hidden"
        />
        <img
          src="./public/assets/svg/Icon-dark.svg"
          alt="logo"
          className="hidden dark:block"
        />
        <h1 className="text-xl font-bold">FileFusion</h1>
      </a>

      <div className="flex items-center gap-3">
        <span className="flex items-center gap-2 text-sm text-muted-foreground">
          Acesse o meu perfil do Github ao lado
          <ArrowRight />
        </span>

        <Separator orientation="vertical" className="h-6" />

        <a href="http://github.com/joaovic-tech/" target="_blank">
          <Button variant="outline">
            <Github className="w-4 h-4 mr-2" />
            Github
          </Button>
        </a>

        <ModeToggle />
      </div>
    </nav>
  );
}

export default Nav;
