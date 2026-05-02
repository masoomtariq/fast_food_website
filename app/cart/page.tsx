import Link from "next/link";

const cartItems = [
  { name: "Pizza Margherita", quantity: 2, price: "$18.00", status: "Ready" },
  { name: "Cheese Burger", quantity: 1, price: "$9.50", status: "Cooking" },
  { name: "Spaghetti Alfredo", quantity: 3, price: "$24.00", status: "Queued" },
  { name: "Deal Combo", quantity: 1, price: "$12.00", status: "Packed" },
  { name: "Garlic Bread", quantity: 2, price: "$6.50", status: "Ready" },
] as const;

export default function CartPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(250,204,21,0.08),transparent_28%),linear-gradient(180deg,var(--color-bg),#fffaf4)] px-4 py-8 text-[var(--color-text)] sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl pt-16">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">Cart</p>
            <h1 className="mt-2 text-3xl font-semibold text-[var(--color-primary)]">Your Cart Items</h1>
            <p className="mt-2 max-w-2xl text-sm text-[var(--color-muted)]">
              Review the mocked cart contents below. This page is ready to be connected to real cart state later.
            </p>
          </div>

          <Link
            href="/"
            className="inline-flex w-fit items-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-sm font-medium text-[var(--color-text)] transition-colors hover:border-[var(--color-primary)] hover:bg-[rgba(249,115,22,0.08)]"
          >
            Back to menu
          </Link>
        </div>

        <section className="mt-8 overflow-hidden rounded-[1.5rem] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[var(--color-border)]">
              <thead className="bg-[linear-gradient(135deg,var(--color-primary),var(--color-secondary))] text-white">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-sm font-semibold">Name of Item</th>
                  <th scope="col" className="px-6 py-4 text-left text-sm font-semibold">Quantity of item</th>
                  <th scope="col" className="px-6 py-4 text-left text-sm font-semibold">Price of item</th>
                  <th scope="col" className="px-6 py-4 text-left text-sm font-semibold">Status of the item</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {cartItems.map((item) => (
                  <tr key={item.name} className="hover:bg-[rgba(249,115,22,0.05)]">
                    <td className="px-6 py-4 text-sm font-medium text-[var(--color-text)]">{item.name}</td>
                    <td className="px-6 py-4 text-sm text-[var(--color-muted)]">{item.quantity}</td>
                    <td className="px-6 py-4 text-sm text-[var(--color-muted)]">{item.price}</td>
                    <td className="px-6 py-4 text-sm text-[var(--color-muted)]">{item.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}