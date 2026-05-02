"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import {
  FiShoppingBag,
  FiUser,
  FiMenu,
  FiX,
  FiSearch,
  FiLogOut,
  FiPackage,
  FiPhone,
  FiMail,
} from "react-icons/fi";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { IoPersonOutline } from "react-icons/io5";

import { useCartStore } from "@/store/cartStore";
import { useRouter, usePathname } from "next/navigation";
import axios from "axios";
import NavbarHeadSliderLine from "./NavbarHeadSliderLine";

interface Category {
  _id: string;
  name: string;
  showInNav?: boolean;
}

interface NavbarProps {
  initialLogo?: string;
}

export default function Navbar({ initialLogo = "/logomain.png" }: NavbarProps) {
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [siteLogo, setSiteLogo] = useState(initialLogo);
  const [footerData, setFooterData] = useState<any>(null);
  const totalItems = useCartStore((state) => state.getTotalItems());
  const router = useRouter();
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith("/auth");
  const isAdminPage = pathname?.startsWith("/admin");
  const isSearchPage = pathname?.startsWith("/search");

  useEffect(() => {
    setIsMounted(true);
    fetchCategories();
    fetchSiteLogo();
    fetchFooterData();
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get("/api/categories");
      const data = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.categories)
          ? res.data.categories
          : [];
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
    }
  };

  const fetchSiteLogo = async () => {
    try {
      const { data } = await axios.get("/api/settings/site");
      if (data && data.logo) {
        setSiteLogo(data.logo);
      }
    } catch (error) {
      console.error("Error fetching site logo:", error);
    }
  };
  const fetchFooterData = async () => {
    try {
      const { data } = await axios.get("/api/settings/footer");
      setFooterData(data);
    } catch (error) {
      console.error("Error fetching footer data:", error);
    }
  };

  if (isAdminPage || isSearchPage || isAuthPage) return null;

  const flatCategories = categories
    .filter((c) => c.showInNav !== false)
    .slice(0, 10);

  return (
    <>
      {/* Banner stays full-width at top */}
      <NavbarHeadSliderLine />

      {/* Floating Pill Navbar */}
      <div className="sticky top-3 z-[9991] w-full px-4 sm:px-8 lg:px-12 pointer-events-none mb-6">
        <nav
          className={`pointer-events-auto mx-auto rounded-2xl backdrop-blur-xl border transition-all duration-300 ${
            scrolled
              ? "border-white/40 shadow-[0_12px_40px_rgba(0,0,0,0.18)]"
              : "border-transparent shadow-none"
          }`}
          style={{
            backgroundColor: scrolled
              ? "rgba(255,255,255,0.15)"
              : "transparent",
            color: "var(--navbar-text, #111827)",
          }}
        >
          <div className="w-full px-6 sm:px-10">
            <div className="flex justify-between items-center min-h-[4rem] py-2 relative">
              {/* Left Section: Mobile Menu & Logo / Desktop Categories */}
              <div className="flex flex-1 justify-start items-center gap-2 md:gap-0">
                {/* Mobile Menu Button */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="md:hidden p-2 -ml-2 text-gray-600 hover:text-black hover:bg-gray-100/80 rounded-full transition-all duration-300"
                >
                  {isMobileMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
                </button>

                {/* Logo (Center on Mobile and Desktop) */}
                <Link
                  href="/"
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center hover:opacity-80 transition-opacity shrink-0"
                >
                  <Image
                    src={siteLogo}
                    alt="Taiba Traders"
                    width={90}
                    height={48}
                    priority
                    sizes="90px"
                    style={{ height: "auto", width: "auto" }}
                  />
                </Link>

                {/* Desktop Categories */}
                <div className="hidden md:flex items-center gap-5 flex-wrap">
                  {flatCategories.length > 0 && (
                    <>
                      <Link
                        href="/"
                        className="group relative text-[11px] md:text-[12px] uppercase font-medium text-[var(--navbar-text)] hover:opacity-80 tracking-widest whitespace-nowrap transition-colors duration-300"
                      >
                        Home
                        <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-[var(--navbar-text)] transition-all duration-300 group-hover:w-full"></span>
                      </Link>
                      {flatCategories.map((cat) => (
                        <Link
                          key={cat._id}
                          href={`/products?category=${cat._id}`}
                          className="group relative text-[11px] md:text-[12px] uppercase font-medium text-[var(--navbar-text)] hover:opacity-80 tracking-widest whitespace-nowrap transition-colors duration-300"
                        >
                          {cat.name}
                          <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-[var(--navbar-text)] transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                      ))}
                      <div className="flex items-center gap-5 ml-2 border-l border-gray-200/60 pl-6">
                        <Link
                          href="/about"
                          className="group relative text-[11px] md:text-[12px] uppercase font-medium text-[var(--navbar-text)] hover:opacity-80 tracking-widest whitespace-nowrap transition-colors duration-300"
                        >
                          About Us
                          <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-[var(--navbar-text)] transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                        <Link
                          href="/contact"
                          className="group relative text-[11px] md:text-[12px] uppercase font-medium text-[var(--navbar-text)] hover:opacity-80 tracking-widest whitespace-nowrap transition-colors duration-300"
                        >
                          Contact Us
                          <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-[var(--navbar-text)] transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Right Section: Socials, Contact, Icons (Search, Cart, Profile, Mobile Menu) */}
              <div className="flex flex-1 justify-end items-center space-x-1 md:space-x-4">
                {/* Desktop Socials & Contact */}
                <div className="hidden lg:flex items-center border-r border-gray-200/60 pr-4 mr-1 space-x-3">
                  {footerData?.contact?.phone && (
                    <a
                      href={`tel:${footerData.contact.phone}`}
                      className="flex items-center gap-1.5 text-[11px] font-medium text-gray-500 hover:text-black transition-colors"
                      title={footerData.contact.phone}
                    >
                      <FiPhone size={13} />
                      <span className="hidden xl:inline">
                        {footerData.contact.phone}
                      </span>
                    </a>
                  )}
                  {footerData?.contact?.email && (
                    <a
                      href={`mailto:${footerData.contact.email}`}
                      className="flex items-center gap-1.5 text-[11px] font-medium text-gray-500 hover:text-black transition-colors"
                      title={footerData.contact.email}
                    >
                      <FiMail size={13} />
                    </a>
                  )}
                  <div className="h-3 w-px bg-gray-200 mx-1"></div>
                  {footerData?.socials?.facebook && (
                    <a
                      href={footerData.socials.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-[#1877F2] transition-colors"
                    >
                      <FaFacebookF size={14} />
                    </a>
                  )}
                  {footerData?.socials?.instagram && (
                    <a
                      href={footerData.socials.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-[#E4405F] transition-colors"
                    >
                      <FaInstagram size={15} />
                    </a>
                  )}
                </div>

                <button
                  onClick={() => router.push("/search")}
                  className="p-2 text-gray-600 hover:text-black hover:bg-gray-100/80 rounded-full transition-all duration-300 cursor-pointer"
                  title="Search products"
                >
                  <FiSearch size={20} />
                </button>

                {/* Desktop Admin Link */}
                {session?.user.role === "admin" && (
                  <Link
                    href="/admin"
                    className="hidden md:block text-sm font-medium text-gray-700 hover:text-gray-900"
                  >
                    Admin
                  </Link>
                )}

                {/* Cart */}
                <button
                  onClick={() => useCartStore.getState().openCart()}
                  className="hidden md:block relative p-2 text-gray-600 hover:text-black hover:bg-gray-100/80 rounded-full transition-all duration-300 cursor-pointer"
                >
                  <FiShoppingBag size={20} />
                  {isMounted && totalItems > 0 && (
                    <span
                      className="absolute -top-1 -right-1 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-medium"
                      style={{
                        backgroundColor: "var(--navbar-badge-color, #111827)",
                      }}
                    >
                      {totalItems}
                    </span>
                  )}
                </button>

                {/* Profile */}
                <div className="hidden md:block">
                  {session ? (
                    <div className="relative group">
                      <button className="flex items-center space-x-2 p-1 text-gray-600 hover:text-black hover:bg-gray-100/80 rounded-full transition-all duration-300">
                        {session.user.image ? (
                          <img
                            src={session.user.image}
                            alt={session.user.name || "User"}
                            className="w-8 h-8 rounded-full border border-gray-200 object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center border border-gray-200">
                            <FiUser size={16} />
                          </div>
                        )}
                      </button>
                      {/* Invisible hover bridge to prevent menu closing */}
                      <div className="absolute right-0 top-8 h-4 w-full bg-transparent z-40"></div>

                      {/* Dropdown Menu */}
                      <div className="absolute right-0 top-10 pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 origin-top-right drop-shadow-xl">
                        {/* Minimal Arrow */}
                        <div className="absolute right-3 top-1.5 w-3.5 h-3.5 bg-white border-t border-l border-gray-100 transform rotate-45 rounded-tl-[2px] z-10"></div>

                        <div className="relative bg-white border border-gray-100 rounded-2xl py-2 w-56 transform scale-95 group-hover:scale-100 transition-transform duration-200 overflow-hidden z-20">
                          {/* User Info Header */}
                          <div className="px-4 py-3 border-b border-gray-50 bg-gray-50/50">
                            <p className="text-sm font-semibold text-gray-900 truncate">
                              {session.user.name || "My Account"}
                            </p>
                            <p className="text-xs text-gray-500 truncate mt-0.5">
                              {session.user.email}
                            </p>
                          </div>

                          {/* Menu Links */}
                          <div className="py-2 flex flex-col gap-1 px-2">
                            <Link
                              href="/profile"
                              className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-600 hover:text-black hover:bg-gray-50 rounded-xl transition-colors"
                            >
                              <FiUser className="w-4 h-4" />
                              Profile
                            </Link>
                            <Link
                              href="/orders"
                              className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-600 hover:text-black hover:bg-gray-50 rounded-xl transition-colors"
                            >
                              <FiPackage className="w-4 h-4" />
                              My Orders
                            </Link>
                          </div>

                          {/* Sign Out Button */}
                          <div className="border-t border-gray-50 pt-2 px-2 pb-1">
                            <button
                              onClick={() => signOut({ callbackUrl: "/" })}
                              className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                            >
                              <FiLogOut className="w-4 h-4" />
                              Sign Out
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Link
                      href="/auth/signin"
                      className="p-2.5 text-gray-600 hover:text-black hover:bg-gray-100/80 rounded-full transition-all duration-300 block"
                    >
                      <IoPersonOutline size={20} />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>

      {/* Mobile Menu Drawer */}
      {/* Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-9999 md:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Slide-in Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-[80vw] max-w-sm bg-white shadow-2xl z-999999 transform transition-transform duration-300 ease-in-out flex flex-col md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          {session ? (
            <div className="flex items-center gap-3">
              {session.user.image ? (
                <img
                  src={session.user.image}
                  alt={session.user.name || "User"}
                  className="w-10 h-10 rounded-full border border-gray-200 object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
                  <FiUser size={20} className="text-gray-500" />
                </div>
              )}
              <div className="flex flex-col">
                <span className="font-semibold text-gray-900 text-sm">
                  {session.user.name || "User"}
                </span>
                <span className="text-xs text-gray-500">
                  {session.user.email}
                </span>
              </div>
            </div>
          ) : (
            <span className="font-semibold text-lg">Menu</span>
          )}
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-1 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-900"
          >
            <FiX size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <Link
            href="/"
            className="block py-2 text-gray-700 hover:text-gray-900 border-b border-gray-50"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Home
          </Link>

          <Link
            href="/products"
            className="block py-2 text-gray-700 hover:text-gray-900 border-b border-gray-50"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Products
          </Link>

          <Link
            href="/about"
            className="block py-2 text-gray-700 hover:text-gray-900 border-b border-gray-50"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            About Us
          </Link>

          <Link
            href="/contact"
            className="block py-2 text-gray-700 hover:text-gray-900 border-b border-gray-50"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Contact Us
          </Link>

          {session?.user.role === "admin" && (
            <Link
              href="/admin"
              className="block py-2 text-gray-700 hover:text-gray-900 border-b border-gray-50"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Admin
            </Link>
          )}

          <button
            onClick={() => {
              useCartStore.getState().openCart();
              setIsMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-gray-700 hover:text-gray-900 cursor-pointer"
          >
            Cart {isMounted && totalItems > 0 && `(${totalItems})`}
          </button>

          {session ? (
            <>
              <Link
                href="/profile"
                className="block py-2 text-gray-700 hover:text-gray-900"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Profile
              </Link>
              <Link
                href="/orders"
                className="block py-2 text-gray-700 hover:text-gray-900"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                My Orders
              </Link>
              <button
                onClick={() => {
                  signOut({ callbackUrl: "/" });
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-left py-2 text-red-500"
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link
              href="/auth/signin"
              className="block w-full text-center py-2 px-4 font-semibold rounded-full bg-gray-900 text-white hover:bg-gray-800 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
