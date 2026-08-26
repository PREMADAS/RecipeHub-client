"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "react-toastify";


const NAV_LINKS = [
    { href: "/", label: "Home" },
    { href: "/BrowseRecipe", label: "Browse Recipes" },
];

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const [menuOpen, setMenuOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);

    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);

    const profileRef = useRef(null);

    // পেজ লোড হওয়ার সাথে সাথে বর্তমান ইউজার কে জানা আছে কিনা চেক করা (cookie দিয়ে)
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/me`, {
                    method: "GET",
                    credentials: "include",
                });

                if (res.ok) {
                    const data = await res.json();
                    setUser(data.user);
                } else {
                    setUser(null);
                }
            } catch (err) {
                setUser(null);
            } finally {
                setAuthLoading(false);
            }
        };

        fetchUser();
    }, [pathname]); // route বদলালে আবার চেক করবে (যেমন login/register এর পর)

    // profile dropdown এর বাইরে ক্লিক করলে বন্ধ হয়ে যাবে
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setProfileOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = async () => {
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/logout`, {
                method: "POST",
                credentials: "include",
            });
            setUser(null);
            setProfileOpen(false);
            toast.success("Logged out successfully");
            router.push("/");
        } catch (err) {
            toast.error("Failed to log out. Please try again.");
        }
    };

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

                        {user && (
                            <Link
                                href="/private/UserDashboard"
                                className={`relative text-[14.5px] font-medium transition-colors duration-150 ${pathname === "/dashboard"
                                    ? "text-[#2B2118]"
                                    : "text-[#4A3B2C]/70 hover:text-[#2B2118]"
                                    }`}
                            >
                                Dashboard
                                {pathname === "/dashboard" && (
                                    <span className="absolute -bottom-[22px] left-0 right-0 h-[2px] bg-green-700 rounded-full" />
                                )}
                            </Link>
                        )}
                    </nav>

                    {/* Desktop actions */}
                    <div className="hidden md:flex items-center gap-3">
                        {authLoading ? (
                            // লোড হওয়ার সময় flash এড়াতে ছোট placeholder
                            <div className="w-[110px] h-9 rounded-full bg-gray-100 animate-pulse" />
                        ) : user ? (
                            <div className="relative" ref={profileRef}>
                                <button
                                    onClick={() => setProfileOpen((o) => !o)}
                                    className="flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-full border border-[#2B2118]/15 hover:bg-[#2B2118]/5 transition-colors duration-150"
                                >
                                    <div className="w-7 h-7 rounded-full overflow-hidden bg-gray-200 shrink-0">
                                        {user.image ? (
                                            <Image
                                                src={user.image}
                                                alt={user.name}
                                                width={28}
                                                height={28}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-xs font-semibold text-gray-500">
                                                {user.name?.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                    </div>
                                    <span className="text-[13.5px] font-medium text-[#2B2118]">
                                        {user.name}
                                    </span>

                                </button>



                            </div>
                        ) : (
                            <>
                                <Link
                                    href="/Login"
                                    className="text-[13.5px] font-semibold px-4 py-2 rounded-lg border border-[#2B2118]/15 text-[#2B2118] hover:bg-[#2B2118]/5 transition-colors duration-150"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/Register"
                                    className="text-[13.5px] font-semibold px-4 py-2 rounded-lg text-white bg-green-600 shadow-[0_6px_16px_rgba(193,80,46,0.28)] hover:-translate-y-px transition-transform duration-150"
                                >
                                    Register
                                </Link>
                            </>
                        )}
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
                className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${menuOpen ? "max-h-96" : "max-h-0"
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

                    {user && (
                        <Link
                            href="/private/UserDashboard"
                            onClick={() => setMenuOpen(false)}
                            className={`text-[15px] font-medium py-2.5 ${pathname === "/dashboard" ? "text-[#C1502E]" : "text-[#2B2118]"
                                }`}
                        >
                            Dashboard
                        </Link>
                    )}

                    {!authLoading && user ? (
                        <div className="mt-3 pt-3 border-t border-[#E5D9BE]">
                            <div className="flex items-center gap-2.5 mb-3">
                                <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 shrink-0">
                                    {user.image ? (
                                        <Image
                                            src={user.image}
                                            alt={user.name}
                                            width={32}
                                            height={32}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-xs font-semibold text-gray-500">
                                            {user.name?.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                </div>
                                <span className="text-[14px] font-medium text-[#2B2118]">
                                    {user.name}
                                </span>
                            </div>

                        </div>
                    ) : (
                        !authLoading && (
                            <div className="flex gap-3 mt-3">
                                <Link
                                    href="/Login"
                                    onClick={() => setMenuOpen(false)}
                                    className="flex-1 text-center text-[13.5px] font-semibold px-4 py-2.5 rounded-lg border border-[#2B2118]/15 text-[#2B2118]"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/Register"
                                    onClick={() => setMenuOpen(false)}
                                    className="flex-1 text-center text-[13.5px] font-semibold px-4 py-2.5 rounded-lg text-white bg-green-600"
                                >
                                    Register
                                </Link>
                            </div>
                        )
                    )}
                </div>
            </div>
        </header>
    );
}