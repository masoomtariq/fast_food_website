"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { HeroCarousel } from "@/components/hero-carousel";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
    value: "delivery",
    question: "How fast is delivery?",
    answer: "Most orders are delivered within 25 to 35 minutes depending on your location and order volume.",
  },
  {
    value: "tracking",
    question: "Can I track my order?",
    answer: "Yes. Order tracking will be shown in the app once your cart is confirmed and checkout is completed.",
  },
  {
    value: "payment",
    question: "What payment methods do you support?",
    answer: "For now this is mocked content, but the final version can support cash, card, and digital wallet payments.",
  },
  {
    value: "customization",
    question: "Can I customize my food?",
    answer: "Yes, item customization can be added so users can remove ingredients or choose extra toppings.",
  },
  {
    value: "deals",
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
  { text: "Limited-time: 20% off all pizzas — use code HOT20", gradient: "from-red-500 to-orange-500" },
  { text: "Buy one burger, get fries free — today only!", gradient: "from-orange-500 to-amber-500" },
  { text: "Free delivery on orders over Rs 499 — hurry up", gradient: "from-yellow-400 to-orange-400" },
  { text: "Family meal deal: 3 items for Rs 999 — order now", gradient: "from-amber-500 to-yellow-400" },
  { text: "Student special: extra 10% off with .edu email", gradient: "from-rose-500 to-red-500" },
] as const;

