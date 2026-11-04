"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Services", href: "#services" },
    { name: "Projects", href: "#projects" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-foreground/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Section: Logo + Text Lockup moved here */}
          <a href="#home" className="group flex items-center gap-3 cursor-pointer select-none">
            <Logo />
            <div className="flex flex-col justify-center leading-none">
              <span className="text-base font-extrabold tracking-wider text-foreground uppercase">
                Siddesh Shewde
              </span>
              <span className="text-[10px] font-semibold tracking-widest text-foreground/60 uppercase mt-1">
                Software Engineer
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                className="text-foreground/80 hover:text-accent transition-colors text-sm font-medium"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="text-foreground p-1"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden bg-background border-b border-foreground/10 shadow-lg">
          <div className="px-4 pt-2 pb-4 space-y-2">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 text-base font-medium text-foreground/80 hover:text-accent hover:bg-foreground/5 rounded-md"
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}