"use client";

import { useEffect, useState } from "react";

const expenseOptions = [
  "Food",
  "Transport",
  "Data",
  "Bills",
  "Family / Support",
  "School",
  "Health",
  "Entertainment",
];

type FoodPattern = "groceries" | "prepared" | "both" | "";

export default function Home() {
  const [step, setStep] = useState(0);

  const [money, setMoney] = useState("");
  const [nextIncome, setNextIncome] = useState("");

  const [expenses, setExpenses] = useState<string[]>([]);

  // Food
  const [foodPattern, setFoodPattern] = useState<FoodPattern>("");
  const [foodAmount, setFoodAmount] = useState("");

  // Transport
  const [transportTrips, setTransportTrips] = useState("");
  const [transportCost, setTransportCost] = useState("");

  // Data
  const [dataPurchaseAmount, setDataPurchaseAmount] = useState("");
  const [dataPurchases, setDataPurchases] = useState("");
  const [buffer, setBuffer] = useState("");
  const [transactions, setTransactions] = useState<
  { id: number; category: string; amount: number }[]
>([]);
const [editingTransactionId, setEditingTransactionId] = useState<number | null>(null);
const [spendingCategory, setSpendingCategory] = useState("Food");
const [spendingAmount, setSpendingAmount] = useState("");
  // Other expenses
  const [otherAmounts, setOtherAmounts] = useState<Record<string, string>>(
    {}
  );
const [hasLoaded, setHasLoaded] = useState(false);
  function toggleExpense(expense: string) {
    setExpenses((current) =>
      current.includes(expense)
        ? current.filter((item) => item !== expense)
        : [...current, expense]
    );
  }

  function updateOtherAmount(expense: string, amount: string) {
    setOtherAmounts((current) => ({
      ...current,
      [expense]: amount,
    }));
  }

useEffect(() => {
  try {
    const savedData = localStorage.getItem("spending-coach-data");

    if (savedData) {
      const data = JSON.parse(savedData);

      if (data && typeof data === "object") {
        if (typeof data.step === "number" && data.step >= 0 && data.step <= 3) {
          setStep(data.step);
        }

        if (typeof data.money === "string") setMoney(data.money);
        if (typeof data.nextIncome === "string") setNextIncome(data.nextIncome);

        if (
          Array.isArray(data.expenses) &&
          data.expenses.every((item: unknown) => typeof item === "string")
        ) {
          setExpenses(data.expenses);
        }

        if (
          ["groceries", "prepared", "both", ""].includes(data.foodPattern)
        ) {
          setFoodPattern(data.foodPattern);
        }

        if (typeof data.foodAmount === "string") setFoodAmount(data.foodAmount);
        if (typeof data.transportTrips === "string") setTransportTrips(data.transportTrips);
        if (typeof data.transportCost === "string") setTransportCost(data.transportCost);
        if (typeof data.dataPurchaseAmount === "string") setDataPurchaseAmount(data.dataPurchaseAmount);
        if (typeof data.dataPurchases === "string") setDataPurchases(data.dataPurchases);
        if (typeof data.buffer === "string") setBuffer(data.buffer);

        if (
          Array.isArray(data.transactions) &&
          data.transactions.every(
            (item: unknown) =>
              typeof item === "object" &&
              item !== null &&
              "id" in item &&
              typeof item.id === "number" &&
              "category" in item &&
              typeof item.category === "string" &&
              "amount" in item &&
              typeof item.amount === "number"
          )
        ) {
          setTransactions(data.transactions);
        }

        if (
          data.otherAmounts &&
          typeof data.otherAmounts === "object" &&
          !Array.isArray(data.otherAmounts)
        ) {
          setOtherAmounts(data.otherAmounts);
        }

        if (typeof data.spendingCategory === "string") {
          setSpendingCategory(data.spendingCategory);
        }
      }
    }
  } catch (error) {
    console.error("Could not load saved Spending Coach data:", error);
  } finally {
    setHasLoaded(true);
  }
}, []);

useEffect(() => {
  if (!hasLoaded) return;

  const dataToSave = {
    step,
    money,
    nextIncome,
    expenses,
    foodPattern,
    foodAmount,
    transportTrips,
    transportCost,
    dataPurchaseAmount,
    dataPurchases,
    buffer,
    transactions,
    otherAmounts,
    spendingCategory,
  };

  try {
    localStorage.setItem(
      "spending-coach-data",
      JSON.stringify(dataToSave)
    );
  } catch (error) {
    console.error("Could not save Spending Coach data:", error);
  }
}, [
  hasLoaded,
  step,
  money,
  nextIncome,
  expenses,
  foodPattern,
  foodAmount,
  transportTrips,
  transportCost,
  dataPurchaseAmount,
  dataPurchases,
  buffer,
  transactions,
  otherAmounts,
  spendingCategory,
]);
  function calculatePlan() {
    let total = 0;

    // Food
    if (expenses.includes("Food")) {
      total += Number(foodAmount) || 0;
    }

    // Transport
    if (expenses.includes("Transport")) {
      total +=
        (Number(transportTrips) || 0) * (Number(transportCost) || 0);
    }

    // Data
    if (expenses.includes("Data")) {
      total +=
        (Number(dataPurchaseAmount) || 0) * (Number(dataPurchases) || 0);
    }

    // Other expenses
    expenses
      .filter(
        (expense) =>
          expense !== "Food" &&
          expense !== "Transport" &&
          expense !== "Data"
      )
      .forEach((expense) => {
        total += Number(otherAmounts[expense]) || 0;
      });

    return total;
  }

  function canBuildPlan() {
    if (expenses.includes("Food") && !foodAmount) {
      return false;
    }

    if (
      expenses.includes("Transport") &&
      (!transportTrips || !transportCost)
    ) {
      return false;
    }

    if (
      expenses.includes("Data") &&
      (!dataPurchaseAmount || !dataPurchases)
    ) {
      return false;
    }

    const otherExpenses = expenses.filter(
      (expense) =>
        expense !== "Food" &&
        expense !== "Transport" &&
        expense !== "Data"
    );

    for (const expense of otherExpenses) {
      if (!otherAmounts[expense]) {
        return false;
      }
    }

    return true;
  }

  const plannedTotal = calculatePlan();
  function getPlannedAmount(category: string) {
  if (category === "Food") {
    return Number(foodAmount) || 0;
  }

  if (category === "Transport") {
    return (
      (Number(transportTrips) || 0) *
      (Number(transportCost) || 0)
    );
  }

  if (category === "Data") {
    return (
      (Number(dataPurchaseAmount) || 0) *
      (Number(dataPurchases) || 0)
    );
  }

  return Number(otherAmounts[category]) || 0;
}
  const moneyAvailable = Number(money) || 0;

const totalSpent = transactions.reduce(
  (total, transaction) => total + transaction.amount,
  0
);

const spentByCategory = transactions.reduce(
  (totals, transaction) => {
    totals[transaction.category] =
      (totals[transaction.category] || 0) +
      transaction.amount;

    return totals;
  },
  {} as Record<string, number>
);

const remainingPlannedTotal = expenses.reduce(
  (total, expense) => {
    const planned = getPlannedAmount(expense);
    const spent = spentByCategory[expense] || 0;

    return total + Math.max(0, planned - spent);
  },
  0
);
const categorySummaries = expenses.map((expense) => {
  const planned = getPlannedAmount(expense);
  const paid = spentByCategory[expense] || 0;
  const remaining = Math.max(0, planned - paid);

  return {
    category: expense,
    planned,
    paid,
    remaining,
    status: remaining === 0 ? "Complete" : "Active",
  };
});
const currentCash = moneyAvailable - totalSpent;
const protectedBuffer = Number(buffer) || 0;
function recordSpending() {
  const amount = Number(spendingAmount);

  if (!amount || amount <= 0) {
    return;
  }

  if (editingTransactionId !== null) {
    setTransactions((current) =>
      current.map((transaction) =>
        transaction.id === editingTransactionId
          ? {
              ...transaction,
              category: spendingCategory,
              amount,
            }
          : transaction
      )
    );

    setEditingTransactionId(null);
  } else {
    setTransactions((current) => [
      ...current,
      {
        id: Date.now(),
        category: spendingCategory,
        amount,
      },
    ]);
  }

  setSpendingAmount("");
}
const safeToSpend =
  currentCash - remainingPlannedTotal - protectedBuffer;

const shortfall = Math.max(0, -safeToSpend);
// STEP 0
  if (step === 0) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-12 text-slate-900">
        <div className="mx-auto max-w-2xl">
          <div className="flex min-h-[80vh] flex-col justify-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-emerald-600">
              Spending Coach
            </p>

            <h1 className="text-4xl font-bold tracking-tight">
              Let&apos;s plan your money.
            </h1>

            <p className="mt-4 text-lg text-slate-600">
              Tell us how much money you have and how long it needs to last.
            </p>

            <div className="mt-10 space-y-8">
              <div>
                <label
                  htmlFor="money"
                  className="mb-2 block text-sm font-semibold"
                >
                  How much money do you have available right now?
                </label>

                <div className="flex items-center rounded-xl border border-slate-300 bg-white px-4 focus-within:border-slate-900">
                  <span className="text-lg font-semibold text-slate-500">
                    ₦
                  </span>

                  <input
                    id="money"
                    type="number"
                    min="0"
                    value={money}
                    onChange={(event) => setMoney(event.target.value)}
                    placeholder="32,000"
                    className="w-full bg-transparent px-3 py-4 text-lg outline-none"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="nextIncome"
                  className="mb-2 block text-sm font-semibold"
                >
                  When is your next income?
                </label>

                <input
                  id="nextIncome"
                  type="date"
                  value={nextIncome}
                  onChange={(event) => setNextIncome(event.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-4 text-lg outline-none focus:border-slate-900"
                />
              </div>

              <button
                onClick={() => setStep(1)}
                disabled={!money || !nextIncome}
                className="w-full rounded-xl bg-slate-900 px-6 py-4 font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // STEP 1
  if (step === 1) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-12 text-slate-900">
        <div className="mx-auto max-w-2xl">
          <div className="flex min-h-[80vh] flex-col justify-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-emerald-600">
              Step 2 of 4
            </p>

            <h1 className="text-4xl font-bold tracking-tight">
              What do you normally spend money on?
            </h1>

            <p className="mt-4 text-lg text-slate-600">
              Select everything that applies.
            </p>

            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {expenseOptions.map((expense) => {
                const selected = expenses.includes(expense);

                return (
                  <button
                    key={expense}
                    onClick={() => toggleExpense(expense)}
                    className={`rounded-xl border px-5 py-4 text-left font-medium transition ${
                      selected
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-300 bg-white text-slate-900 hover:border-slate-500"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{expense}</span>

                      {selected && <span>✓</span>}
                    </div>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={expenses.length === 0}
              className="mt-8 w-full rounded-xl bg-slate-900 px-6 py-4 font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Continue
            </button>

            <button
              onClick={() => setStep(0)}
              className="mt-3 w-full rounded-xl px-6 py-3 font-medium text-slate-600 hover:text-slate-900"
            >
              Back
            </button>
          </div>
        </div>
      </main>
    );
  }

  // STEP 2
  if (step === 2) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-12 text-slate-900">
        <div className="mx-auto max-w-2xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-emerald-600">
            Step 3 of 4
          </p>

          <h1 className="text-4xl font-bold tracking-tight">
            Tell us how your spending normally happens.
          </h1>

          <p className="mt-4 text-lg text-slate-600">
            We&apos;ll use your real spending patterns instead of forcing
            everything into a daily budget.
          </p>

          <div className="mt-10 space-y-8">
            {/* FOOD */}
            {expenses.includes("Food") && (
              <section className="rounded-2xl border border-slate-200 bg-white p-6">
                <h2 className="text-xl font-bold">Food</h2>

                <p className="mt-1 text-sm text-slate-500">
                  How do you normally buy food?
                </p>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {[
                    ["groceries", "Groceries / raw food"],
                    ["prepared", "Prepared food"],
                    ["both", "Both"],
                  ].map(([value, label]) => (
                    <button
                      key={value}
                      onClick={() =>
                        setFoodPattern(value as FoodPattern)
                      }
                      className={`rounded-xl border px-4 py-3 text-left ${
                        foodPattern === value
                          ? "border-slate-900 bg-slate-900 text-white"
                          : "border-slate-300 bg-white"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                {foodPattern && (
                  <div className="mt-5">
                    <label
                      htmlFor="foodAmount"
                      className="mb-2 block text-sm font-semibold"
                    >
                      How much do you expect to spend on food during this
                      plan?
                    </label>

                    <div className="flex items-center rounded-xl border border-slate-300 px-4">
                      <span className="text-slate-500">₦</span>

                      <input
                        id="foodAmount"
                        type="number"
                        min="0"
                        value={foodAmount}
                        onChange={(event) =>
                          setFoodAmount(event.target.value)
                        }
                        placeholder="22,000"
                        className="w-full px-3 py-4 outline-none"
                      />
                    </div>

                    <p className="mt-2 text-sm text-slate-500">
                      This is the total food amount for this planning period,
                      not a daily limit.
                    </p>
                  </div>
                )}
              </section>
            )}

            {/* TRANSPORT */}
            {expenses.includes("Transport") && (
              <section className="rounded-2xl border border-slate-200 bg-white p-6">
                <h2 className="text-xl font-bold">Transport</h2>

                <p className="mt-1 text-sm text-slate-500">
                  Let&apos;s estimate your actual outings.
                </p>

                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="transportTrips"
                      className="mb-2 block text-sm font-semibold"
                    >
                      Expected outings
                    </label>

                    <input
                      id="transportTrips"
                      type="number"
                      min="0"
                      value={transportTrips}
                      onChange={(event) =>
                        setTransportTrips(event.target.value)
                      }
                      placeholder="3"
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-4 outline-none"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="transportCost"
                      className="mb-2 block text-sm font-semibold"
                    >
                      Typical cost per outing
                    </label>

                    <div className="flex items-center rounded-xl border border-slate-300 px-4">
                      <span className="text-slate-500">₦</span>

                      <input
                        id="transportCost"
                        type="number"
                        min="0"
                        value={transportCost}
                        onChange={(event) =>
                          setTransportCost(event.target.value)
                        }
                        placeholder="1,833"
                        className="w-full px-3 py-4 outline-none"
                      />
                    </div>
                  </div>
                </div>

                {transportTrips && transportCost && (
                  <p className="mt-4 text-sm font-medium text-slate-600">
                    Estimated transport: ₦
                    {(
                      Number(transportTrips) * Number(transportCost)
                    ).toLocaleString()}
                  </p>
                )}
              </section>
            )}

            {/* DATA */}
            {expenses.includes("Data") && (
              <section className="rounded-2xl border border-slate-200 bg-white p-6">
                <h2 className="text-xl font-bold">Data</h2>

                <p className="mt-1 text-sm text-slate-500">
                  Think about your normal purchase pattern.
                </p>

                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="dataPurchaseAmount"
                      className="mb-2 block text-sm font-semibold"
                    >
                      Cost per purchase
                    </label>

                    <div className="flex items-center rounded-xl border border-slate-300 px-4">
                      <span className="text-slate-500">₦</span>

                      <input
                        id="dataPurchaseAmount"
                        type="number"
                        min="0"
                        value={dataPurchaseAmount}
                        onChange={(event) =>
                          setDataPurchaseAmount(event.target.value)
                        }
                        placeholder="1,500"
                        className="w-full px-3 py-4 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="dataPurchases"
                      className="mb-2 block text-sm font-semibold"
                    >
                      Expected purchases during this plan
                    </label>

                    <input
                      id="dataPurchases"
                      type="number"
                      min="0"
                      value={dataPurchases}
                      onChange={(event) =>
                        setDataPurchases(event.target.value)
                      }
                      placeholder="3"
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-4 outline-none"
                    />
                  </div>
                </div>

                {dataPurchaseAmount && dataPurchases && (
                  <p className="mt-4 text-sm font-medium text-slate-600">
                    Estimated data cost: ₦
                    {(
                      Number(dataPurchaseAmount) * Number(dataPurchases)
                    ).toLocaleString()}
                  </p>
                )}
              </section>
            )}

            {/* OTHER EXPENSES */}
            {expenses
              .filter(
                (expense) =>
                  expense !== "Food" &&
                  expense !== "Transport" &&
                  expense !== "Data"
              )
              .map((expense) => (
                <section
                  key={expense}
                  className="rounded-2xl border border-slate-200 bg-white p-6"
                >
                  <h2 className="text-xl font-bold">{expense}</h2>

                  <label className="mt-4 mb-2 block text-sm font-semibold">
                    How much do you expect to spend on {expense.toLowerCase()}{" "}
                    during this plan?
                  </label>

                  <div className="flex items-center rounded-xl border border-slate-300 px-4">
                    <span className="text-slate-500">₦</span>

                    <input
                      type="number"
                      min="0"
                      value={otherAmounts[expense] || ""}
                      onChange={(event) =>
                        updateOtherAmount(expense, event.target.value)
                      }
                      placeholder="0"
                      className="w-full px-3 py-4 outline-none"
                    />
                  </div>
                </section>
              ))}
<section className="rounded-2xl border border-slate-200 bg-white p-6">
  <h2 className="text-xl font-bold">Protected buffer</h2>

  <p className="mt-1 text-sm text-slate-500">
    How much money would you like to keep aside for unexpected expenses?
  </p>

  <div className="mt-5 flex items-center rounded-xl border border-slate-300 px-4">
    <span className="text-slate-500">₦</span>

    <input
      type="number"
      min="0"
      value={buffer}
      onChange={(event) => setBuffer(event.target.value)}
      placeholder="1,000"
      className="w-full px-3 py-4 outline-none"
    />
  </div>

  <p className="mt-2 text-sm text-slate-500">
    You can enter ₦0 if you don't want a protected buffer.
  </p>
</section>
            <button
              onClick={() => setStep(3)}
              disabled={!canBuildPlan()}
              className="w-full rounded-xl bg-slate-900 px-6 py-4 font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Build My Plan
            </button>

            <button
              onClick={() => setStep(1)}
              className="w-full rounded-xl px-6 py-3 font-medium text-slate-600 hover:text-slate-900"
            >
              Back
            </button>
          </div>
        </div>
      </main>
    );
  }

  // STEP 3 — PLAN RESULT
return (
  <main className="min-h-screen bg-slate-50 px-6 py-12 text-slate-900">
    <div className="mx-auto max-w-2xl">
      <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-emerald-600">
        Your first plan
      </p>

      <h1 className="text-4xl font-bold tracking-tight">
        Here&apos;s what you can safely spend.
      </h1>

      <p className="mt-4 text-lg text-slate-600">
        This amount is available without putting your known upcoming
        spending or protected buffer at risk.
      </p>

      {/* SAFE TO SPEND */}
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
  <div className="rounded-2xl border border-slate-200 bg-white p-5">
    <p className="text-sm text-slate-500">
      Money currently held
    </p>

    <p className="mt-2 text-2xl font-bold">
      ₦{currentCash.toLocaleString()}
    </p>
  </div>

  <div className="rounded-2xl border border-slate-200 bg-white p-5">
    <p className="text-sm text-slate-500">
      Total recorded spending
    </p>

    <p className="mt-2 text-2xl font-bold">
      ₦{totalSpent.toLocaleString()}
    </p>
  </div>
</div>
      <div className="mt-8 rounded-3xl bg-slate-900 p-8 text-white">
        <p className="text-sm font-medium text-slate-300">
          Safe to Spend
        </p>

        <p className="mt-2 text-5xl font-bold">
          ₦{Math.max(0, safeToSpend).toLocaleString()}
        </p>

        <p className="mt-3 text-sm text-slate-300">
          Based on your current plan
        </p>
      </div>

      {/* PLAN BREAKDOWN */}
      {/* RECORD SPENDING */}
    {transactions.length > 0 && (
  <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-6">
    <h2 className="text-xl font-bold">
      Recent spending
    </h2>

    <div className="mt-5 space-y-3">
  {transactions.map((transaction) => (
    <div
      key={transaction.id}
      className="border-b border-slate-100 pb-4 last:border-0"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium">
            {transaction.category}
          </p>

          <p className="text-sm text-slate-500">
            Recorded spending
          </p>
        </div>

        <p className="font-semibold">
          ₦{transaction.amount.toLocaleString()}
        </p>
      </div>

      <div className="mt-2 flex gap-4">
        <button
          onClick={() => {
            setSpendingAmount(transaction.amount.toString());
            setSpendingCategory(transaction.category);
            setEditingTransactionId(transaction.id);
          }}
          className="text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          Edit
        </button>

        <button
          onClick={() => {
            setTransactions((current) =>
              current.filter((item) => item.id !== transaction.id)
            );
          }}
          className="text-sm font-medium text-red-600 hover:text-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  ))}
</div>
  </div>
)} 
<div className="mt-4 rounded-2xl border border-slate-200 bg-white p-6"></div> 
<div className="mt-4 rounded-2xl border border-slate-200 bg-white p-6">
  <h2 className="text-xl font-bold">
    Record spending
  </h2>

  <p className="mt-1 text-sm text-slate-500">
    Record what you actually spend so your plan can stay up to date.
  </p>

  <div className="mt-5">
    <label className="text-sm font-medium text-slate-700">
      Category
    </label>

    <select
      value={spendingCategory}
      onChange={(event) =>
        setSpendingCategory(event.target.value)
      }
      className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none"
    >
      {expenses.map((expense) => (
        <option key={expense} value={expense}>
          {expense}
        </option>
      ))}
    </select>
  </div>

  <div className="mt-4">
    <label className="text-sm font-medium text-slate-700">
      Amount spent
    </label>

    <div className="mt-2 flex items-center rounded-xl border border-slate-300 px-4">
      <span className="text-slate-500">₦</span>

      <input
        type="number"
        min="0"
        value={spendingAmount}
        onChange={(event) =>
          setSpendingAmount(event.target.value)
        }
        placeholder="0"
        className="w-full px-3 py-3 outline-none"
      />
    </div>
  </div>

  <button
  onClick={recordSpending}
  className="mt-5 w-full rounded-xl bg-slate-900 px-6 py-4 text-left font-semibold text-white shadow-md transition hover:bg-slate-800 hover:shadow-lg active:scale-[0.99]"
>
  {editingTransactionId !== null ? (
  <>
    <span className="block text-lg">✏️ Update Spending</span>
    <span className="mt-1 block text-sm font-normal text-slate-300">
      Save your changes to this transaction
    </span>
  </>
) : (
  <>
    <span className="block text-lg">💰 Record Spending</span>
    <span className="mt-1 block text-sm font-normal text-slate-300">
      Tap here after you spend money
    </span>
  </>
)}
</button>
{editingTransactionId !== null && (
  <button
    onClick={() => {
      setEditingTransactionId(null);
      setSpendingAmount("");
    }}
    className="mt-3 w-full rounded-xl border border-slate-300 bg-white px-6 py-3 font-medium text-slate-700 hover:bg-slate-50"
  >
    Cancel Edit
  </button>
)}
    <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-6">
  <h2 className="text-xl font-bold">
    Plan progress
  </h2>

  <p className="mt-1 text-sm text-slate-500">
    See what you planned, what you've paid, and what remains.
  </p>

  <div className="mt-5 space-y-4">
    {categorySummaries.map((item) => (
      <div
        key={item.category}
        className="rounded-xl border border-slate-100 p-4"
      >
        <div className="flex items-center justify-between">
          <p className="font-semibold text-slate-900">
  {item.category}
</p>

          <span className="text-sm font-medium text-slate-500">
            {item.status}
          </span>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-3 text-sm">
          <div>
            <p className="text-slate-500">
              Planned
            </p>

            <p className="mt-1 font-semibold text-slate-900">
  ₦{item.planned.toLocaleString()}
</p>
          </div>

          <div>
            <p className="text-slate-500">
              Paid
            </p>

            <p className="mt-1 font-semibold text-slate-900">
  ₦{item.paid.toLocaleString()}
</p>
          </div>

          <div>
            <p className="text-slate-500">
              Remaining
            </p>

            <p className="mt-1 font-semibold text-slate-900">
  ₦{item.remaining.toLocaleString()}
</p>
          </div>
        </div>
      </div>
    ))}
      </div>
</div>
</div>

      <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="font-bold">Your plan</h2>

        <div className="mt-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-slate-600">
              Money available
            </span>

            <span className="font-semibold">
              ₦{moneyAvailable.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-600">
              Planned spending
            </span>

            <span className="font-semibold">
              ₦{plannedTotal.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-600">
              Protected buffer
            </span>

            <span className="font-semibold">
              ₦{protectedBuffer.toLocaleString()}
            </span>
          </div>

          <div className="border-t border-slate-100 pt-4">
            <div className="flex items-center justify-between">
              <span className="font-bold">
                Safe to Spend
              </span>

              <span className="font-bold">
                ₦{Math.max(0, safeToSpend).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SHORTFALL */}
      {shortfall > 0 && (
        <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-6">
          <p className="font-semibold text-red-800">
            Your current plan is short by ₦
            {shortfall.toLocaleString()}.
          </p>

          <p className="mt-2 text-sm text-red-700">
            Your planned spending and protected buffer are higher than
            the money you currently have available.
          </p>
        </div>
      )}

      {/* NO SAFE SPENDING */}
      {safeToSpend === 0 && shortfall === 0 && (
        <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <p className="font-semibold text-amber-800">
            You currently have nothing extra marked as safe to spend.
          </p>

          <p className="mt-2 text-sm text-amber-700">
            Your available money is already assigned to your plan or
            protected as your buffer.
          </p>
        </div>
      )}

      {/* SAFE SPENDING AVAILABLE */}
      {safeToSpend > 0 && (
        <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
          <p className="font-semibold text-emerald-800">
            You have ₦{safeToSpend.toLocaleString()} available
            for flexible spending.
          </p>

          <p className="mt-2 text-sm text-emerald-700">
            Spending more than this could require you to adjust your
            current plan.
          </p>
        </div>
      )}

      <button
        onClick={() => setStep(2)}
        className="mt-8 w-full rounded-xl border border-slate-300 bg-white px-6 py-4 font-semibold hover:bg-slate-100"
      >
        Adjust My Plan
      </button>
    </div>
    </main>
);
}