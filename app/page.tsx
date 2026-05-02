"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

const orderCategories = ["Pizza", "Burger", "Pasta", "Deals"] as const;

type OrderCategory = (typeof orderCategories)[number];

const headerNavItems = [
  { label: "Pizza", src: "/pizza_icon.png", alt: "Pizza" },
  { label: "Burger", src: "/burger_icon.png", alt: "Burger" },
  { label: "Pasta", src: "/spaghetti_icon.png", alt: "Pasta" },
  { label: "Deals", src: "/deal_icon.png", alt: "Deals" },
] as const;

const orderFlavorOptions: Record<OrderCategory, string[]> = {
  Pizza: ["Margherita", "Pepperoni", "Veggie", "BBQ Chicken"],
  Burger: ["Classic", "Spicy", "Cheese Burst", "Smoky BBQ"],
  Pasta: ["Alfredo", "Arrabbiata", "Pesto", "Four Cheese"],
  Deals: ["Family Feast", "Budget Bite", "Spicy Combo", "Mega Meal"],
};

const orderSizeOptions: Record<OrderCategory, string[]> = {
  Pizza: ["Small", "Medium", "Large", "Extra Large"],
  Burger: ["Small", "Medium", "Large", "Extra Large"],
  Pasta: ["Quarter", "Half", "Full"],
  Deals: [],
};

const toppingOptions = ["Extra Cheese", "Olives", "Jalapeños", "Mushrooms", "Corn"] as const;

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

const faqs = [
  {
    question: "How fast is delivery?",
    answer: "Most orders are delivered within 25 to 35 minutes depending on your location and order volume.",
  },
  {
    question: "Can I track my order?",
    answer: "Yes. Order tracking will be shown in the app once your cart is confirmed and checkout is completed.",
  },
  {
    question: "What payment methods do you support?",
    answer: "For now this is mocked content, but the final version can support cash, card, and digital wallet payments.",
  },
  {
    question: "Can I customize my food?",
    answer: "Yes, item customization can be added so users can remove ingredients or choose extra toppings.",
  },
  {
    question: "Do you offer deals and combos?",
    answer: "Yes, the Deals section is where combo offers and discounts will be highlighted for quick ordering.",
  },
] as const;

const heroCarouselImages = [
  { src: "/pizza_carousel.jpg", alt: "Fresh pizza with toppings" },
  { src: "/carousel_Burger.jpg", alt: "Juicy burger and fries" },
  { src: "/pasta_carousel.jpg", alt: "Creamy pasta plate" },
] as const;

const promoMessages = [
  "Limited-time: 20% off all pizzas — use code HOT20",
  "Buy one burger, get fries free — today only!",
  "Free delivery on orders over Rs 499 — hurry up",
  "Family meal deal: 3 items for Rs 999 — order now",
  "Student special: extra 10% off with .edu email",
] as const;

