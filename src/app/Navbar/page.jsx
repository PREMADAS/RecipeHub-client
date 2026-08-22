"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
    { href: "/", label: "Home" },
    { href: "/browse", label: "Browse Recipes" },
];

export default function Navbar() {
    const pathname = usePathname();
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 bg-white backdrop-blur-md border-b border-[#E5D9BE]">
            <div className="max-w-6xl mx-auto px-6">
                <div className="flex items-center justify-between h-[68px]">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 shrink-0">
                        <Image
                            src="/Logo.png"
                            alt="RecipeHub logo"
                            width={250}
                            height={250}
                            className="object-contain"
                            priority
                        />

                    </Link>

                    {/* Desktop links */}
                    <nav className="hidden md:flex items-center gap-9">
                        {NAV_LINKS.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`relative text-[14.5px] font-medium transition-colors duration-150 ${isActive
                                        ? "text-[#2B2118]"
                                        : "text-[#4A3B2C]/70 hover:text-[#2B2118]"
                                        }`}
                                >
                                    {link.label}
                                    {isActive && (
                                        <span className="absolute -bottom-[22px] left-0 right-0 h-[2px] bg-green-700 rounded-full" />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Desktop actions */}
                    <div className="hidden md:flex items-center gap-3">
                        <Link
                            href="/login"
                            className="text-[13.5px] font-semibold px-4 py-2 rounded-lg border border-[#2B2118]/15 text-[#2B2118] hover:bg-[#2B2118]/5 transition-colors duration-150"
                        >
                            Login
                        </Link>
                        <Link
                            href="/register"
                            className="text-[13.5px] font-semibold px-4 py-2 rounded-lg text-white bg-green-600 shadow-[0_6px_16px_rgba(193,80,46,0.28)] hover:-translate-y-px transition-transform duration-150"
                        >
                            Register
                        </Link>
                    </div>

                    {/* Mobile hamburger */}
                    <button
                        onClick={() => setMenuOpen((o) => !o)}
                        className="md:hidden w-9 h-9 flex flex-col items-center justify-center gap-[5px]"
                        aria-label="Toggle menu"
                    >
                        <span
                            className={`block w-5 h-[2px] bg-[#2B2118] transition-transform duration-200 ${menuOpen ? "rotate-45 translate-y-[7px]" : ""
                                }`}
                        />
                        <span
                            className={`block w-5 h-[2px] bg-[#2B2118] transition-opacity duration-200 ${menuOpen ? "opacity-0" : "opacity-100"
                                }`}
                        />
                        <span
                            className={`block w-5 h-[2px] bg-[#2B2118] transition-transform duration-200 ${menuOpen ? "-rotate-45 -translate-y-[7px]" : ""
                                }`}
                        />
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            <div
                className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${menuOpen ? "max-h-72" : "max-h-0"
                    }`}
            >
                <div className="px-6 pb-5 flex flex-col gap-1 border-t border-[#E5D9BE] pt-4">
                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setMenuOpen(false)}
                            className={`text-[15px] font-medium py-2.5 ${pathname === link.href ? "text-[#C1502E]" : "text-[#2B2118]"
                                }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <div className="flex gap-3 mt-3">
                        <Link
                            href="/login"
                            onClick={() => setMenuOpen(false)}
                            className="flex-1 text-center text-[13.5px] font-semibold px-4 py-2.5 rounded-lg border border-[#2B2118]/15 text-[#2B2118]"
                        >
                            Login
                        </Link>
                        <Link
                            href="/register"
                            onClick={() => setMenuOpen(false)}
                            className="flex-1 text-center text-[13.5px] font-semibold px-4 py-2.5 rounded-lg text-white bg-green-600"
                        >
                            Register
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
}