export default function Home() {
  const router = useRouter();
  const [isDesktop, setIsDesktop] = useState(true);

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
  const [formAlertType, setFormAlertType] = useState<"order" | "register" | "booking">("order");
  const [showPromo, setShowPromo] = useState(false);
  const [promoMessage, setPromoMessage] = useState("");
  const [promoIndex, setPromoIndex] = useState(0);

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
    setFormAlertType("order");
    setFormAlertMessage("Your order has been submitted successfully!");
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
    setFormAlertType("register");
    setFormAlertMessage("Account created successfully! Welcome aboard.");
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
    setFormAlertType("booking");
    setFormAlertMessage("Your booking is confirmed! See you soon.");
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
      setPromoIndex(idx);
      setPromoMessage(promoMessages[idx].text);
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
    <div className="drawer lg:drawer-open">
      <input id="drawer-menu" type="checkbox" className="drawer-toggle" />
      <main className="drawer-content flex min-h-screen flex-col bg-[var(--color-bg)] text-[var(--color-text)]">
        <nav className="navbar w-full border-b border-[var(--color-border)] bg-[linear-gradient(135deg,var(--color-surface),var(--color-surface-alt))] shadow-[0_12px_30px_rgba(15,23,42,0.08)] backdrop-blur-sm">
          <div className="flex items-center gap-3 flex-1">
            <label htmlFor="drawer-menu" aria-label="open sidebar" className="btn btn-square btn-ghost lg:hidden">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor" className="h-5 w-5"><path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"></path><path d="M9 4v16"></path><path d="M14 10l2 2l-2 2"></path></svg>
            </label>
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

          <div className="flex items-center gap-3">
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
        <div className="fixed bottom-6 right-6 z-[80] animate-in fade-in slide-in-from-right-4 duration-300" role="status" aria-live="polite">
          <div className="flex items-center gap-3 rounded-xl bg-[linear-gradient(135deg,#22c55e_0%,#16a34a_100%)] px-4 py-3 shadow-[0_12px_30px_rgba(34,197,94,0.28)] text-sm font-semibold text-white border border-[rgba(255,255,255,0.2)]">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <path d="M16.5 5L7.5 14L3.5 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>Your item has been added to the cart</span>
          </div>
        </div>
      )}

      {showFormAlert && (
        <div className="fixed bottom-20 right-6 z-[80] animate-in fade-in slide-in-from-right-4 duration-300" role="status" aria-live="polite">
          <div className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-white border border-[rgba(255,255,255,0.2)] shadow-[0_12px_30px_rgba(15,23,42,0.2)] ${
            formAlertType === "order"
              ? "bg-[linear-gradient(135deg,var(--color-primary),var(--color-secondary))]"
              : formAlertType === "register"
              ? "bg-[linear-gradient(135deg,#f97316,#fbbf24)]"
              : "bg-[linear-gradient(135deg,var(--color-support),#60a5fa)]"
          }`}>
            {formAlertType === "order" && (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <path d="M3 8h14M6 3h8a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V5a2 2 0 012-2z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
            {formAlertType === "register" && (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <path d="M10 10a2.5 2.5 0 100-5 2.5 2.5 0 000 5zm0 1c-2.5 0-5 1.25-5 2.5V17a1 1 0 001 1h8a1 1 0 001-1v-3.5c0-1.25-2.5-2.5-5-2.5z" fill="white" />
              </svg>
            )}
            {formAlertType === "booking" && (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <path d="M4 6h12a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2zm0-2v-1a1 1 0 011-1h2a1 1 0 011 1v1m6-1v1m-8 5h8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
            <span>{formAlertMessage}</span>
          </div>
        </div>
      )}

      {showPromo && (
        <div className="fixed top-6 right-6 z-[90] animate-in fade-in slide-in-from-top-2 duration-300" role="status" aria-live="polite">
          <div className={`flex items-center gap-3 rounded-xl border border-[rgba(255,255,255,0.3)] bg-gradient-to-r ${promoMessages[promoIndex].gradient} px-4 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(15,23,42,0.25)]`}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <circle cx="10" cy="10" r="9" stroke="white" strokeOpacity="0.2" strokeWidth="1.5" />
              <path d="M6 10h8M10 6v8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="flex-1">{promoMessage}</span>
            <button
              type="button"
              onClick={() => setShowPromo(false)}
              className="inline-flex h-6 w-6 items-center justify-center rounded-full text-white opacity-80 transition-opacity hover:opacity-100"
              aria-label="Close promotion"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4L4 12M4 4l8 8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {isProfileModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center px-4 pt-24 sm:pt-28" role="dialog" aria-modal="true" aria-label="User profile">
          <div className="absolute inset-0 bg-[rgba(15,23,42,0.55)] backdrop-blur-md" onClick={() => setIsProfileModalOpen(false)} />
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
          <div className="absolute inset-0 bg-[rgba(15,23,42,0.55)] backdrop-blur-md" onClick={() => setIsOrderModalOpen(false)} />
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
          <div className="absolute inset-0 bg-[rgba(15,23,42,0.55)] backdrop-blur-md" onClick={() => setIsRegisterModalOpen(false)} />
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
          <div className="absolute inset-0 bg-[rgba(15,23,42,0.55)] backdrop-blur-md" onClick={() => setIsFutureBookingModalOpen(false)} />
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
          <div className="absolute inset-0 bg-[rgba(15,23,42,0.15)] backdrop-blur-sm" onClick={() => setIsHelperAssistantOpen(false)} />
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



        <section className="flex-1 bg-[radial-gradient(circle_at_top,rgba(250,204,21,0.08),transparent_28%),linear-gradient(180deg,var(--color-bg),#fffaf4)]">
        <div className="px-4 pb-2 pt-6 sm:px-8">
          <div className="relative overflow-hidden rounded-[1.75rem] border border-[var(--color-border)] bg-[linear-gradient(135deg,#fff7ec,var(--color-surface))] shadow-[0_22px_46px_rgba(15,23,42,0.12)]">
            <HeroCarousel images={heroCarouselImages} />

            <div className="border-t border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-4 sm:px-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">Chef Specials</p>
              <h2 className="mt-2 max-w-xl text-xl font-semibold text-[var(--color-text)] sm:text-2xl">Crave-worthy meals served hot and fast</h2>
              <p className="mt-2 max-w-2xl text-sm text-[var(--color-muted)]">Swipe or use the arrows to view our highlighted pizza, burger, and pasta picks in the shadcn carousel.</p>
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
          <Card className="mx-auto w-full max-w-4xl bg-[linear-gradient(180deg,var(--color-surface),#fff5e8)]">
            <CardHeader>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">FAQs</p>
              <CardTitle className="text-2xl text-[var(--color-primary)]">Frequently Asked Questions</CardTitle>
              <CardDescription>
                Common questions about delivery, orders, payment methods, and customization.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 pb-6 pt-0 sm:px-8">
              <Accordion type="single" collapsible defaultValue={faqs[0].value}>
                {faqs.map((faq) => (
                  <AccordionItem key={faq.value} value={faq.value}>
                    <AccordionTrigger>{faq.question}</AccordionTrigger>
                    <AccordionContent>{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>
        </section>

        <footer className="footer footer-horizontal footer-center mt-auto border-t border-[var(--color-primary-hover)] bg-[var(--color-primary)] p-10 text-white">
        <aside>
          <svg
            width="50"
            height="50"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            fillRule="evenodd"
            clipRule="evenodd"
            className="inline-block fill-[var(--color-accent)]"
          >
            <path d="M22.672 15.226l-2.432.811.841 2.515c.33 1.019-.209 2.127-1.23 2.456-1.15.325-2.148-.321-2.463-1.226l-.84-2.518-5.013 1.677.84 2.517c.391 1.203-.434 2.542-1.831 2.542-.88 0-1.601-.564-1.86-1.314l-.842-2.516-2.431.809c-1.135.328-2.145-.317-2.463-1.229-.329-1.018.211-2.127 1.231-2.456l2.432-.809-1.621-4.823-2.432.808c-1.355.384-2.558-.59-2.558-1.839 0-.817.509-1.582 1.327-1.846l2.433-.809-.842-2.515c-.33-1.02.211-2.129 1.232-2.458 1.02-.329 2.13.209 2.461 1.229l.842 2.515 5.011-1.677-.839-2.517c-.403-1.238.484-2.553 1.843-2.553.819 0 1.585.509 1.85 1.326l.841 2.517 2.431-.81c1.02-.33 2.131.211 2.461 1.229.332 1.018-.21 2.126-1.23 2.456l-2.433.809 1.622 4.823 2.433-.809c1.242-.401 2.557.484 2.557 1.838 0 .819-.51 1.583-1.328 1.847m-8.992-6.428l-5.01 1.675 1.619 4.828 5.011-1.674-1.62-4.829z" />
          </svg>
          <p className="font-bold text-white">
            Grab &amp; Go
            <br />
            Serving hot, reliable bites across the city
          </p>
          <p className="text-white/75">Copyright {new Date().getFullYear()} - All rights reserved</p>
        </aside>
        <nav aria-label="Social media links">
          <div className="grid grid-flow-col gap-4">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="text-white transition-colors hover:text-[var(--color-accent)]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
              </svg>
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="text-white transition-colors hover:text-[var(--color-support)]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current">
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
              </svg>
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="text-white transition-colors hover:text-[var(--color-secondary)]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current">
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
              </svg>
            </a>
          </div>
        </nav>
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

      <div className="drawer-side border-r border-[var(--color-border)]">
        <label htmlFor="drawer-menu" aria-label="close sidebar" className="drawer-overlay"></label>
        <div className="flex min-h-full flex-col items-start bg-[linear-gradient(180deg,var(--color-surface),#fff4e6)]">
          <ul className="menu w-full grow p-4">
            {['Pizza', 'Burger', 'Pasta', 'Deals'].map((item) => (
              <li key={item}>
                <button className="text-sm font-medium text-[var(--color-text)] hover:bg-[rgba(249,115,22,0.08)]">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor" className="h-5 w-5">
                    <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path>
                    <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  </svg>
                  <span>{item}</span>
                </button>
              </li>
            ))}
            <li>
              <Link href="/cart" className="text-sm font-medium text-[var(--color-text)] hover:bg-[rgba(249,115,22,0.08)]">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor" className="h-5 w-5">
                  <path d="M6 9L6 17a2 2 0 002 2h8a2 2 0 002-2L18 9M9 5a3 3 0 016 0M9 9h6"></path>
                </svg>
                <span>Cart</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