export default function Home() {
  const router = useRouter();
  const [sidebarWidth, setSidebarWidth] = useState(288);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const isResizingRef = useRef(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isFutureBookingModalOpen, setIsFutureBookingModalOpen] = useState(false);
  const [isHelperAssistantOpen, setIsHelperAssistantOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<OrderCategory>("Pizza");
  const [selectedFlavor, setSelectedFlavor] = useState(orderFlavorOptions.Pizza[0]);
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const [selectedSize, setSelectedSize] = useState(2);
  const [suggestions, setSuggestions] = useState("");
  const [isFastDelivery, setIsFastDelivery] = useState(false);
  const [bookingDate, setBookingDate] = useState("");
  const [calendarCursor, setCalendarCursor] = useState(() => new Date());
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [activeHeroSlide, setActiveHeroSlide] = useState(0);
  const [addingProductKey, setAddingProductKey] = useState<string | null>(null);
  const [isCardsLoading, setIsCardsLoading] = useState(true);
  const addToCartTimeoutRef = useRef<number | null>(null);
  const cartAlertTimeoutRef = useRef<number | null>(null);
  const formAlertTimeoutRef = useRef<number | null>(null);
  const cardsLoadingTimeoutRef = useRef<number | null>(null);
  const promoIntervalRef = useRef<number | null>(null);
  const promoTimeoutRef = useRef<number | null>(null);

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
        setIsOrderModalOpen(false);
        setIsRegisterModalOpen(false);
        setIsFutureBookingModalOpen(false);
        setIsHelperAssistantOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    const availableFlavors = orderFlavorOptions[selectedCategory];
    setSelectedFlavor((currentFlavor) => (availableFlavors.includes(currentFlavor) ? currentFlavor : availableFlavors[0]));

    if (selectedCategory !== "Pizza" && selectedCategory !== "Pasta") {
      setSelectedToppings([]);
    }
  }, [selectedCategory]);

  useEffect(() => {
    const availableSizes = orderSizeOptions[selectedCategory];

    if (availableSizes.length === 0) {
      return;
    }

    setSelectedSize((currentSize) => Math.min(currentSize, availableSizes.length));
  }, [selectedCategory]);

  useEffect(() => {
    if (!isProfileModalOpen && !isOrderModalOpen && !isRegisterModalOpen && !isFutureBookingModalOpen && !isHelperAssistantOpen && !addingProductKey) {
      document.body.style.overflow = "";
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isProfileModalOpen, isOrderModalOpen, isRegisterModalOpen, isFutureBookingModalOpen, isHelperAssistantOpen, addingProductKey]);

  const bookingDateValue = bookingDate || "";
  const bookingDateObject = bookingDateValue ? new Date(`${bookingDateValue}T00:00:00`) : null;
  const calendarYear = calendarCursor.getFullYear();
  const calendarMonth = calendarCursor.getMonth();
  const firstDayIndex = new Date(calendarYear, calendarMonth, 1).getDay();
  const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveHeroSlide((prev) => (prev + 1) % heroCarouselImages.length);
    }, 4000);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    cardsLoadingTimeoutRef.current = window.setTimeout(() => {
      setIsCardsLoading(false);
    }, 3000);

    return () => {
      if (cardsLoadingTimeoutRef.current !== null) {
        window.clearTimeout(cardsLoadingTimeoutRef.current);
      }
      if (addToCartTimeoutRef.current !== null) {
        window.clearTimeout(addToCartTimeoutRef.current);
      }
      if (cartAlertTimeoutRef.current !== null) {
        window.clearTimeout(cartAlertTimeoutRef.current);
      }
      if (formAlertTimeoutRef.current !== null) {
        window.clearTimeout(formAlertTimeoutRef.current);
      }
      if (promoIntervalRef.current !== null) {
        window.clearInterval(promoIntervalRef.current);
      }
      if (promoTimeoutRef.current !== null) {
        window.clearTimeout(promoTimeoutRef.current);
      }
    };
  }, []);

  const [showAddToCartAlert, setShowAddToCartAlert] = useState(false);
  const [showFormAlert, setShowFormAlert] = useState(false);
  const [formAlertMessage, setFormAlertMessage] = useState("");
  const [showPromo, setShowPromo] = useState(false);
  const [promoMessage, setPromoMessage] = useState("");

  const handleAddToCart = (productKey: string) => {
    if (addingProductKey) return;

    // show temporary toast immediately
    setShowAddToCartAlert(true);
    if (cartAlertTimeoutRef.current !== null) {
      window.clearTimeout(cartAlertTimeoutRef.current);
    }
    cartAlertTimeoutRef.current = window.setTimeout(() => {
      setShowAddToCartAlert(false);
    }, 2500);

    setAddingProductKey(productKey);

    addToCartTimeoutRef.current = window.setTimeout(() => {
      router.push("/cart");
    }, 900);
  };

  const handleOrderSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsOrderModalOpen(false);
    // show mock confirmation
    setFormAlertMessage("Order submitted (mock)");
    setShowFormAlert(true);
    if (formAlertTimeoutRef.current !== null) {
      window.clearTimeout(formAlertTimeoutRef.current);
    }
    formAlertTimeoutRef.current = window.setTimeout(() => {
      setShowFormAlert(false);
    }, 2500);
  };

  const handleRegisterSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsRegisterModalOpen(false);
    // show mock confirmation
    setFormAlertMessage("Account created (mock)");
    setShowFormAlert(true);
    if (formAlertTimeoutRef.current !== null) {
      window.clearTimeout(formAlertTimeoutRef.current);
    }
    formAlertTimeoutRef.current = window.setTimeout(() => {
      setShowFormAlert(false);
    }, 2500);
  };

  const handleFutureBookingSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsFutureBookingModalOpen(false);
    // show mock confirmation
    setFormAlertMessage("Booking confirmed (mock)");
    setShowFormAlert(true);
    if (formAlertTimeoutRef.current !== null) {
      window.clearTimeout(formAlertTimeoutRef.current);
    }
    formAlertTimeoutRef.current = window.setTimeout(() => {
      setShowFormAlert(false);
    }, 2500);
  };

  const moveCalendarMonth = (offset: number) => {
    setCalendarCursor((currentDate) => new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1));
  };

  useEffect(() => {
    const scheduleMs = () => 10000 + Math.floor(Math.random() * 10000); // 10-20s

    const tick = () => {
      const idx = Math.floor(Math.random() * promoMessages.length);
      setPromoMessage(promoMessages[idx]);
      setShowPromo(true);

      if (promoTimeoutRef.current !== null) {
        window.clearTimeout(promoTimeoutRef.current);
      }
      promoTimeoutRef.current = window.setTimeout(() => setShowPromo(false), 4500);
    };

    // start periodic promos
    promoIntervalRef.current = window.setInterval(() => tick(), scheduleMs());
    // show first promo after short delay
    const first = window.setTimeout(() => tick(), 3000);

    return () => {
      if (promoIntervalRef.current !== null) window.clearInterval(promoIntervalRef.current);
      if (promoTimeoutRef.current !== null) window.clearTimeout(promoTimeoutRef.current);
      window.clearTimeout(first);
    };
  }, []);

  return (
    <main className="flex min-h-screen flex-col bg-[var(--color-bg)] text-[var(--color-text)]">
      <header className="fixed top-0 left-0 right-0 z-40 flex items-center gap-4 border-b border-[var(--color-border)] bg-[linear-gradient(135deg,var(--color-surface),var(--color-surface-alt))] px-4 py-3 shadow-[0_12px_30px_rgba(15,23,42,0.08)] backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <button
            className="inline-flex items-center justify-center rounded-md p-2 transition-colors hover:bg-[rgba(225,29,72,0.12)]"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            aria-label={isSidebarOpen ? "Close menu" : "Open menu"}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Logo + title: shown on all sizes, left-aligned after hamburger */}
          <Link href="/" className="flex items-center gap-3 pointer-events-auto">
            <Image
              src="/grabe-go-logo.png"
              alt="Grab & Go logo"
              width={40}
              height={40}
              className="h-9 w-9 rounded-full object-cover ring-1 ring-white shadow-[0_6px_14px_rgba(15,23,42,0.12)] sm:h-12 sm:w-12 sm:ring-2"
              priority
            />
            <span className="text-sm font-semibold tracking-tight text-[var(--color-primary)] sm:text-lg">Grab &amp; Go</span>
          </Link>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <nav className="hidden sm:flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsOrderModalOpen(true)}
              className="inline-flex items-center justify-center rounded-full border border-[var(--color-border)] bg-[linear-gradient(135deg,var(--color-primary),var(--color-secondary))] px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_20px_rgba(225,29,72,0.2)] transition-transform hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(225,29,72,0.28)]"
              aria-haspopup="dialog"
            >
              Place Order
            </button>

            <div className="group relative">
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
              <span className="pointer-events-none absolute left-1/2 top-full z-10 mt-3 -translate-x-1/2 opacity-0 transition duration-150 group-hover:-translate-y-1 group-hover:opacity-100">
                <span className="relative block w-max rounded-[1.1rem] bg-[var(--color-accent)] px-4 py-2 text-sm font-semibold text-[var(--color-footer)] shadow-[0_12px_28px_rgba(15,23,42,0.18)]">
                  Cart
                  <span className="absolute left-1/2 top-full h-3 w-3 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-[var(--color-accent)]" />
                </span>
              </span>
            </div>

            {headerNavItems.map((item) => (
              <div key={item.label} className="group relative">
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] p-2 text-[var(--color-text)] transition-all hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white"
                  aria-label={item.label}
                >
                  <Image src={item.src} alt={item.alt} width={18} height={18} className="h-[18px] w-[18px] object-contain" />
                </button>
                <span className="pointer-events-none absolute left-1/2 top-full z-10 mt-3 -translate-x-1/2 opacity-0 transition duration-150 group-hover:-translate-y-1 group-hover:opacity-100">
                  <span className="relative block w-max rounded-[1.1rem] bg-[var(--color-accent)] px-4 py-2 text-sm font-semibold text-[var(--color-footer)] shadow-[0_12px_28px_rgba(15,23,42,0.18)]">
                    {item.label}
                    <span className="absolute left-1/2 top-full h-3 w-3 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-[var(--color-accent)]" />
                  </span>
                </span>
              </div>
            ))}
          </nav>

          <div className="flex items-center gap-3 sm:hidden">
              <button
                type="button"
                onClick={() => setIsOrderModalOpen(true)}
                className="inline-flex items-center justify-center rounded-full border border-[var(--color-border)] bg-[linear-gradient(135deg,var(--color-primary),var(--color-secondary))] px-3 py-2 text-xs font-semibold whitespace-nowrap text-white shadow-[0_10px_20px_rgba(225,29,72,0.2)] transition-transform hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(225,29,72,0.28)]"
                aria-haspopup="dialog"
              >
                Place Order
              </button>

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

            <button
              type="button"
              aria-label="Profile"
              className="group relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-border)] shadow-[0_8px_18px_rgba(225,29,72,0.25)]"
              onClick={() => setIsProfileModalOpen(true)}
            >
              <Image
                src="/Avatar_profile_image.png"
                alt="Masoom Tariq profile"
                width={40}
                height={40}
                className="h-full w-full overflow-hidden rounded-full object-cover"
              />
            </button>
          </div>

          <button
            type="button"
            aria-label="Profile"
            className="hidden sm:inline-flex group relative h-10 w-10 items-center justify-center rounded-full border border-[var(--color-border)] shadow-[0_8px_18px_rgba(225,29,72,0.25)]"
            onClick={() => setIsProfileModalOpen(true)}
          >
            <Image
              src="/Avatar_profile_image.png"
              alt="Masoom Tariq profile"
              width={40}
              height={40}
              className="h-full w-full overflow-hidden rounded-full object-cover"
            />
            <span className="pointer-events-none absolute left-1/2 top-full z-10 mt-3 -translate-x-1/2 opacity-0 transition duration-150 group-hover:-translate-y-1 group-hover:opacity-100">
              <span className="relative block w-max rounded-[1.1rem] bg-[var(--color-accent)] px-4 py-2 text-sm font-semibold text-[var(--color-footer)] shadow-[0_12px_28px_rgba(15,23,42,0.18)]">
                Profile
                <span className="absolute left-1/2 top-full h-3 w-3 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-[var(--color-accent)]" />
              </span>
            </span>
          </button>

          <button
            type="button"
            onClick={() => setIsRegisterModalOpen(true)}
            className="hidden sm:inline-flex items-center justify-center rounded-full border border-[var(--color-border)] bg-[linear-gradient(135deg,var(--color-secondary),var(--color-accent))] px-4 py-2 text-sm font-semibold text-[var(--color-footer)] shadow-[0_10px_20px_rgba(249,115,22,0.16)] transition-transform hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(249,115,22,0.24)]"
            aria-haspopup="dialog"
          >
            Register
          </button>

          <button
            type="button"
            onClick={() => setIsFutureBookingModalOpen(true)}
            className="hidden sm:inline-flex items-center justify-center rounded-full border border-[var(--color-border)] bg-[linear-gradient(135deg,var(--color-support),var(--color-accent))] px-4 py-2 text-sm font-semibold text-[var(--color-footer)] shadow-[0_10px_20px_rgba(37,99,235,0.16)] transition-transform hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(37,99,235,0.24)]"
            aria-haspopup="dialog"
          >
            Future Booking
          </button>
        </div>
      </header>

      {addingProductKey && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center px-4" role="status" aria-live="polite" aria-label="Adding item to cart">
          <div className="absolute inset-0 bg-[rgba(15,23,42,0.6)] backdrop-blur-[2px]" />
          <div className="relative w-full max-w-sm rounded-[1.25rem] border border-[var(--color-border)] bg-[linear-gradient(180deg,var(--color-surface),#fff6eb)] p-6 text-center shadow-[0_24px_56px_rgba(15,23,42,0.2)]">
            <span className="mx-auto inline-block h-10 w-10 animate-spin rounded-full border-[3px] border-[var(--color-border)] border-t-[var(--color-primary)]" aria-hidden />
            <h3 className="mt-4 text-lg font-semibold text-[var(--color-text)]">Adding to cart</h3>
            <p className="mt-2 text-sm text-[var(--color-muted)]">Please wait while we prepare your cart preview.</p>
          </div>
        </div>
      )}

      {showAddToCartAlert && (
        <div className="fixed bottom-6 right-6 z-[80]" role="status" aria-live="polite">
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 shadow-[0_8px_20px_rgba(15,23,42,0.12)] text-sm font-medium text-[var(--color-text)]">
            Your item has been added to the cart
          </div>
        </div>
      )}

      {showFormAlert && (
        <div className="fixed bottom-20 right-6 z-[80]" role="status" aria-live="polite">
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 shadow-[0_8px_20px_rgba(15,23,42,0.12)] text-sm font-medium text-[var(--color-text)]">
            {formAlertMessage}
          </div>
        </div>
      )}

      {showPromo && (
        <div className="fixed top-6 right-6 z-[90]" role="status" aria-live="polite">
          <div className="flex items-center gap-3 rounded-xl border border-[var(--color-border)] bg-[linear-gradient(90deg,var(--color-primary),var(--color-secondary))] px-4 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(15,23,42,0.18)]">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <circle cx="10" cy="10" r="9" stroke="white" strokeOpacity="0.12" strokeWidth="1.5" />
              <path d="M6 10h8M10 6v8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>{promoMessage}</span>
          </div>
        </div>
      )}

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

      {isOrderModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center px-4 py-6 sm:items-center sm:py-10" role="dialog" aria-modal="true" aria-label="Place order form">
          <div className="absolute inset-0 bg-[rgba(15,23,42,0.55)]" onClick={() => setIsOrderModalOpen(false)} />
          <form
            onSubmit={handleOrderSubmit}
            className="relative w-full max-w-3xl max-h-[calc(100vh-3rem)] overflow-y-auto rounded-[1.5rem] border border-[var(--color-border)] bg-[linear-gradient(180deg,var(--color-surface),#fff6eb)] p-5 shadow-[0_24px_56px_rgba(15,23,42,0.18)] sm:p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">Quick order</p>
                <h3 className="mt-1 text-xl font-semibold text-[var(--color-text)]">Place Order</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsOrderModalOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-text)] transition-colors hover:bg-[rgba(249,115,22,0.08)]"
                aria-label="Close order form"
              >
                ✕
              </button>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-2 text-sm font-medium text-[var(--color-text)]">
                Name
                <input
                  type="text"
                  value={customerName}
                  onChange={(event) => setCustomerName(event.target.value)}
                  placeholder="Enter your name"
                  className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text)] outline-none transition-colors placeholder:text-[var(--color-muted)] focus:border-[var(--color-primary)]"
                />
              </label>

              <label className="flex flex-col gap-2 text-sm font-medium text-[var(--color-text)]">
                Quantity
                <input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(event) => setQuantity(Math.max(1, Number(event.target.value) || 1))}
                  className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text)] outline-none transition-colors focus:border-[var(--color-primary)]"
                />
              </label>

              <label className="flex flex-col gap-2 text-sm font-medium text-[var(--color-text)] sm:col-span-2">
                Item type
                <select
                  value={selectedCategory}
                  onChange={(event) => setSelectedCategory(event.target.value as OrderCategory)}
                  className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text)] outline-none transition-colors focus:border-[var(--color-primary)]"
                >
                  {orderCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>

              <div className="sm:col-span-2">
                <label className="flex flex-col gap-2 text-sm font-medium text-[var(--color-text)]">
                  Any Suggestions
                  <textarea
                    value={suggestions}
                    onChange={(event) => setSuggestions(event.target.value)}
                    rows={4}
                    placeholder="Tell us about spice level, modifications, or delivery notes"
                    className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text)] outline-none transition-colors placeholder:text-[var(--color-muted)] focus:border-[var(--color-primary)]"
                  />
                </label>
              </div>

              {(selectedCategory === "Pizza" || selectedCategory === "Pasta") && (
                <fieldset className="sm:col-span-2">
                  <legend className="text-sm font-medium text-[var(--color-text)]">Toppings</legend>
                  <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {toppingOptions.map((topping) => (
                      <label
                        key={topping}
                        className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)]"
                      >
                        <input
                          type="checkbox"
                          checked={selectedToppings.includes(topping)}
                          onChange={(event) => {
                            setSelectedToppings((currentToppings) =>
                              event.target.checked
                                ? [...currentToppings, topping]
                                : currentToppings.filter((item) => item !== topping),
                            );
                          }}
                          className="h-4 w-4 accent-[var(--color-primary)]"
                        />
                        {topping}
                      </label>
                    ))}
                  </div>
                </fieldset>
              )}

              <fieldset className="sm:col-span-2">
                <legend className="text-sm font-medium text-[var(--color-text)]">Type / Flavor</legend>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {orderFlavorOptions[selectedCategory].map((flavor) => (
                    <label
                      key={flavor}
                      className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition-colors ${selectedFlavor === flavor ? "border-[var(--color-primary)] bg-[rgba(249,115,22,0.08)]" : "border-[var(--color-border)] bg-[var(--color-surface)]"}`}
                    >
                      <input
                        type="radio"
                        name="order-flavor"
                        value={flavor}
                        checked={selectedFlavor === flavor}
                        onChange={() => setSelectedFlavor(flavor)}
                        className="h-4 w-4 accent-[var(--color-primary)]"
                      />
                      {flavor}
                    </label>
                  ))}
                </div>
              </fieldset>

              {orderSizeOptions[selectedCategory].length > 0 && (
                <div className="sm:col-span-2">
                  <label className="flex flex-col gap-3 text-sm font-medium text-[var(--color-text)]">
                    Size
                    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-4">
                      <input
                        type="range"
                        min={1}
                        max={orderSizeOptions[selectedCategory].length}
                        step={1}
                        value={selectedSize}
                        onChange={(event) => setSelectedSize(Number(event.target.value))}
                        className="w-full accent-[var(--color-primary)]"
                      />
                      <div className="mt-3 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-muted)]">
                        {orderSizeOptions[selectedCategory].map((sizeLabel) => (
                          <span key={sizeLabel}>{sizeLabel}</span>
                        ))}
                      </div>
                      <p className="mt-3 text-sm font-semibold text-[var(--color-primary)]">
                        Selected: {orderSizeOptions[selectedCategory][selectedSize - 1]}
                      </p>
                    </div>
                  </label>
                </div>
              )}

              <div className="sm:col-span-2">
                <label className="flex items-center justify-between gap-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm font-medium text-[var(--color-text)]">
                  <span>Fast delivery</span>
                  <span className={`relative h-7 w-12 rounded-full border transition-colors ${isFastDelivery ? "border-[var(--color-primary)] bg-[var(--color-primary)]" : "border-[var(--color-border)] bg-[rgba(15,23,42,0.12)]"}`}>
                    <span className={`absolute left-0.5 top-0.5 h-6 w-6 rounded-full bg-white shadow-[0_2px_6px_rgba(15,23,42,0.16)] transition-transform ${isFastDelivery ? "translate-x-5" : "translate-x-0"}`} />
                    <input
                      type="checkbox"
                      checked={isFastDelivery}
                      onChange={(event) => setIsFastDelivery(event.target.checked)}
                      className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                      aria-label="Fast delivery"
                    />
                  </span>
                </label>
                {isFastDelivery && <p className="mt-2 text-sm font-medium text-[var(--color-primary)]">It will add 50 extra Rs to the bill</p>}
              </div>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setIsOrderModalOpen(false)}
                className="inline-flex items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-3 text-sm font-semibold text-[var(--color-text)] transition-colors hover:bg-[rgba(249,115,22,0.08)]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-xl bg-[linear-gradient(135deg,var(--color-primary),var(--color-secondary))] px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(225,29,72,0.2)] transition-transform hover:-translate-y-0.5 hover:shadow-[0_16px_30px_rgba(225,29,72,0.28)]"
              >
                Submit Order
              </button>
            </div>
          </form>
        </div>
      )}

      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center px-4 py-6 sm:items-center sm:py-10" role="dialog" aria-modal="true" aria-label="Register account form">
          <div className="absolute inset-0 bg-[rgba(15,23,42,0.55)]" onClick={() => setIsRegisterModalOpen(false)} />
          <form
            onSubmit={handleRegisterSubmit}
            className="relative w-full max-w-lg rounded-[1.5rem] border border-[var(--color-border)] bg-[linear-gradient(180deg,var(--color-surface),#fff6eb)] p-5 shadow-[0_24px_56px_rgba(15,23,42,0.18)] sm:p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">New account</p>
                <h3 className="mt-1 text-xl font-semibold text-[var(--color-text)]">Register</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsRegisterModalOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-text)] transition-colors hover:bg-[rgba(249,115,22,0.08)]"
                aria-label="Close register form"
              >
                ✕
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <label className="flex flex-col gap-2 text-sm font-medium text-[var(--color-text)]">
                Name
                <input
                  type="text"
                  placeholder="Enter your name"
                  className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text)] outline-none transition-colors placeholder:text-[var(--color-muted)] focus:border-[var(--color-primary)]"
                />
              </label>

              <label className="flex flex-col gap-2 text-sm font-medium text-[var(--color-text)]">
                Email
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text)] outline-none transition-colors placeholder:text-[var(--color-muted)] focus:border-[var(--color-primary)]"
                />
              </label>

              <label className="flex flex-col gap-2 text-sm font-medium text-[var(--color-text)]">
                Password
                <input
                  type="password"
                  placeholder="Create a password"
                  className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text)] outline-none transition-colors placeholder:text-[var(--color-muted)] focus:border-[var(--color-primary)]"
                />
              </label>

              <label className="flex flex-col gap-2 text-sm font-medium text-[var(--color-text)]">
                Profile
                <input
                  type="file"
                  accept="image/*"
                  className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-muted)] file:mr-4 file:rounded-full file:border-0 file:bg-[linear-gradient(135deg,var(--color-primary),var(--color-secondary))] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
                />
              </label>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setIsRegisterModalOpen(false)}
                className="inline-flex items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-3 text-sm font-semibold text-[var(--color-text)] transition-colors hover:bg-[rgba(249,115,22,0.08)]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-xl bg-[linear-gradient(135deg,var(--color-primary),var(--color-secondary))] px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(225,29,72,0.2)] transition-transform hover:-translate-y-0.5 hover:shadow-[0_16px_30px_rgba(225,29,72,0.28)]"
              >
                Create Account
              </button>
            </div>
          </form>
        </div>
      )}

      {isFutureBookingModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center px-4 py-6 sm:items-center sm:py-10" role="dialog" aria-modal="true" aria-label="Future booking form">
          <div className="absolute inset-0 bg-[rgba(15,23,42,0.55)]" onClick={() => setIsFutureBookingModalOpen(false)} />
          <form
            onSubmit={handleFutureBookingSubmit}
            className="relative w-full max-w-3xl max-h-[calc(100vh-3rem)] overflow-y-auto rounded-[1.5rem] border border-[var(--color-border)] bg-[linear-gradient(180deg,var(--color-surface),#fff6eb)] p-5 shadow-[0_24px_56px_rgba(15,23,42,0.18)] sm:p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">Plan ahead</p>
                <h3 className="mt-1 text-xl font-semibold text-[var(--color-text)]">Future Booking</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsFutureBookingModalOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-text)] transition-colors hover:bg-[rgba(249,115,22,0.08)]"
                aria-label="Close future booking form"
              >
                ✕
              </button>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-2 text-sm font-medium text-[var(--color-text)]">
                Name
                <input
                  type="text"
                  placeholder="Enter your name"
                  className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text)] outline-none transition-colors placeholder:text-[var(--color-muted)] focus:border-[var(--color-primary)]"
                />
              </label>

              <label className="flex flex-col gap-2 text-sm font-medium text-[var(--color-text)]">
                Quantity
                <input
                  type="number"
                  min={1}
                  defaultValue={1}
                  className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text)] outline-none transition-colors focus:border-[var(--color-primary)]"
                />
              </label>

              <label className="flex flex-col gap-2 text-sm font-medium text-[var(--color-text)] sm:col-span-2">
                Booking date
                <input
                  type="date"
                  value={bookingDateValue}
                  onChange={(event) => setBookingDate(event.target.value)}
                  className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text)] outline-none transition-colors focus:border-[var(--color-primary)]"
                />
              </label>

              <label className="flex flex-col gap-2 text-sm font-medium text-[var(--color-text)] sm:col-span-2">
                Any Suggestions
                <textarea
                  value={suggestions}
                  onChange={(event) => setSuggestions(event.target.value)}
                  rows={4}
                  placeholder="Tell us about spice level, modifications, or delivery notes"
                  className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text)] outline-none transition-colors placeholder:text-[var(--color-muted)] focus:border-[var(--color-primary)]"
                />
              </label>

              {(selectedCategory === "Pizza" || selectedCategory === "Pasta") && (
                <fieldset className="sm:col-span-2">
                  <legend className="text-sm font-medium text-[var(--color-text)]">Toppings</legend>
                  <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {toppingOptions.map((topping) => (
                      <label
                        key={topping}
                        className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)]"
                      >
                        <input
                          type="checkbox"
                          checked={selectedToppings.includes(topping)}
                          onChange={(event) => {
                            setSelectedToppings((currentToppings) =>
                              event.target.checked
                                ? [...currentToppings, topping]
                                : currentToppings.filter((item) => item !== topping),
                            );
                          }}
                          className="h-4 w-4 accent-[var(--color-primary)]"
                        />
                        {topping}
                      </label>
                    ))}
                  </div>
                </fieldset>
              )}

              <fieldset className="sm:col-span-2">
                <legend className="text-sm font-medium text-[var(--color-text)]">Type / Flavor</legend>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {orderFlavorOptions[selectedCategory].map((flavor) => (
                    <label
                      key={flavor}
                      className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition-colors ${selectedFlavor === flavor ? "border-[var(--color-primary)] bg-[rgba(249,115,22,0.08)]" : "border-[var(--color-border)] bg-[var(--color-surface)]"}`}
                    >
                      <input
                        type="radio"
                        name="future-booking-flavor"
                        value={flavor}
                        checked={selectedFlavor === flavor}
                        onChange={() => setSelectedFlavor(flavor)}
                        className="h-4 w-4 accent-[var(--color-primary)]"
                      />
                      {flavor}
                    </label>
                  ))}
                </div>
              </fieldset>

              {orderSizeOptions[selectedCategory].length > 0 && (
                <div className="sm:col-span-2">
                  <label className="flex flex-col gap-3 text-sm font-medium text-[var(--color-text)]">
                    Size
                    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-4">
                      <input
                        type="range"
                        min={1}
                        max={orderSizeOptions[selectedCategory].length}
                        step={1}
                        value={selectedSize}
                        onChange={(event) => setSelectedSize(Number(event.target.value))}
                        className="w-full accent-[var(--color-primary)]"
                      />
                      <div className="mt-3 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-muted)]">
                        {orderSizeOptions[selectedCategory].map((sizeLabel) => (
                          <span key={sizeLabel}>{sizeLabel}</span>
                        ))}
                      </div>
                      <p className="mt-3 text-sm font-semibold text-[var(--color-primary)]">
                        Selected: {orderSizeOptions[selectedCategory][selectedSize - 1]}
                      </p>
                    </div>
                  </label>
                </div>
              )}

              <div className="sm:col-span-2">
                <label className="flex items-center justify-between gap-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm font-medium text-[var(--color-text)]">
                  <span>Fast delivery</span>
                  <span className={`relative h-7 w-12 rounded-full border transition-colors ${isFastDelivery ? "border-[var(--color-primary)] bg-[var(--color-primary)]" : "border-[var(--color-border)] bg-[rgba(15,23,42,0.12)]"}`}>
                    <span className={`absolute left-0.5 top-0.5 h-6 w-6 rounded-full bg-white shadow-[0_2px_6px_rgba(15,23,42,0.16)] transition-transform ${isFastDelivery ? "translate-x-5" : "translate-x-0"}`} />
                    <input
                      type="checkbox"
                      checked={isFastDelivery}
                      onChange={(event) => setIsFastDelivery(event.target.checked)}
                      className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                      aria-label="Fast delivery"
                    />
                  </span>
                </label>
                {isFastDelivery && <p className="mt-2 text-sm font-medium text-[var(--color-primary)]">It will add 50 extra Rs to the bill</p>}
              </div>

              <div className="sm:col-span-2">
                <div className="rounded-[1.25rem] border border-[var(--color-border)] bg-[linear-gradient(180deg,var(--color-surface),#fffaf2)] p-4">
                  <p className="text-sm font-semibold text-[var(--color-text)]">Selected schedule</p>
                  <div className="mt-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.12em] text-[var(--color-muted)]">Date picker</p>
                    <p className="mt-1 text-sm font-medium text-[var(--color-text)]">{bookingDateValue || "No date selected yet"}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setIsFutureBookingModalOpen(false)}
                className="inline-flex items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-3 text-sm font-semibold text-[var(--color-text)] transition-colors hover:bg-[rgba(249,115,22,0.08)]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-xl bg-[linear-gradient(135deg,var(--color-support),var(--color-secondary))] px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(37,99,235,0.2)] transition-transform hover:-translate-y-0.5 hover:shadow-[0_16px_30px_rgba(37,99,235,0.28)]"
              >
                Confirm Booking
              </button>
            </div>
          </form>
        </div>
      )}

      {isHelperAssistantOpen && (
        <div className="fixed inset-0 z-[65] flex items-end justify-end p-4 sm:p-6" role="dialog" aria-modal="true" aria-label="Helper assistant">
          <div className="absolute inset-0 bg-[rgba(15,23,42,0.15)]" onClick={() => setIsHelperAssistantOpen(false)} />
          <div className="relative w-full max-w-sm rounded-[1.4rem] border border-[var(--color-border)] bg-[linear-gradient(180deg,var(--color-surface),#fff7ef)] p-4 shadow-[0_24px_56px_rgba(15,23,42,0.18)] sm:p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">Assistant</p>
                <h3 className="mt-1 text-lg font-semibold text-[var(--color-text)]">Need a hand?</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsHelperAssistantOpen(false)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-text)] transition-colors hover:bg-[rgba(249,115,22,0.08)]"
                aria-label="Close helper assistant"
              >
                ✕
              </button>
            </div>

            <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">
              I can help you place an order, plan a future booking, register an account, or jump to your cart.
            </p>

            <div className="mt-4 grid gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsOrderModalOpen(true);
                  setIsHelperAssistantOpen(false);
                }}
                className="inline-flex items-center justify-center rounded-xl bg-[linear-gradient(135deg,var(--color-primary),var(--color-secondary))] px-4 py-3 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(225,29,72,0.18)] transition-transform hover:-translate-y-0.5"
              >
                Open Place Order
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsFutureBookingModalOpen(true);
                  setIsHelperAssistantOpen(false);
                }}
                className="inline-flex items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm font-semibold text-[var(--color-text)] transition-colors hover:bg-[rgba(249,115,22,0.08)]"
              >
                Open Future Booking
              </button>
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
      {isDesktop && isSidebarOpen && (
        <aside
          ref={sidebarRef}
          className="fixed left-0 top-[5.5rem] z-30 h-[calc(100vh-5.5rem)] overflow-auto border-r border-[var(--color-border)] bg-[linear-gradient(180deg,var(--color-surface),#fff4e6)] p-4 shadow-[8px_0_30px_rgba(15,23,42,0.06)] transition-[width] duration-75"
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
      {isDesktop && isSidebarOpen && (
        <div
          onMouseDown={handleMouseDown}
          className="fixed top-[5.5rem] z-40 hidden h-[calc(100vh-5.5rem)] w-1 cursor-col-resize bg-transparent hover:bg-[rgba(249,115,22,0.18)] sm:block"
          style={{ userSelect: 'none', left: `${sidebarWidth}px` }}
        />
      )}

      <section
        className="mt-[5.5rem] flex-1 bg-[radial-gradient(circle_at_top,rgba(250,204,21,0.08),transparent_28%),linear-gradient(180deg,var(--color-bg),#fffaf4)]"
        style={{ marginLeft: isDesktop && isSidebarOpen ? `${sidebarWidth}px` : 0 }}
      >
        <div className="px-4 pb-2 pt-6 sm:px-8">
          <div className="relative overflow-hidden rounded-[1.75rem] border border-[var(--color-border)] bg-[linear-gradient(135deg,#fff7ec,var(--color-surface))] shadow-[0_22px_46px_rgba(15,23,42,0.12)]">
            <div className="relative h-[260px] bg-[rgba(15,23,42,0.08)] sm:h-[340px] lg:h-[420px]">
              {heroCarouselImages.map((image, index) => {
                const isActive = index === activeHeroSlide;

                return (
                  <Image
                    key={image.src}
                    src={image.src}
                    alt={image.alt}
                    fill
                    priority={index === 0}
                    className={`object-contain transition-opacity duration-500 ${isActive ? "opacity-100" : "opacity-0"}`}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 70vw"
                  />
                );
              })}

              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(100deg,rgba(15,23,42,0.6)_0%,rgba(15,23,42,0.18)_48%,rgba(15,23,42,0.08)_100%)]" />

              <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/90">Chef Specials</p>
                <h2 className="mt-2 max-w-xl text-2xl font-semibold text-white sm:text-3xl">Crave-worthy meals served hot and fast</h2>
                <p className="mt-2 max-w-xl text-sm text-white/85">Swipe through our highlighted pizza, burger, and pasta picks in the hero carousel.</p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setActiveHeroSlide((prev) =>
                    prev === 0 ? heroCarouselImages.length - 1 : prev - 1,
                  )
                }
                className="absolute left-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-white/20 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
                aria-label="Previous slide"
              >
                <span aria-hidden>‹</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  setActiveHeroSlide((prev) => (prev + 1) % heroCarouselImages.length)
                }
                className="absolute right-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-white/20 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
                aria-label="Next slide"
              >
                <span aria-hidden>›</span>
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 border-t border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3">
              {heroCarouselImages.map((image, index) => (
                <button
                  key={image.src}
                  type="button"
                  onClick={() => setActiveHeroSlide(index)}
                  className={`h-2.5 rounded-full transition-all ${index === activeHeroSlide ? "w-8 bg-[var(--color-primary)]" : "w-2.5 bg-[var(--color-border)] hover:bg-[var(--color-secondary)]"}`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

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

              {isCardsLoading ? (
                isGridLayout ? (
                  <div className="px-4 sm:px-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: cardCount }, (_, skeletonIndex) => (
                      <article
                        key={`${category}-skeleton-${skeletonIndex}`}
                        className="animate-pulse rounded-[1.5rem] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[0_14px_35px_rgba(15,23,42,0.06)]"
                      >
                        <div className="mb-4 h-40 rounded-[1rem] bg-[rgba(15,23,42,0.08)]" />
                        <div className="h-5 w-2/3 rounded-full bg-[rgba(15,23,42,0.08)]" />
                        <div className="mt-3 h-4 w-1/3 rounded-full bg-[rgba(15,23,42,0.08)]" />
                        <div className="mt-5 h-10 w-full rounded-xl bg-[rgba(249,115,22,0.16)]" />
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="px-4 sm:px-8 flex flex-col gap-6 sm:flex-row sm:items-start">
                    {Array.from({ length: cardCount }, (_, skeletonIndex) => (
                      <article
                        key={`${category}-skeleton-${skeletonIndex}`}
                        className="flex-1 animate-pulse rounded-[1.5rem] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[0_14px_35px_rgba(15,23,42,0.06)]"
                      >
                        <div className="mb-4 h-40 rounded-[1rem] bg-[rgba(15,23,42,0.08)]" />
                        <div className="h-5 w-2/3 rounded-full bg-[rgba(15,23,42,0.08)]" />
                        <div className="mt-3 h-4 w-1/3 rounded-full bg-[rgba(15,23,42,0.08)]" />
                        <div className="mt-5 h-10 w-full rounded-xl bg-[rgba(249,115,22,0.16)]" />
                      </article>
                    ))}
                  </div>
                )
              ) : isGridLayout ? (
                <div className="px-4 sm:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mockProducts.map((product) => {
                    const productKey = `${category}-${product.id}`;

                    return (
                    <article
                      key={product.id}
                      className="rounded-[1.5rem] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[0_14px_35px_rgba(15,23,42,0.08)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(15,23,42,0.12)]"
                    >
                      <div className="mb-4 h-40 rounded-[1rem] bg-[linear-gradient(135deg,#fde68a_0%,#fb923c_48%,#ef4444_100%)] shadow-inner" />
                      <h3 className="text-lg font-semibold text-[var(--color-text)]">{product.name}</h3>
                      <p className="mt-2 text-sm text-[var(--color-muted)]">{product.price}</p>
                      <button
                        type="button"
                        onClick={() => handleAddToCart(productKey)}
                        disabled={addingProductKey !== null}
                        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,var(--color-primary),var(--color-secondary))] px-3 py-2 text-sm font-medium text-white shadow-[0_10px_20px_rgba(225,29,72,0.2)] transition-transform hover:scale-[1.01] hover:shadow-[0_14px_28px_rgba(225,29,72,0.28)] disabled:cursor-not-allowed disabled:opacity-80"
                      >
                        Add to Cart
                      </button>
                    </article>
                  );
                  })}
                </div>
              ) : (
                <div className="px-4 sm:px-8 flex flex-col sm:flex-row sm:items-start gap-6">
                  {mockProducts.map((product) => {
                    const productKey = `${category}-${product.id}`;

                    return (
                    <article key={product.id} className="flex-1 rounded-[1.5rem] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[0_14px_35px_rgba(15,23,42,0.08)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(15,23,42,0.12)]">
                      <div className="mb-4 h-40 rounded-[1rem] bg-[linear-gradient(135deg,#fde68a_0%,#fb923c_48%,#ef4444_100%)] shadow-inner" />
                      <h3 className="text-lg font-semibold text-[var(--color-text)]">{product.name}</h3>
                      <p className="mt-2 text-sm text-[var(--color-muted)]">{product.price}</p>
                      <button
                        type="button"
                        onClick={() => handleAddToCart(productKey)}
                        disabled={addingProductKey !== null}
                        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,var(--color-primary),var(--color-secondary))] px-3 py-2 text-sm font-medium text-white shadow-[0_10px_20px_rgba(225,29,72,0.2)] transition-transform hover:scale-[1.01] hover:shadow-[0_14px_28px_rgba(225,29,72,0.28)] disabled:cursor-not-allowed disabled:opacity-80"
                      >
                        Add to Cart
                      </button>
                    </article>
                  );
                  })}
                </div>
              )}

              {index < 3 && <div className="mt-6 h-px bg-[var(--color-border)]" />}
            </div>
          );
        })}
      </section>

      <section className="py-12" style={{ marginLeft: isDesktop && isSidebarOpen ? `${sidebarWidth}px` : 0 }}>
        <div className="px-4 sm:px-8">
          <div className="rounded-[1.5rem] border border-[var(--color-border)] bg-[linear-gradient(180deg,var(--color-surface),#fff5e8)] px-5 py-6 shadow-[0_16px_36px_rgba(15,23,42,0.08)] sm:px-8">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">FAQs</p>
              <h2 className="mt-2 text-2xl font-semibold text-[var(--color-primary)]">Frequently Asked Questions</h2>
              <p className="mt-2 text-sm text-[var(--color-muted)]">Mocked answers for now. These accordion items can later be connected to real help content.</p>
            </div>

            <div className="mt-6 space-y-3">
              {faqs.map((faq, index) => {
                const isOpen = openFaqIndex === index;

                return (
                  <div key={faq.question} className="overflow-hidden rounded-[1.1rem] border border-[var(--color-border)] bg-[var(--color-surface)]">
                    <button
                      type="button"
                      className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left sm:px-5"
                      onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                      aria-expanded={isOpen}
                    >
                      <span className="text-sm font-semibold text-[var(--color-text)] sm:text-base">{faq.question}</span>
                      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[rgba(249,115,22,0.12)] text-[var(--color-primary)] transition-transform ${isOpen ? "rotate-45" : ""}`}>
                        +
                      </span>
                    </button>
                    {isOpen && (
                      <div className="border-t border-[var(--color-border)] px-4 py-4 text-sm text-[var(--color-muted)] sm:px-5">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <footer className="mt-auto w-full bg-[var(--color-footer)]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 px-6 py-8" style={{ marginLeft: isDesktop && isSidebarOpen ? `${sidebarWidth}px` : 0 }}>
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

      <button
        type="button"
        onClick={() => setIsHelperAssistantOpen(true)}
        className="fixed bottom-5 right-5 z-[64] inline-flex h-14 w-14 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--color-primary),var(--color-secondary))] text-white shadow-[0_18px_36px_rgba(225,29,72,0.3)] transition-transform hover:-translate-y-1 hover:shadow-[0_22px_44px_rgba(225,29,72,0.35)]"
        aria-label="Open helper assistant"
      >
        <span className="text-2xl font-semibold leading-none">?</span>
      </button>
    </main>
  );
}
