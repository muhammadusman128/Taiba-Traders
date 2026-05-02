"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { io as ClientIO } from "socket.io-client";

// icons
import { MdMenuOpen } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";
import {
  FiGrid,
  FiImage,
  FiShoppingBag,
  FiList,
  FiPackage,
  FiHome,
  FiMessageCircle,
  FiUsers,
  FiSettings,
} from "react-icons/fi";

const menuItems = [
  {
    icons: <FiGrid size={26} />,
    label: "Dashboard",
    href: "/admin",
  },
  {
    icons: <FiUsers size={26} />,
    label: "Active Logins",
    href: "/admin/active-sessions",
  },
  {
    icons: <FiImage size={26} />,
    label: "Sliders",
    href: "/admin/sliders",
  },
  {
    icons: <FiImage size={26} />,
    label: "Hero Section",
    href: "/admin/hero",
  },
  {
    icons: <FiGrid size={26} />,
    label: "Features Section",
    href: "/admin/features",
  },
  {
    icons: <FiShoppingBag size={26} />,
    label: "Products",
    href: "/admin/products",
  },
  {
    icons: <FiList size={26} />,
    label: "Categories",
    href: "/admin/categories",
  },
  {
    icons: <FiMessageCircle size={26} />,
    label: "Chats",
    href: "/admin/chat",
  },
  {
    icons: <FiPackage size={26} />,
    label: "Orders",
    href: "/admin/orders",
  },
  {
    icons: <FiHome size={26} />,
    label: "Storefront",
    href: "/",
  },
];

// insert banner admin menu
menuItems.splice(menuItems.length - 1, 0, {
  icons: <FiImage size={26} />,
  label: "Top Banner",
  href: "/admin/banner",
});
// insert popup admin menu
menuItems.splice(menuItems.length - 1, 0, {
  icons: <FiImage size={26} />,
  label: "Site Popup",
  href: "/admin/popup",
});
// insert footer admin menu
menuItems.splice(menuItems.length - 1, 0, {
  icons: <FiList size={26} />,
  label: "Footer",
  href: "/admin/footer",
});

// insert site settings admin menu
menuItems.splice(menuItems.length - 1, 0, {
  icons: <FiSettings size={26} />,
  label: "Site Settings",
  href: "/admin/site",
});

// insert theme colors admin menu
menuItems.splice(menuItems.length - 1, 0, {
  icons: <FiImage size={26} />, // You can change this outline to something resembling palette
  label: "Theme Colors",
  href: "/admin/theme",
});

// insert popup admin menu
menuItems.splice(menuItems.length - 1, 0, {
  icons: <FiList size={26} />,
  label: "FAQ Accordion",
  href: "/admin/faq",
});

