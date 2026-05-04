"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

const tabs = ["Pending", "Baking", "In-delievery", "Delievered"] as const;

const orders = [
  { id: "#ORD-1001", customer: "Ayesha Khan", items: "2 Pizzas, 1 Drink", total: "$28.00", time: "10:15 AM", status: "Pending" },
  { id: "#ORD-1002", customer: "Usman Ali", items: "1 Burger, 1 Fries", total: "$14.50", time: "10:28 AM", status: "Pending" },
  { id: "#ORD-1003", customer: "Sana Ahmed", items: "1 Pasta, 2 Drinks", total: "$22.00", time: "10:35 AM", status: "Pending" },
  { id: "#ORD-2001", customer: "Bilal Hussain", items: "3 Pizzas, 2 Sauces", total: "$39.00", time: "11:05 AM", status: "Baking" },
  { id: "#ORD-2002", customer: "Hira Noor", items: "2 Burgers, 1 Salad", total: "$21.00", time: "11:18 AM", status: "Baking" },
  { id: "#ORD-3001", customer: "Rayan Qureshi", items: "1 Combo Meal", total: "$12.50", time: "11:42 AM", status: "In-delievery" },
  { id: "#ORD-3002", customer: "Maham Sheikh", items: "1 Pizza, 1 Pasta", total: "$26.75", time: "11:51 AM", status: "In-delievery" },
  { id: "#ORD-4001", customer: "Zainab Tariq", items: "2 Combos, 1 Drink", total: "$31.25", time: "12:12 PM", status: "Delievered" },
  { id: "#ORD-4002", customer: "Ahmed Raza", items: "1 Burger, 1 Pizza", total: "$24.00", time: "12:25 PM", status: "Delievered" },
] as const;

type TabName = (typeof tabs)[number];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<TabName>("Pending");

  const visibleOrders = useMemo(
    () => orders.filter((order) => order.status === activeTab),
    [activeTab],
  );

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(250,204,21,0.12),transparent_28%),linear-gradient(180deg,var(--color-bg),#fffaf4)] px-4 py-8 text-[var(--color-text)] sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl pt-16">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">Admin</p>
            <h1 className="mt-2 text-3xl font-semibold text-[var(--color-primary)]">Order Management</h1>
            <p className="mt-2 max-w-2xl text-sm text-[var(--color-muted)]">
              Review mocked orders by stage and switch between the tabs to inspect each queue.
            </p>
          </div>

          <Link
            href="/"
            className="inline-flex w-fit items-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-sm font-medium text-[var(--color-text)] transition-colors hover:border-[var(--color-primary)] hover:bg-[rgba(249,115,22,0.08)]"
          >
            Back to menu
          </Link>
        </div>

        <section className="mt-8 rounded-[1.75rem] border border-[var(--color-border)] bg-[linear-gradient(180deg,var(--color-surface),#fff7ee)] p-4 shadow-[0_18px_40px_rgba(15,23,42,0.08)] sm:p-6">
          <div className="flex flex-wrap gap-3">
            {tabs.map((tab) => {
              const isActive = tab === activeTab;

              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-[linear-gradient(135deg,var(--color-primary),var(--color-secondary))] text-white shadow-[0_10px_22px_rgba(249,115,22,0.28)]"
                      : "border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] hover:border-[var(--color-primary)] hover:bg-[rgba(249,115,22,0.08)]"
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-[var(--color-border)] bg-[var(--color-surface)]">
            <div className="flex items-center justify-between gap-3 border-b border-[var(--color-border)] px-5 py-4">
              <div>
                <h2 className="text-lg font-semibold text-[var(--color-text)]">{activeTab} Orders</h2>
                <p className="text-sm text-[var(--color-muted)]">{visibleOrders.length} mocked order{visibleOrders.length === 1 ? "" : "s"} in this queue.</p>
              </div>
              <span className="rounded-full bg-[rgba(249,115,22,0.08)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-primary)]">
                Live queue mock
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-[var(--color-border)]">
                <thead className="bg-[linear-gradient(135deg,var(--color-primary),var(--color-secondary))] text-white">
                  <tr>
                    <th scope="col" className="px-5 py-4 text-left text-sm font-semibold">Order ID</th>
                    <th scope="col" className="px-5 py-4 text-left text-sm font-semibold">Customer</th>
                    <th scope="col" className="px-5 py-4 text-left text-sm font-semibold">Items</th>
                    <th scope="col" className="px-5 py-4 text-left text-sm font-semibold">Total</th>
                    <th scope="col" className="px-5 py-4 text-left text-sm font-semibold">Time</th>
                    <th scope="col" className="px-5 py-4 text-left text-sm font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border)]">
                  {visibleOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-[rgba(249,115,22,0.05)]">
                      <td className="px-5 py-4 text-sm font-semibold text-[var(--color-text)]">{order.id}</td>
                      <td className="px-5 py-4 text-sm text-[var(--color-muted)]">{order.customer}</td>
                      <td className="px-5 py-4 text-sm text-[var(--color-muted)]">{order.items}</td>
                      <td className="px-5 py-4 text-sm text-[var(--color-muted)]">{order.total}</td>
                      <td className="px-5 py-4 text-sm text-[var(--color-muted)]">{order.time}</td>
                      <td className="px-5 py-4 text-sm font-medium text-[var(--color-muted)]">{order.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}