"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

export default function Home() {
  const [sidebarWidth, setSidebarWidth] = useState(288);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const isResizingRef = useRef(false);
  const [isNavOpen, setIsNavOpen] = useState(false);

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

  return (
    <main className="flex min-h-screen flex-col bg-white">
      <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between gap-4 bg-zinc-100 px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            className="sm:hidden inline-flex items-center justify-center rounded-md p-2 hover:bg-black/5"
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
            width={56}
            height={56}
            className="h-14 w-14 rounded-full object-cover"
            priority
          />

          <span className="hidden sm:inline text-lg font-semibold tracking-tight text-black sm:text-2xl">Grab &amp; Go</span>
        </div>

        <nav className="hidden sm:flex items-center gap-3">
          {['Pizzas', 'Burger', 'Pasta', 'Meals'].map((item) => (
            <button
              key={item}
              type="button"
              className="rounded-full border border-black/10 bg-white px-3 py-1 text-sm font-medium text-black transition-colors hover:bg-black hover:text-white"
            >
              {item}
            </button>
          ))}
        </nav>

        <button className="sm:hidden inline-flex items-center justify-center rounded-md p-2 hover:bg-black/5" onClick={() => setIsNavOpen(true)} aria-label="Open nav menu">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <path d="M4 6h12M4 10h12M4 14h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </header>

      {/* Mobile sidebar drawer */}
      {!isDesktop && isSidebarOpen && (
        <div className="fixed inset-0 z-50 sm:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setIsSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-64 bg-zinc-50 p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Menu</h3>
              <button onClick={() => setIsSidebarOpen(false)} aria-label="Close" className="p-1">✕</button>
            </div>
            <nav className="mt-4 flex flex-col gap-3">
              {['Pizzas', 'Burger', 'Pasta', 'Meals', 'Cart'].map((item, index) => (
                <button
                  key={item}
                  type="button"
                  className={`rounded-2xl px-4 py-3 text-left text-sm font-medium ${
                    index === 4 ? 'bg-black text-white' : 'bg-zinc-50 text-black hover:bg-zinc-100'
                  }`}
                >
                  {item}
                </button>
              ))}
            </nav>
          </aside>
        </div>
      )}

      {/* Mobile nav overlay */}
      {!isDesktop && isNavOpen && (
        <div className="fixed inset-0 z-50 sm:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setIsNavOpen(false)} />
          <div className="absolute top-14 left-4 right-4 bg-white rounded-lg p-4 shadow-lg">
            <nav className="flex flex-col gap-3">
              {['Pizzas', 'Burger', 'Pasta', 'Meals'].map((item) => (
                <button key={item} onClick={() => setIsNavOpen(false)} className="w-full rounded-full border border-black/10 bg-white px-4 py-3 text-left text-sm font-medium">
                  {item}
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      {isDesktop && (
        <aside
          ref={sidebarRef}
          className="fixed left-0 top-14 h-[calc(100vh-3.5rem)] z-30 overflow-auto bg-zinc-50 p-4 transition-[width] duration-75 hidden sm:block"
          style={{ width: `${sidebarWidth}px` }}
        >
          <h2 className="px-2 pb-4 text-sm font-semibold uppercase tracking-[0.2em] text-black/50">Menu</h2>
          <nav aria-label="Sidebar" className="flex flex-col gap-3">
            {['Pizzas', 'Burger', 'Pasta', 'Meals', 'Cart'].map((item, index) => (
              <button
                key={item}
                type="button"
                className={`rounded-2xl px-4 py-3 text-left text-sm font-medium transition-colors ${
                  index === 4 ? 'bg-black text-white' : 'bg-zinc-50 text-black hover:bg-zinc-100'
                }`}
              >
                {item}
              </button>
            ))}
          </nav>
        </aside>
      )}

      {/* Resizer - desktop only */}
      {isDesktop && (
        <div
          onMouseDown={handleMouseDown}
          className="fixed top-14 h-[calc(100vh-3.5rem)] z-40 w-1 cursor-col-resize bg-transparent hover:bg-black/5 hidden sm:block"
          style={{ userSelect: 'none', left: `${sidebarWidth}px` }}
        />
      )}

      <section
        className="mt-16 flex-1 bg-white"
        style={{ marginLeft: isDesktop ? `${sidebarWidth}px` : 0 }}
      >
        {['Pizzas', 'Burgers', 'Pasta', 'Meals'].map((category, index) => {
          const isGridLayout = category === 'Pizzas' || category === 'Pasta';
          const cardCount = isGridLayout ? 6 : 3;
          const mockProducts = Array.from({ length: cardCount }, (_, i) => ({
            id: i + 1,
            name: `${category.slice(0, -1)} ${i + 1}`,
            price: `$${(8 + i * 1.5).toFixed(2)}`,
          }));

          return (
            <div key={category} className="pb-8">
              <div className="px-4 py-6 sm:px-8">
                <h2 className="text-2xl font-semibold text-black">{category}</h2>
              </div>

              {isGridLayout ? (
                <div className="px-4 sm:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mockProducts.map((product) => (
                    <article
                      key={product.id}
                      className="rounded-lg border border-black/10 bg-zinc-50 p-4 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="mb-4 h-40 rounded-md bg-gradient-to-br from-zinc-200 to-zinc-300" />
                      <h3 className="text-lg font-semibold text-black">{product.name}</h3>
                      <p className="mt-2 text-sm text-black/60">{product.price}</p>
                      <button className="mt-4 w-full rounded-lg bg-black px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800">
                        Add to Cart
                      </button>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="px-4 sm:px-8 flex flex-col sm:flex-row sm:items-start gap-6">
                  {mockProducts.map((product) => (
                    <article key={product.id} className="flex-1 rounded-lg border border-black/10 bg-zinc-50 p-4 shadow-sm hover:shadow-md transition-shadow">
                      <div className="mb-4 h-40 rounded-md bg-gradient-to-br from-zinc-200 to-zinc-300" />
                      <h3 className="text-lg font-semibold text-black">{product.name}</h3>
                      <p className="mt-2 text-sm text-black/60">{product.price}</p>
                      <button className="mt-4 w-full rounded-lg bg-black px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800">
                        Add to Cart
                      </button>
                    </article>
                  ))}
                </div>
              )}

              {index < 3 && <div className="mt-6 h-px bg-black/10" />}
            </div>
          );
        })}
      </section>

      <footer className="w-full bg-zinc-900 mt-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 px-6 py-8" style={{ marginLeft: isDesktop ? `${sidebarWidth}px` : 0 }}>
          <div>
            <p className="text-sm font-medium text-white">Grab &amp; Go</p>
            <p className="mt-2 text-sm text-zinc-400">123 Main Street, Downtown</p>
            <p className="text-sm text-zinc-400">New York, NY 10001</p>
            <p className="mt-1 text-sm text-zinc-400">Phone: (555) 123-4567</p>
          </div>

          <nav aria-label="Social" className="flex items-center gap-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center h-10 w-10 rounded-full border border-zinc-700 text-white transition-colors hover:bg-white hover:text-black"
              aria-label="Facebook"
            >
              <span className="text-lg font-bold">f</span>
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center h-10 w-10 rounded-full border border-zinc-700 text-white transition-colors hover:bg-white hover:text-black"
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
