"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

const headerNavItems = [
  { label: "Pizza", src: "/pizza_icon.png", alt: "Pizza" },
  { label: "Burger", src: "/burger_icon.png", alt: "Burger" },
  { label: "Pasta", src: "/spaghetti_icon.png", alt: "Pasta" },
  { label: "Deals", src: "/deal_icon.png", alt: "Deals" },
] as const;

export default function Home() {
  const [sidebarWidth, setSidebarWidth] = useState(288);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const isResizingRef = useRef(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth >= 640);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handleMouseDown = () => {
    if (!isDesktop) return;
    isResizingRef.current = true;
  };

  const handleMouseUp = () => {
    isResizingRef.current = false;
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizingRef.current || !sidebarRef.current || !isDesktop) return;

    const container = sidebarRef.current.parentElement || document.body;
    const newWidth = e.clientX - container.getBoundingClientRect().left;
    const minWidth = 200;
    const maxWidth = 448;

    if (newWidth >= minWidth && newWidth <= maxWidth) {
      setSidebarWidth(newWidth);
    }
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove as EventListener);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove as EventListener);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDesktop]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsProfileModalOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <main className="flex min-h-screen flex-col bg-[var(--color-bg)] text-[var(--color-text)]">
      <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between gap-4 border-b border-[var(--color-border)] bg-[linear-gradient(135deg,var(--color-surface),var(--color-surface-alt))] px-4 py-3 shadow-[0_12px_30px_rgba(15,23,42,0.08)] backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <button
            className="sm:hidden inline-flex items-center justify-center rounded-md p-2 transition-colors hover:bg-[rgba(225,29,72,0.12)]"
            onClick={() => setIsSidebarOpen(true)}
            aria-label="Open menu"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <Image
            src="/grabe-go-logo.png"
            alt="Grab & Go logo"
            width={64}
            height={64}
            className="h-16 w-16 rounded-full object-cover ring-4 ring-white shadow-[0_10px_25px_rgba(15,23,42,0.2)]"
            priority
          />

          <span className="hidden sm:inline text-lg font-semibold tracking-tight text-[var(--color-primary)] sm:text-2xl">Grab &amp; Go</span>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <nav className="hidden sm:flex items-center gap-3">
            <Link
              href="/cart"
              className="relative inline-flex items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] p-2 text-[var(--color-support)] transition-all hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white"
              aria-label="Shopping cart"
            >
              <Image src="/shopping-cart_Icon.png" alt="" width={18} height={18} className="h-[18px] w-[18px] object-contain" aria-hidden />
              <span className="absolute -right-1 -top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--color-primary)] px-1 text-[10px] font-semibold leading-none text-white">
                5
              </span>
            </Link>

            {headerNavItems.map((item) => (
              <button
                key={item.label}
                type="button"
                className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1 text-sm font-medium text-[var(--color-text)] transition-all hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white"
              >
                <Image src={item.src} alt={item.alt} width={18} height={18} className="h-[18px] w-[18px] object-contain" />
                {item.label}
              </button>
            ))}
          </nav>

          <button className="sm:hidden inline-flex items-center justify-center rounded-md p-2 transition-colors hover:bg-[rgba(225,29,72,0.12)]" onClick={() => setIsNavOpen(true)} aria-label="Open nav menu">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <path d="M4 6h12M4 10h12M4 14h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <button
            type="button"
            aria-label="Profile"
            className="inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-[var(--color-border)] shadow-[0_8px_18px_rgba(225,29,72,0.25)]"
            onClick={() => setIsProfileModalOpen(true)}
          >
            <Image
              src="/Avatar_profile_image.png"
              alt="Masoom Tariq profile"
              width={40}
              height={40}
              className="h-full w-full object-cover"
            />
          </button>
        </div>
      </header>

      {isProfileModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center px-4 pt-24 sm:pt-28" role="dialog" aria-modal="true" aria-label="User profile">
          <div className="absolute inset-0 bg-[rgba(15,23,42,0.55)]" onClick={() => setIsProfileModalOpen(false)} />
          <div className="relative w-full max-w-sm rounded-[1.25rem] border border-[var(--color-border)] bg-[linear-gradient(180deg,var(--color-surface),#fff6eb)] p-5 shadow-[0_24px_56px_rgba(15,23,42,0.18)]">
            <div className="flex items-start justify-between">
              <h3 className="text-lg font-semibold text-[var(--color-text)]">Profile</h3>
              <button
                type="button"
                onClick={() => setIsProfileModalOpen(false)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-text)] hover:bg-[rgba(249,115,22,0.08)]"
                aria-label="Close profile"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <Image
                src="/Avatar_profile_image.png"
                alt="Masoom Tariq"
                width={48}
                height={48}
                className="h-12 w-12 rounded-full object-cover"
              />
              <div>
                <p className="text-sm font-semibold text-[var(--color-text)]">Name : Masoom Tariq</p>
                <p className="text-xs text-[var(--color-muted)]">Premium Member</p>
              </div>
            </div>

            <div className="mt-5 space-y-3 text-sm">
              <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2">
                <p className="text-xs uppercase tracking-[0.12em] text-[var(--color-muted)]">Email</p>
                <p className="mt-1 font-medium text-[var(--color-text)]">mohamed.khaled@example.com</p>
              </div>
              <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2">
                <p className="text-xs uppercase tracking-[0.12em] text-[var(--color-muted)]">Phone</p>
                <p className="mt-1 font-medium text-[var(--color-text)]">+20 100 123 4567</p>
              </div>
              <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2">
                <p className="text-xs uppercase tracking-[0.12em] text-[var(--color-muted)]">Address</p>
                <p className="mt-1 font-medium text-[var(--color-text)]">Downtown, Cairo, Egypt</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile sidebar drawer */}
      {!isDesktop && isSidebarOpen && (
        <div className="fixed inset-0 z-50 sm:hidden">
          <div className="absolute inset-0 bg-[rgba(15,23,42,0.55)]" onClick={() => setIsSidebarOpen(false)} />
          <aside className="absolute left-0 top-[5.5rem] h-[calc(100vh-5.5rem)] w-64 border-r border-[var(--color-border)] bg-[linear-gradient(180deg,var(--color-surface),#fff3e2)] p-4 shadow-[8px_0_30px_rgba(15,23,42,0.08)]">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[var(--color-text)]">Menu</h3>
              <button onClick={() => setIsSidebarOpen(false)} aria-label="Close" className="p-1">✕</button>
            </div>
            <nav className="mt-4 flex flex-col gap-3">
              {['Pizza', 'Burger', 'Pasta', 'Deals'].map((item) => (
                <button
                  key={item}
                  type="button"
                  className="rounded-2xl bg-[var(--color-surface)] px-4 py-3 text-left text-sm font-medium text-[var(--color-text)] hover:bg-[rgba(249,115,22,0.08)]"
                >
                  {item}
                </button>
              ))}
              <Link
                href="/cart"
                className="rounded-2xl bg-[linear-gradient(135deg,var(--color-primary),var(--color-secondary))] px-4 py-3 text-left text-sm font-medium text-white shadow-[0_12px_24px_rgba(225,29,72,0.22)]"
              >
                Cart
              </Link>
            </nav>
          </aside>
        </div>
      )}

      {/* Mobile nav overlay */}
      {!isDesktop && isNavOpen && (
        <div className="fixed inset-0 z-50 sm:hidden">
          <div className="absolute inset-0 bg-[rgba(15,23,42,0.55)]" onClick={() => setIsNavOpen(false)} />
          <div className="absolute top-[5.5rem] left-4 right-4 rounded-[1.25rem] border border-[var(--color-border)] bg-[linear-gradient(180deg,var(--color-surface),#fff6eb)] p-4 shadow-[0_20px_40px_rgba(15,23,42,0.15)]">
            <nav className="flex flex-col gap-3">
              {['Pizza', 'Burger', 'Pasta', 'Deals'].map((item) => (
                <button key={item} onClick={() => setIsNavOpen(false)} className="w-full rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-left text-sm font-medium text-[var(--color-text)] transition-colors hover:bg-[var(--color-primary)] hover:text-white">
                  {item}
                </button>
              ))}
              <Link
                href="/cart"
                onClick={() => setIsNavOpen(false)}
                className="w-full rounded-full border border-[var(--color-border)] bg-[linear-gradient(135deg,var(--color-primary),var(--color-secondary))] px-4 py-3 text-left text-sm font-medium text-white transition-colors hover:opacity-95"
              >
                Cart
              </Link>
            </nav>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      {isDesktop && (
        <aside
          ref={sidebarRef}
          className="fixed left-0 top-[5.5rem] z-30 hidden h-[calc(100vh-5.5rem)] overflow-auto border-r border-[var(--color-border)] bg-[linear-gradient(180deg,var(--color-surface),#fff4e6)] p-4 shadow-[8px_0_30px_rgba(15,23,42,0.06)] transition-[width] duration-75 sm:block"
          style={{ width: `${sidebarWidth}px` }}
        >
          <h2 className="px-2 pb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)]">Menu</h2>
          <nav aria-label="Sidebar" className="flex flex-col gap-3">
            {['Pizza', 'Burger', 'Pasta', 'Deals'].map((item) => (
              <button
                key={item}
                type="button"
                className="rounded-2xl bg-[var(--color-surface)] px-4 py-3 text-left text-sm font-medium text-[var(--color-text)] hover:bg-[rgba(249,115,22,0.08)]"
              >
                {item}
              </button>
            ))}
            <Link
              href="/cart"
              className="rounded-2xl bg-[linear-gradient(135deg,var(--color-primary),var(--color-secondary))] px-4 py-3 text-left text-sm font-medium text-white shadow-[0_12px_24px_rgba(225,29,72,0.22)]"
            >
              Cart
            </Link>
          </nav>
        </aside>
      )}

      {/* Resizer - desktop only */}
      {isDesktop && (
        <div
          onMouseDown={handleMouseDown}
          className="fixed top-[5.5rem] z-40 hidden h-[calc(100vh-5.5rem)] w-1 cursor-col-resize bg-transparent hover:bg-[rgba(249,115,22,0.18)] sm:block"
          style={{ userSelect: 'none', left: `${sidebarWidth}px` }}
        />
      )}

      <section
        className="mt-[5.5rem] flex-1 bg-[radial-gradient(circle_at_top,rgba(250,204,21,0.08),transparent_28%),linear-gradient(180deg,var(--color-bg),#fffaf4)]"
        style={{ marginLeft: isDesktop ? `${sidebarWidth}px` : 0 }}
      >
        {['Pizza', 'Burgers', 'Pasta', 'Deals'].map((category, index) => {
          const isGridLayout = category === 'Pizza' || category === 'Pasta';
          const cardCount = isGridLayout ? 6 : 3;
          const mockProducts = Array.from({ length: cardCount }, (_, i) => ({
            id: i + 1,
            name: `${category.slice(0, -1)} ${i + 1}`,
            price: `$${(8 + i * 1.5).toFixed(2)}`,
          }));

          return (
            <div key={category} className="pb-8">
              <div className="px-4 py-6 sm:px-8">
                <h2 className="text-2xl font-semibold text-[var(--color-primary)]">{category}</h2>
              </div>

              {isGridLayout ? (
                <div className="px-4 sm:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mockProducts.map((product) => (
                    <article
                      key={product.id}
                      className="rounded-[1.5rem] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[0_14px_35px_rgba(15,23,42,0.08)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(15,23,42,0.12)]"
                    >
                      <div className="mb-4 h-40 rounded-[1rem] bg-[linear-gradient(135deg,#fde68a_0%,#fb923c_48%,#ef4444_100%)] shadow-inner" />
                      <h3 className="text-lg font-semibold text-[var(--color-text)]">{product.name}</h3>
                      <p className="mt-2 text-sm text-[var(--color-muted)]">{product.price}</p>
                      <button className="mt-4 w-full rounded-xl bg-[linear-gradient(135deg,var(--color-primary),var(--color-secondary))] px-3 py-2 text-sm font-medium text-white shadow-[0_10px_20px_rgba(225,29,72,0.2)] transition-transform hover:scale-[1.01] hover:shadow-[0_14px_28px_rgba(225,29,72,0.28)]">
                        Add to Cart
                      </button>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="px-4 sm:px-8 flex flex-col sm:flex-row sm:items-start gap-6">
                  {mockProducts.map((product) => (
                    <article key={product.id} className="flex-1 rounded-[1.5rem] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[0_14px_35px_rgba(15,23,42,0.08)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(15,23,42,0.12)]">
                      <div className="mb-4 h-40 rounded-[1rem] bg-[linear-gradient(135deg,#fde68a_0%,#fb923c_48%,#ef4444_100%)] shadow-inner" />
                      <h3 className="text-lg font-semibold text-[var(--color-text)]">{product.name}</h3>
                      <p className="mt-2 text-sm text-[var(--color-muted)]">{product.price}</p>
                      <button className="mt-4 w-full rounded-xl bg-[linear-gradient(135deg,var(--color-primary),var(--color-secondary))] px-3 py-2 text-sm font-medium text-white shadow-[0_10px_20px_rgba(225,29,72,0.2)] transition-transform hover:scale-[1.01] hover:shadow-[0_14px_28px_rgba(225,29,72,0.28)]">
                        Add to Cart
                      </button>
                    </article>
                  ))}
                </div>
              )}

              {index < 3 && <div className="mt-6 h-px bg-[var(--color-border)]" />}
            </div>
          );
        })}
      </section>

      <footer className="mt-auto w-full bg-[var(--color-footer)]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 px-6 py-8" style={{ marginLeft: isDesktop ? `${sidebarWidth}px` : 0 }}>
          <div>
            <p className="text-sm font-medium text-white">Grab &amp; Go</p>
            <p className="mt-2 text-sm text-white/70">123 Main Street, Downtown</p>
            <p className="text-sm text-white/70">New York, NY 10001</p>
            <p className="mt-1 text-sm text-white/70">Phone: (555) 123-4567</p>
          </div>

          <nav aria-label="Social" className="flex items-center gap-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white transition-colors hover:border-transparent hover:bg-[var(--color-accent)] hover:text-[var(--color-footer)]"
              aria-label="Facebook"
            >
              <span className="text-lg font-bold">f</span>
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white transition-colors hover:border-transparent hover:bg-[var(--color-support)] hover:text-white"
              aria-label="YouTube"
            >
              <span className="text-sm font-bold">▶</span>
            </a>
          </nav>
        </div>
      </footer>
    </main>
  );
}