export default function Sidebar() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const pathname = usePathname();
  const pathnameRef = React.useRef(pathname);

  const user = session?.user;
  const firstLetter = user?.name ? user.name.charAt(0).toUpperCase() : "A";
  const userImage = (user as any)?.image;

  // Function to handle automatic close on mobile when clicking links
  const handleLinkClick = () => {
    if (window.innerWidth < 768) {
      setIsMobileMenuOpen(false);
    }
  };

  useEffect(() => {
    pathnameRef.current = pathname;
    // Clear unread when entering chat page
    if (pathname === "/admin/chat") {
      setUnreadCount(0);
    }
  }, [pathname]);

  useEffect(() => {
    let socketInstance: any;
    let isMounted = true;

    // Only connect socket logic if admin
    if (session?.user?.role !== "admin") return;

    const initSocket = async () => {
      try {
        await fetch("/api/socket/io");
        if (!isMounted) return;

        socketInstance = ClientIO(process.env.NEXT_PUBLIC_SITE_URL || "", {
          path: "/api/socket/io",
          addTrailingSlash: false,
        });

        socketInstance.on("connect", () => {
          socketInstance.emit("join-admin");
        });

        socketInstance.on("admin-new-message", (msg: any) => {
          // If not already on chat page and sender is not admin, increment
          if (
            pathnameRef.current !== "/admin/chat" &&
            msg?.senderModel !== "Admin"
          ) {
            setUnreadCount((c) => c + 1);
          }
        });
      } catch (err) {
        console.error(err);
      }
    };

    initSocket();

    return () => {
      isMounted = false;
      if (socketInstance) socketInstance.disconnect();
    };
  }, [session]);

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between bg-white border-b border-zinc-200 text-zinc-900 p-4 fixed top-0 w-full z-50 h-16">
        <Link href="/" className="flex items-center gap-2">
          <img
            src="/logomain.png"
            alt="Logo"
            className="w-8 h-8 rounded-full border border-zinc-200 p-0.5"
          />
          <span className="font-bold tracking-wider text-sm">TaibaADMIN</span>
        </Link>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-zinc-600 hover:text-black focus:outline-none relative transition-colors"
        >
          {isMobileMenuOpen ? (
            <MdMenuOpen size={28} />
          ) : (
            <MdMenuOpen size={28} className="rotate-180" />
          )}
          {unreadCount > 0 && !isMobileMenuOpen && (
            <span className="absolute -top-1 -right-1 bg-red-500 w-3.5 h-3.5 rounded-full border border-white"></span>
          )}
        </button>
      </div>

      {/* Sidebar Overlay (Mobile) */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-zinc-900/40 z-40 backdrop-blur-md transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <nav
        className={`h-[100dvh] flex flex-col duration-300 bg-[#fdfdfd] text-zinc-600 border-r border-zinc-200 fixed md:relative z-50 md:z-auto top-0 left-0
          ${isMobileMenuOpen ? "translate-x-0 w-64 md:w-64 pt-4 md:pt-0" : "-translate-x-full w-64 md:translate-x-0 md:w-16"}
          ${open && "md:w-64"}
        `}
      >
        {/* Header */}
        <div className="px-4 py-2 h-20 flex justify-between items-center hidden md:flex border-b border-zinc-100">
          <Link href="/">
            <img
              src="/logomain.png"
              alt="Logo"
              className={`${open ? "w-12 h-12" : "w-0 h-0 opacity-0"} rounded-full border border-zinc-200 p-0.5 transition-all duration-300`}
            />
          </Link>
          <button
            onClick={() => setOpen(!open)}
            title="Toggle Sidebar"
            className="focus:outline-none text-zinc-400 hover:text-zinc-800 transition-colors"
          >
            <MdMenuOpen
              size={30}
              className={`duration-300 cursor-pointer ${!open && "rotate-180"}`}
            />
          </button>
        </div>

        {/* Body */}
        <ul className="flex-1 overflow-y-auto overflow-x-hidden mt-16 md:mt-4 px-2 md:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {menuItems.map((item, index) => {
            const isActive = pathname === item.href;
            return (
              <Link
                href={item.href}
                key={index}
                className="block relative group/link"
                onClick={handleLinkClick}
              >
                <li
                  className={`px-3 py-3 md:py-2.5 mx-2 my-1 md:my-1.5 rounded-lg duration-200 cursor-pointer flex gap-4 items-center relative
                  ${isActive ? "bg-zinc-100 text-black font-medium" : "hover:bg-zinc-50 text-zinc-500 hover:text-zinc-900"}`}
                >
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-black rounded-r-md" />
                  )}
                  <div
                    className={`relative shrink-0 transition-colors ${isActive ? "text-black" : "text-zinc-400 group-hover/link:text-zinc-800"}`}
                  >
                    {item.icons}
                    {item.label === "Chats" && unreadCount > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-none animate-pulse border border-white">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                  <p
                    className={`${!open && !isMobileMenuOpen ? "w-0 opacity-0 hidden md:block" : "w-auto opacity-100"} duration-300 overflow-hidden whitespace-nowrap text-sm tracking-wide`}
                  >
                    {item.label}
                    {item.label === "Chats" &&
                      unreadCount > 0 &&
                      (open || isMobileMenuOpen) && (
                        <span className="ml-3 bg-red-100 text-red-600 border border-red-200 text-[10px] px-2 py-0.5 rounded-full tracking-wide font-semibold">
                          {unreadCount} NEW
                        </span>
                      )}
                  </p>
                </li>
              </Link>
            );
          })}
        </ul>

        {/* Footer info/Profile Link */}
        <Link
          href="/profile"
          onClick={handleLinkClick}
          className="flex items-center gap-3 px-4 md:px-3 py-4 mt-auto mb-4 md:mb-0 mx-2 md:mx-0 cursor-pointer hover:bg-zinc-50 transition-all border-t border-zinc-200 md:border-t md:border-zinc-100/80"
        >
          <div className="shrink-0 relative">
            {userImage ? (
              <img
                src={userImage}
                alt={(user as any)?.name || "Admin"}
                className="w-10 h-10 rounded-full object-cover border border-zinc-200"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-zinc-100 text-zinc-600 border border-zinc-200 flex items-center justify-center font-semibold text-lg">
                {firstLetter}
              </div>
            )}
          </div>
          <div
            className={`leading-5 text-sm ${!open && !isMobileMenuOpen ? "w-0 opacity-0 hidden md:block" : "w-auto opacity-100"} duration-300 overflow-hidden whitespace-nowrap`}
          >
            <p className="font-semibold text-sm text-white">
              {user?.name || "Admin"}
            </p>
            <span className="text-xs text-gray-400">
              {user?.email || "admin@example.com"}
            </span>
          </div>
        </Link>
      </nav>
    </>
  );
}
