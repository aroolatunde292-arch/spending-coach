"use client";



import { useEffect, useRef, useState } from "react";

import type { ReactNode } from "react";



const expenseOptions = [

  "Food",

  "Transport",

  "Data",

  "Bills",

  "Family / Support",

  "School",

  "Health",

  "Entertainment",

  "Others",

];



const motivationalMessages = [

  "One step at a time. You're building a plan that works for you.",

  "Your money, your priorities, your pace.",

  "Small, steady steps can make a difference.",

  "Plans can change. Let's adjust together.",

  "Every naira deserves a plan that fits your life.",

  "You're here to make things easier for yourself. Let's begin.",

  "Progress looks different for everyone. Keep going at your pace.",

];





function RevealOnScroll({

  children,

  className = "",

}: {

  children: ReactNode;

  className?: string;

}) {

  const sectionRef = useRef<HTMLDivElement | null>(null);

  const [isVisible, setIsVisible] = useState(false);



  useEffect(() => {

    const section = sectionRef.current;



    if (!section) return;



    const revealSection = () => {

      const position = section.getBoundingClientRect();



      if (position.top < window.innerHeight * 0.9) {

        setIsVisible(true);

      }

    };



    revealSection();

    window.addEventListener("scroll", revealSection, {

      passive: true,

    });

    window.addEventListener("resize", revealSection);



    return () => {

      window.removeEventListener("scroll", revealSection);

      window.removeEventListener("resize", revealSection);

    };

  }, []);



  return (

    <div

      ref={sectionRef}

      className={`${className} transition-[opacity,transform] duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${

        isVisible

          ? "translate-y-0 opacity-100"

          : "translate-y-10 opacity-0"

      }`}

    >

      {children}

    </div>

  );

}



function PoweredByYesxtra() {

  return (

    <footer className="mx-auto mt-10 w-full max-w-2xl text-center text-xs tracking-wide text-[#718176]">

      Powered by <span className="font-semibold text-[#39745A]">YESXTRA</span>

    </footer>

  );

}



type FoodPattern = "groceries" | "prepared" | "both" | "";



type ArchivedBudget = {

  id: number;

  archivedAt: string;

  deletedAt?: string;

  money: string;

  nextIncome: string;

  expenses: string[];

  customExpenseName?: string;

  foodPattern: FoodPattern;

  foodAmount: string;

  transportTrips: string;

  transportCost: string;

  dataPurchaseAmount: string;

  dataPurchases: string;

  buffer: string;

  transactions: { id: number; category: string; amount: number }[];

  otherAmounts: Record<string, string>;

  spendingCategory: string;

};

export default function Home() {



  const [messageIndex, setMessageIndex] = useState(0);



  useEffect(() => {

    const intervalId = setInterval(() => {

      setMessageIndex((currentIndex) =>

        (currentIndex + 1) % motivationalMessages.length

      );

    }, 6000);



    return () => clearInterval(intervalId);

  }, []);



  const [step, setStep] = useState(0);



  const [money, setMoney] = useState("");

  const [nextIncome, setNextIncome] = useState("");

  const [planStartedAt, setPlanStartedAt] = useState("");



  const [expenses, setExpenses] = useState<string[]>([]);

  const [customExpenseName, setCustomExpenseName] = useState("");



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

const [archivedBudgets, setArchivedBudgets] = useState<ArchivedBudget[]>([]);

const [deletedBudgets, setDeletedBudgets] = useState<ArchivedBudget[]>([]);

const [editingTransactionId, setEditingTransactionId] = useState<number | null>(null);

const [spendingCategory, setSpendingCategory] = useState("Food");

const [spendingAmount, setSpendingAmount] = useState("");

const [showRecordSpending, setShowRecordSpending] = useState(false);

  // Other expenses

  const [otherAmounts, setOtherAmounts] = useState<Record<string, string>>(

    {}

  );

const [hasLoaded, setHasLoaded] = useState(false);

  function toggleExpense(expense: string) {

    if (expense === "Others") {

      const customName = customExpenseName.trim();

      const selected =

        expenses.includes("Others") ||

        Boolean(customName && expenses.includes(customName));



      if (selected) {

        setExpenses((current) =>

          current.filter(

            (item) => item !== "Others" && item !== customName

          )

        );

        setCustomExpenseName("");

        setOtherAmounts((current) => {

          const updated = { ...current };

          delete updated.Others;

          if (customName) delete updated[customName];

          return updated;

        });

        setSpendingCategory((current) =>

          current === customName || current === "Others" ? "Food" : current

        );

      } else {

        setExpenses((current) =>

          current.includes("Others") ? current : [...current, "Others"]

        );

      }

      return;

    }



    setExpenses((current) =>

      current.includes(expense)

        ? current.filter((item) => item !== expense)

        : [...current, expense]

    );

  }



  function handleCustomExpenseNameChange(value: string) {

    const previousName = customExpenseName.trim();

    const nextName = value.trim();

    const sourceName = previousName || "Others";

    const targetName = nextName || "Others";



    setCustomExpenseName(value);



    setExpenses((current) =>

      current.map((item) =>

        item === "Others" || (previousName && item === previousName)

          ? targetName

          : item

      )

    );



    if (sourceName !== targetName) {

      setOtherAmounts((current) => {

        const updated = { ...current };

        if (Object.prototype.hasOwnProperty.call(current, sourceName)) {

          updated[targetName] = current[sourceName];

          delete updated[sourceName];

        }

        return updated;

      });



      setTransactions((current) =>

        current.map((transaction) =>

          transaction.category === sourceName

            ? { ...transaction, category: targetName }

            : transaction

        )

      );



      setSpendingCategory((current) =>

        current === sourceName ? targetName : current

      );

    }

  }



  function updateOtherAmount(expense: string, amount: string) {

    setOtherAmounts((current) => ({

      ...current,

      [expense]: amount,

    }));

  }

function startNewBudget() {

  if (!money.trim() && transactions.length === 0) {

    window.alert("There is no current budget to archive yet.");

    return;

  }



  function deleteArchivedBudget(budgetId: number) {

  const budgetToDelete = archivedBudgets.find(

    (budget) => budget.id === budgetId

  );



  if (!budgetToDelete) return;



  const confirmed = window.confirm(

    "Move this budget to Recently Deleted? You can restore it for 30 days."

  );



  if (!confirmed) return;



  const deletedBudget = {

    ...budgetToDelete,

    deletedAt: new Date().toISOString(),

  };



  setDeletedBudgets((current) => [deletedBudget, ...current]);



  setArchivedBudgets((current) =>

    current.filter((budget) => budget.id !== budgetId)

  );

}



function restoreDeletedBudget(budgetId: number) {

  const budgetToRestore = deletedBudgets.find(

    (budget) => budget.id === budgetId

  );



  if (!budgetToRestore) return;



  const { deletedAt, ...restoredBudget } = budgetToRestore;



  setArchivedBudgets((current) => [

    restoredBudget,

    ...current,

  ]);



  setDeletedBudgets((current) =>

    current.filter((budget) => budget.id !== budgetId)

  );

}



  const confirmed = window.confirm(

    "Start a new budget period? Your current budget and transactions will be archived, and the new budget will start fresh."

  );



  if (!confirmed) return;



  const archivedBudget: ArchivedBudget = {

    id: Date.now(),

    archivedAt: new Date().toISOString(),

    money,

    nextIncome,

    expenses,

    customExpenseName,

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



  setArchivedBudgets((current) => [archivedBudget, ...current]);



  setMoney("");

  setNextIncome("");

  setPlanStartedAt("");

  setExpenses([]);

  setCustomExpenseName("");

  setFoodPattern("");

  setFoodAmount("");

  setTransportTrips("");

  setTransportCost("");

  setDataPurchaseAmount("");

  setDataPurchases("");

  setBuffer("");

  setTransactions([]);

  setOtherAmounts({});

  setSpendingCategory("Food");

  setSpendingAmount("");

  setEditingTransactionId(null);

  setStep(0);

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

        if (typeof data.planStartedAt === "string") setPlanStartedAt(data.planStartedAt);



        if (

          Array.isArray(data.expenses) &&

          data.expenses.every((item: unknown) => typeof item === "string")

        ) {

          setExpenses(data.expenses);

        }



        if (typeof data.customExpenseName === "string") {

          setCustomExpenseName(data.customExpenseName);

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

if (Array.isArray(data.archivedBudgets)) {

  setArchivedBudgets(data.archivedBudgets);

}





if (Array.isArray(data.deletedBudgets)) {

  const thirtyDays = 30 * 24 * 60 * 60 * 1000;



  const recoverableBudgets = data.deletedBudgets.filter(

    (budget: ArchivedBudget) => {

      if (!budget.deletedAt) return false;



      const deletedTime = new Date(budget.deletedAt).getTime();



      return (

        Number.isFinite(deletedTime) &&

        Date.now() - deletedTime < thirtyDays

      );

    }

  );



  setDeletedBudgets(recoverableBudgets);

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

    planStartedAt,

    expenses,

    customExpenseName,

    foodPattern,

    foodAmount,

    transportTrips,

    transportCost,

    dataPurchaseAmount,

    dataPurchases,

    buffer,

    transactions,

    archivedBudgets,

    deletedBudgets,

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

  archivedBudgets,

  deletedBudgets,

  step,

  money,

  nextIncome,

  planStartedAt,

  expenses,

  customExpenseName,

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



function deleteArchivedBudget(budgetId: number) {

  const budgetToDelete = archivedBudgets.find(

    (budget) => budget.id === budgetId

  );



  if (!budgetToDelete) return;



  const confirmed = window.confirm(

    "Move this budget to Recently Deleted? You can restore it within 30 days."

  );



  if (!confirmed) return;



  const deletedBudget = {

    ...budgetToDelete,

    deletedAt: new Date().toISOString(),

  };



  setArchivedBudgets((current) =>

    current.filter((budget) => budget.id !== budgetId)

  );



  setDeletedBudgets((current) => [deletedBudget, ...current]);

}



function restoreDeletedBudget(budgetId: number) {

  const budgetToRestore = deletedBudgets.find(

    (budget) => budget.id === budgetId

  );



  if (!budgetToRestore) return;



  const deletedAt = budgetToRestore.deletedAt

    ? new Date(budgetToRestore.deletedAt).getTime()

    : 0;



  const thirtyDays = 30 * 24 * 60 * 60 * 1000;



  if (Date.now() - deletedAt >= thirtyDays) {

    window.alert("This budget's 30-day recovery period has expired.");

    return;

  }



  const { deletedAt: _deletedAt, ...restoredBudget } = budgetToRestore;



  setDeletedBudgets((current) =>

    current.filter((budget) => budget.id !== budgetId)

  );



  setArchivedBudgets((current) => [restoredBudget, ...current]);

}

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

    if (expenses.includes("Others")) {

      return false;

    }



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



const runwayStart = planStartedAt ? new Date(planStartedAt) : null;



const runwayTargetParts = nextIncome.split("-").map(Number);

const runwayTarget =

  nextIncome && runwayTargetParts.length === 3

    ? new Date(

        runwayTargetParts[0],

        runwayTargetParts[1] - 1,

        runwayTargetParts[2]

      )

    : null;



const runwayNow = new Date();

const runwayToday = new Date(

  runwayNow.getFullYear(),

  runwayNow.getMonth(),

  runwayNow.getDate()

);



const runwayStartDate = runwayStart

  ? new Date(

      runwayStart.getFullYear(),

      runwayStart.getMonth(),

      runwayStart.getDate()

    )

  : null;



const runwayTotalDays =

  runwayStartDate && runwayTarget

    ? Math.max(

        1,

        Math.round(

          (runwayTarget.getTime() - runwayStartDate.getTime()) /

            86400000

        )

      )

    : 1;



const runwayDaysRemaining = runwayTarget

  ? Math.max(

      0,

      Math.ceil(

        (runwayTarget.getTime() - runwayToday.getTime()) / 86400000

      )

    )

  : 0;



const runwayDaysElapsed = runwayStartDate

  ? Math.max(

      0,

      Math.floor(

        (runwayToday.getTime() - runwayStartDate.getTime()) / 86400000

      )

    )

  : 0;



const runwayProgress =

  runwayStartDate && runwayTarget

    ? Math.min(

        100,

        Math.max(0, (runwayDaysElapsed / runwayTotalDays) * 100)

      )

    : 0;



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

      <main className="min-h-screen bg-[#F7F6F0] px-5 py-10 text-[#252D28] sm:px-8 sm:py-14">

        <div className="mx-auto max-w-2xl">

{planStartedAt && (

  <div className="mb-6 flex justify-end">

    <button

      onClick={() => setStep(3)}

      className="button-primary rounded-xl px-4 py-2 text-sm font-semibold"

    >

      My Plan

    </button>

  </div>

)}

<div className="mb-10">

  <div className="mb-3 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#66736A]">

    <span>Your plan</span>

    <span>Step 1 of 4</span>

  </div>



  <div

    className="h-1.5 w-full overflow-hidden rounded-full bg-[#E3E9E2]"

    role="progressbar"

    aria-label="Budget setup progress"

    aria-valuemin={0}

    aria-valuemax={4}

    aria-valuenow={1}

  >

    <div className="h-full w-1/4 rounded-full bg-[#173F32] transition-all duration-300" />

  </div>

</div>



          <div className="flex min-h-[80vh] flex-col justify-center">



<p className="mb-4 animate-[fadeInUp_700ms_ease-out_both] text-xs font-bold uppercase tracking-[0.22em] text-[#39745A] motion-reduce:animate-none">

  SPENDING COACH

</p>





            <h1 className="max-w-xl text-4xl font-bold leading-tight tracking-tight text-[#173F32] sm:text-5xl">

  Let&apos;s make your money last.

</h1>



            <p className="mt-4 max-w-lg text-base leading-7 text-[#66736A] sm:text-lg">

  Build a realistic spending plan, protect what matters, and know what you can safely spend.

</p>



<div

  key={messageIndex}

  className="mt-5 min-h-12 max-w-lg animate-[fadeInUp_500ms_ease-out_both] motion-reduce:animate-none"

  aria-live="polite"

>

  <p className="text-sm font-medium italic leading-6 text-[#39745A] sm:text-base">

    {motivationalMessages[messageIndex]}

  </p>

</div>





            <div className="mt-10 space-y-8">

              <div>

                <label

                  htmlFor="money"

                  className="mb-2 block text-sm font-semibold"

                >

                  How much money do you have available right now?

                </label>



                <div className="flex items-center rounded-2xl border border-[#D9E2DA] bg-white px-5 shadow-sm transition-all focus-within:border-[#173F32] focus-within:ring-4 focus-within:ring-[#173F32]/10">

                  <span className="text-xl font-semibold text-[#173F32]">

                    ₦

                  </span>



                  <input

                    id="money"

                    type="number"

                    min="0"

                    value={money}

                    onChange={(event) => setMoney(event.target.value)}

                    placeholder="32,000"

                    className="w-full bg-transparent px-3 py-5 text-lg font-medium text-[#252D28] outline-none"

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

                  className="w-full rounded-2xl border border-[#D9E2DA] bg-white px-5 py-5 text-base text-[#252D28] shadow-sm outline-none transition-all focus:border-[#173F32] focus:ring-4 focus:ring-[#173F32]/10"

                />

              </div>





<button

  onClick={() => setStep(1)}

  disabled={!money || !nextIncome}

  className="w-full rounded-2xl bg-[#171A18] px-6 py-4 font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#173F32] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-40"

>

  Continue

</button>



            </div>

          </div>



          <RevealOnScroll className="mt-12">

  <section className="rounded-3xl border border-[#D9E2DA] bg-white/70 p-6 sm:p-8">



            <div className="max-w-xl">

              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#39745A]">

                OUR PURPOSE

              </p>



              <h2 className="mt-3 text-2xl font-bold tracking-tight text-[#173F32] sm:text-3xl">

                Why Spending Coach?

              </h2>



              <p className="mt-3 text-sm leading-7 text-[#66736A] sm:text-base">

                Your money should support your real life. Spending Coach helps

                you plan for essentials, protect what matters, and make more

                confident spending decisions.

              </p>

            </div>



            <div className="mt-6 grid gap-4 sm:grid-cols-3">

              <div className="rounded-2xl bg-[#F7F6F0] p-4">

                <h3 className="font-semibold text-[#173F32]">

                  Plan realistically

                </h3>

                <p className="mt-2 text-sm leading-6 text-[#66736A]">

                  Create a plan around your actual needs and spending patterns.

                </p>

              </div>



              <div className="rounded-2xl bg-[#F7F6F0] p-4">

                <h3 className="font-semibold text-[#173F32]">

                  Protect what matters

                </h3>

                <p className="mt-2 text-sm leading-6 text-[#66736A]">

                  Make room for essentials and money you want to keep protected.

                </p>

              </div>



              <div className="rounded-2xl bg-[#F7F6F0] p-4">

                <h3 className="font-semibold text-[#173F32]">

                  Adjust as life changes

                </h3>

                <p className="mt-2 text-sm leading-6 text-[#66736A]">

                  Adapt your plan when circumstances change, without guilt or judgment.

                </p>

              </div>

                        </div>

          </section>

        </RevealOnScroll>



          {archivedBudgets.length > 0 && (



  <RevealOnScroll className="mt-8">

    <section className="border-t border-[#D9E2DA] pt-6">

              <div className="mb-4 flex items-center justify-between gap-4">

                <div>

                  <h2 className="text-base font-semibold text-[#252D28]">

                    Previous Budget Periods

                  </h2>

                  <p className="mt-1 text-sm leading-6 text-[#66736A]">

                    Review your past budgets and recorded spending.

                  </p>

                </div>



                <span className="shrink-0 rounded-full bg-[#E3E9E2] px-3 py-1 text-xs font-semibold text-[#173F32]">

                  {archivedBudgets.length}{" "}

                  {archivedBudgets.length === 1 ? "record" : "records"}

                </span>

              </div>



              <div className="space-y-3">

                {archivedBudgets.map((budget) => (

                  <div

                    key={budget.id}

                    className="rounded-2xl border border-[#D9E2DA] bg-white p-4 shadow-sm"

                  >

                    <div className="flex flex-wrap items-start justify-between gap-3">

  <div>

    <p className="font-semibold text-[#252D28]">

      Budget archived{" "}

      {new Date(budget.archivedAt).toLocaleDateString()}

    </p>



    <p className="mt-1 text-sm text-[#66736A]">

      Starting balance: ₦

      {Number(budget.money || 0).toLocaleString()}

    </p>

  </div>



  <div className="flex items-center gap-3">

    <span className="rounded-lg bg-[#F7F6F0] px-3 py-2 text-sm font-semibold text-[#173F32]">

      Spent ₦

      {budget.transactions

        .reduce(

          (total, transaction) => total + transaction.amount,

          0

        )

        .toLocaleString()}

    </span>



    <button

      onClick={() => deleteArchivedBudget(budget.id)}

      className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50"

    >

      Delete

    </button>

  </div>

</div>

                    <p className="mt-3 text-xs text-[#66736A]">

                      {budget.transactions.length}{" "}

                      {budget.transactions.length === 1

                        ? "transaction"

                        : "transactions"}{" "}

                      recorded

                    </p>



                    {budget.transactions.length > 0 && (

                      <details className="mt-3 border-t border-[#E8ECE6] pt-3">

                        <summary className="cursor-pointer text-sm font-medium text-[#173F32]">

                          View recorded transactions

                        </summary>



                        <div className="mt-2 space-y-2">

                          {budget.transactions.map((transaction) => (

                            <div

                              key={transaction.id}

                              className="flex justify-between gap-4 text-sm text-[#66736A]"

                            >

                              <span>{transaction.category}</span>

                              <span className="font-medium text-[#252D28]">

                                ₦{transaction.amount.toLocaleString()}

                              </span>

                            </div>

                          ))}

                        </div>

                      </details>

                    )}

                  </div>

                ))}

              </div>





              </section>

            </RevealOnScroll>

          )}



          {deletedBudgets.length > 0 && (

            <RevealOnScroll className="mt-8">

              <section className="border-t border-[#D9E2DA] pt-6">

                <div className="mb-4">

                  <h2 className="text-base font-semibold text-[#252D28]">

                    Recently Deleted

                  </h2>

                  <p className="mt-1 text-sm leading-6 text-[#66736A]">

                    Deleted budgets stay here for 30 days so you can restore them.

                  </p>

                </div>



                <div className="space-y-3">

                  {deletedBudgets.map((budget) => {

                    const deletedTime = budget.deletedAt

                      ? new Date(budget.deletedAt).getTime()

                      : Date.now();



                    const daysElapsed = Math.floor(

                      (Date.now() - deletedTime) /

                        (24 * 60 * 60 * 1000)

                    );



                    const daysRemaining = Math.max(

                      0,

                      30 - daysElapsed

                    );



                    return (

                      <div

                        key={budget.id}

                        className="rounded-2xl border border-[#D9E2DA] bg-white p-4 shadow-sm"

                      >

                        <p className="font-semibold text-[#252D28]">

                          Budget archived{" "}

                          {new Date(

                            budget.archivedAt

                          ).toLocaleDateString()}

                        </p>



                        <p className="mt-1 text-sm text-[#66736A]">

                          Starting balance: ₦

                          {Number(

                            budget.money || 0

                          ).toLocaleString()}

                        </p>



                        <p className="mt-2 text-sm font-medium text-red-700">

                          {daysRemaining}{" "}

                          {daysRemaining === 1 ? "day" : "days"} remaining

                        </p>



                        <div className="mt-4">

                          <button

                            onClick={() =>

                              restoreDeletedBudget(budget.id)

                            }

                            className="rounded-lg bg-[#173F32] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#245541]"

                          >

                            Restore budget

                          </button>

                        </div>

                      </div>

                    );

                  })}

                </div>

              </section>

            </RevealOnScroll>

          )}



          </div>





            <PoweredByYesxtra />

    </main>



    );

  }



  // STEP 1



  // STEP 1

  if (step === 1) {

    return (

      <main className="min-h-screen bg-[#F7F6F0] px-6 py-12 text-slate-900">

        <div className="mx-auto max-w-2xl">

<div className="mb-5 flex items-center justify-between gap-3">

  <button

    onClick={() => setStep(0)}

    className="button-primary rounded-xl px-4 py-2 text-sm font-semibold"

  >

    Home

  </button>



  {planStartedAt && (

    <button

      onClick={() => setStep(3)}

      className="button-primary rounded-xl px-4 py-2 text-sm font-semibold"

    >

      My Plan

    </button>

  )}

</div>

          <div className="flex min-h-[80vh] flex-col justify-center">



<div className="mb-8">

  <div className="mb-3 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#66736A]">

    <span>Your plan</span>

    <span>Step 2 of 4</span>

  </div>

  <div

    className="h-1.5 w-full overflow-hidden rounded-full bg-[#E3E9E2]"

    role="progressbar"

    aria-label="Budget setup progress"

    aria-valuemin={0}

    aria-valuemax={4}

    aria-valuenow={2}

  >

    <div className="h-full w-2/4 rounded-full bg-[#173F32] transition-all duration-300" />

  </div>

</div>





            <h1 className="max-w-xl text-4xl font-bold leading-tight tracking-tight text-[#173F32] sm:text-5xl">

              What do you normally spend money on?

            </h1>



            <p className="mt-4 max-w-lg text-base leading-7 text-[#66736A] sm:text-lg">

              Select everything that applies.

            </p>



            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">

              {expenseOptions.map((expense) => {

                const selected =

                  expenses.includes(expense) ||

                  (expense === "Others" &&

                    Boolean(

                      customExpenseName.trim() &&

                      expenses.includes(customExpenseName.trim())

                    ));



                return (

                  <button

                    key={expense}

                    onClick={() => toggleExpense(expense)}



className={`rounded-2xl border px-5 py-4 text-left font-medium transition-all duration-200 ${

  selected

    ? "border-[#173F32] bg-[#173F32] text-white shadow-sm"

    : "border-[#D9E2DA] bg-white text-[#252D28] hover:border-[#39745A] hover:bg-[#F9FBF8]"

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



            {(expenses.includes("Others") ||

              (customExpenseName.trim() &&

                expenses.includes(customExpenseName.trim()))) && (

              <div className="mt-5 rounded-2xl border border-[#D9E2DA] bg-white p-5">

                <label

                  htmlFor="customExpenseName"

                  className="mb-2 block text-sm font-semibold text-[#173F32]"

                >

                  What category would you like to add?

                </label>

                <input

                  id="customExpenseName"

                  type="text"

                  value={customExpenseName}

                  onChange={(event) =>

                    handleCustomExpenseNameChange(event.target.value)

                  }

                  placeholder="e.g. Internet subscription"

                  maxLength={60}

                  className="w-full rounded-xl border border-[#D9E2DA] bg-white px-4 py-3 text-[#252D28] outline-none transition focus:border-[#39745A] focus:ring-2 focus:ring-[#E3E9E2]"

                />

                <p className="mt-2 text-sm text-slate-500">

                  Give this expense a name you will recognize in your budget.

                </p>

              </div>

            )}



            <button

              onClick={() => setStep(2)}

              disabled={expenses.length === 0 || expenses.includes("Others")}

              className="mt-8 w-full rounded-xl bg-slate-900 px-6 py-4 font-semibold text-white transition hover:bg-[#245440] disabled:cursor-not-allowed disabled:opacity-40"

            >

              Continue

            </button>



            <button

              onClick={() => setStep(0)}

              className="rounded-2xl border border-[#D9E2DA] bg-white px-6 py-4 font-semibold text-[#173F32] transition-all duration-200 hover:border-[#39745A] hover:bg-[#F9FBF8]"

            >

              Back

            </button>

          </div>

        </div>

            <PoweredByYesxtra />

    </main>

    );

  }



  // STEP 2

  if (step === 2) {

    return (

      <main className="min-h-screen bg-[#F7F6F0] px-5 py-10 text-[#252D28] sm:px-8 sm:py-14">

        <div className="mx-auto max-w-2xl">

     <div className="mb-5 flex items-center justify-between gap-3">

  <button

    onClick={() => setStep(0)}

    className="button-primary rounded-xl px-4 py-2 text-sm font-semibold"

  >

    Home

  </button>



  {planStartedAt && (

    <button

      onClick={() => setStep(3)}

      className="button-primary rounded-xl px-4 py-2 text-sm font-semibold"

    >

      My Plan

    </button>

  )}

</div>

<div className="mb-8">

  <div className="mb-3 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#66736A]">

    <span>Your plan</span>

    <span>Step 3 of 4</span>

  </div>



  <div

    className="h-1.5 w-full overflow-hidden rounded-full bg-[#E3E9E2]"

    role="progressbar"

    aria-label="Budget setup progress"

    aria-valuemin={0}

    aria-valuemax={4}

    aria-valuenow={3}

  >

    <div className="h-full w-3/4 rounded-full bg-[#173F32] transition-all duration-300" />

  </div>

</div>







<h1 className="max-w-xl text-4xl font-bold leading-tight tracking-tight text-[#173F32] sm:text-5xl">

  Tell us how your spending normally happens.

</h1>







<p className="mt-4 max-w-lg text-base leading-7 text-[#66736A] sm:text-lg">

  We&apos;ll use your real spending patterns instead of forcing

  everything into a daily budget.

</p>





          <div className="mt-10 space-y-8">

            {/* FOOD */}

            {expenses.includes("Food") && (

              <section className="rounded-3xl border border-[#D9E2DA] bg-white p-6 shadow-sm sm:p-7">

                <h2 className="text-xl font-bold text-[#173F32]">Food</h2>



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



className={`rounded-2xl border px-4 py-3 text-left font-medium transition-all duration-200 ${

  foodPattern === value

    ? "border-[#173F32] bg-[#173F32] text-white shadow-sm"

    : "border-[#D9E2DA] bg-white text-[#252D28] hover:border-[#39745A] hover:bg-[#F9FBF8]"

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



                    <div className="flex items-center rounded-2xl border border-[#D9E2DA] bg-white px-4 transition focus-within:border-[#39745A] focus-within:ring-2 focus-within:ring-[#E3E9E2]">

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

                        className="w-full bg-transparent px-3 py-4 text-[#252D28] outline-none placeholder:text-[#A0AAA1]"

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

              <section className="rounded-3xl border border-[#D9E2DA] bg-white p-6 shadow-sm sm:p-7">

                <h2 className="text-xl font-bold text-[#173F32]">Transport</h2>



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



                    <div className="flex items-center rounded-2xl border border-[#D9E2DA] bg-white px-4 transition focus-within:border-[#39745A] focus-within:ring-2 focus-within:ring-[#E3E9E2]">

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

                        className="w-full bg-transparent px-3 py-4 text-[#252D28] outline-none placeholder:text-[#A0AAA1]"

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

              <section className="rounded-3xl border border-[#D9E2DA] bg-white p-6 shadow-sm sm:p-7">

                <h2 className="text-xl font-bold text-[#173F32]">Data</h2>



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



                   <div className="flex items-center rounded-2xl border border-[#D9E2DA] bg-white px-4 transition focus-within:border-[#39745A] focus-within:ring-2 focus-within:ring-[#E3E9E2]">

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

                        className="w-full bg-transparent px-3 py-4 text-[#252D28] outline-none placeholder:text-[#A0AAA1]"

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

                  <h2 className="text-xl font-bold text-[#173F32]">

  {expense}

</h2>



                  <label className="mt-4 mb-2 block text-sm font-semibold">

                    How much do you expect to spend on {expense.toLowerCase()}{" "}

                    during this plan?

                  </label>



                  <div className="flex items-center rounded-2xl border border-[#D9E2DA] bg-white px-4 transition focus-within:border-[#39745A] focus-within:ring-2 focus-within:ring-[#E3E9E2]">

                    <span className="text-slate-500">₦</span>



                    <input

                      type="number"

                      min="0"

                      value={otherAmounts[expense] || ""}

                      onChange={(event) =>

                        updateOtherAmount(expense, event.target.value)

                      }

                      placeholder="0"

                      className="w-full bg-transparent px-3 py-4 text-[#252D28] outline-none placeholder:text-[#A0AAA1]"

                    />

                  </div>

                </section>

              ))}

<section className="rounded-3xl border border-[#D9E2DA] bg-white p-6 shadow-sm sm:p-7">

  <h2 className="text-xl font-bold text-[#173F32]">

  Protected buffer

</h2>



  <p className="mt-1 text-sm text-slate-500">

    How much money would you like to keep aside for unexpected expenses?

  </p>



  <div className="mt-5 flex items-center rounded-2xl border border-[#D9E2DA] bg-white px-4 transition focus-within:border-[#39745A] focus-within:ring-2 focus-within:ring-[#E3E9E2]">

    <span className="text-slate-500">₦</span>



    <input

      type="number"

      min="0"

      value={buffer}

      onChange={(event) => setBuffer(event.target.value)}

      placeholder="1,000"

      className="w-full bg-transparent px-3 py-4 text-[#252D28] outline-none placeholder:text-[#A0AAA1]"

    />

  </div>



  <p className="mt-2 text-sm text-slate-500">

    You can enter ₦0 if you don't want a protected buffer.

  </p>

</section>

            <button

              onClick={() => {

                if (!planStartedAt) setPlanStartedAt(new Date().toISOString());

                setStep(3);

              }}

              disabled={!canBuildPlan()}

              className="w-full rounded-2xl bg-slate-900 px-6 py-4 font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#173F32] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"

            >

              Build My Plan

            </button>



            <button

              onClick={() => setStep(1)}

              className="rounded-2xl border border-[#D9E2DA] bg-white px-6 py-4 font-semibold text-[#173F32] transition-all duration-200 hover:border-[#39745A] hover:bg-[#F9FBF8]"

            >

              Back

            </button>

          </div>

        </div>

            <PoweredByYesxtra />

    </main>

    );

  }



  // STEP 3 — PLAN RESULT

return (

  <main className="min-h-screen bg-[#F7F6F0] px-5 py-10 text-[#252D28] sm:px-8 sm:py-14">

    <div className="mx-auto max-w-2xl">

      <div className="mb-3 flex items-start justify-between gap-4">

  <button

    onClick={() => setStep(0)}

    className="button-primary rounded-xl px-4 py-2 text-sm font-semibold"

  >

    Home

  </button>

  <p className="text-sm font-semibold uppercase tracking-widest text-[#39745A]">

   {archivedBudgets.length === 0 ? "Your first plan" : "Your current plan"}

  </p>



  <button

    onClick={startNewBudget}

    className="button-primary rounded-xl px-4 py-2 text-sm font-semibold"

  >

    New Budget Period

  </button>

</div>



      <h1 className="text-4xl font-bold leading-tight tracking-tight text-[#173F32] sm:text-5xl">

        Here&apos;s what you can safely spend.

      </h1>



      <p className="mt-4 max-w-lg text-base leading-7 text-[#66736A] sm:text-lg">

        This amount is available without putting your known upcoming

        spending or protected buffer at risk.

      </p>



      {/* YOUR MONEY RUNWAY */}

      <section className="mt-7 rounded-3xl border border-[#D9E2DA] bg-white p-6 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg sm:p-7">

        <div className="flex items-start justify-between gap-4">

          <div>

            <p className="text-sm font-semibold uppercase tracking-widest text-[#39745A]">

              Your money runway

            </p>

            <h2 className="mt-2 text-2xl font-bold text-[#173F32]">

              {!nextIncome

                ? "Choose your target date"

                : runwayTarget && runwayTarget < runwayToday

                  ? "Your target date has passed"

                  : runwayDaysRemaining === 0

                    ? "Today is your target date"

                    : `${runwayDaysRemaining} ${

                        runwayDaysRemaining === 1 ? "day" : "days"

                      } left`}

            </h2>

          </div>



          <div className="rounded-2xl bg-[#F0F5F0] px-3 py-2 text-sm font-semibold text-[#285744]">

            {Math.round(runwayProgress)}% elapsed

          </div>

        </div>



        <p className="mt-3 text-sm leading-6 text-[#66736A]">

          {nextIncome && runwayTarget

            ? `Your money is planned to last until ${runwayTarget.toLocaleDateString(

                "en-NG",

                {

                  day: "numeric",

                  month: "long",

                  year: "numeric",

                }

              )}.`

            : "Set the date this money needs to last until to see your timeline."}

        </p>



        <div

          className="mt-6 h-3 overflow-hidden rounded-full bg-[#E8EDE7]"

          role="progressbar"

          aria-label="Budget timeline elapsed"

          aria-valuemin={0}

          aria-valuemax={100}

          aria-valuenow={Math.round(runwayProgress)}

        >

          <div

            className="h-full rounded-full bg-[#39745A] transition-all duration-500"

            style={{ width: `${runwayProgress}%` }}

          />

        </div>



        <div className="mt-3 flex items-center justify-between gap-3 text-xs text-[#66736A] sm:text-sm">

          <span>

            {runwayStartDate

              ? `Started ${runwayStartDate.toLocaleDateString("en-NG", {

                  day: "numeric",

                  month: "short",

                })}`

              : "Plan start"}

          </span>

          <span>

            {nextIncome && runwayTarget

              ? runwayTarget.toLocaleDateString("en-NG", {

                  day: "numeric",

                  month: "short",

                })

              : "Target date"}

          </span>

        </div>

      </section>





    <div className="mt-4 rounded-2xl border border-[#D9E2DA] bg-white p-6 shadow-sm section-hover">

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

        className="rounded-xl border border-[#E8ECE6] p-4 section-hover"

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



      <div className="mt-4 flex items-center gap-3 rounded-2xl border border-[#CDE8D6] bg-gradient-to-r from-[#F1FAF3] to-[#E1F5E8] px-4 py-3 shadow-sm transition-all duration-300 hover:shadow-md section-hover">

        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#D0F1DB] text-[#176B4D]">

          <span aria-hidden="true">↗</span>

        </span>

        <div>

          <p className="font-semibold text-[#205B40]">Give your budget a home</p>

          <p className="text-sm text-[#557363]">Keep planned essentials and your buffer separate from everyday spending where possible.</p>

        </div>

      </div>



      {/* SAFE TO SPEND + BREAKDOWN */}

      <section className="mt-4 overflow-hidden rounded-2xl border border-[#78D9A5] bg-gradient-to-br from-[#176B4D] via-[#21835B] to-[#104A37] p-5 text-white shadow-[0_10px_28px_rgba(23,107,77,0.22)] ring-1 ring-[#B8F0CF] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_14px_32px_rgba(23,107,77,0.28)] section-hover sm:p-6">

        <div className="flex items-start justify-between gap-3">

          <div>

            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#C8F5D9]">

              Safe to Spend

            </p>

            <p className="mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl">

              ₦{Math.max(0, safeToSpend).toLocaleString()}

            </p>

            <p className="mt-2 text-sm leading-5 text-[#E0F6E8]">

              Money left for flexible spending after your planned needs and protected buffer.

            </p>

          </div>

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#A6EAC2]/50 bg-[#B8F0CF]/15 text-[#C8F5D9]">

            <span aria-hidden="true" className="text-xl">✓</span>

          </div>

        </div>



        <div className="mt-5 rounded-xl border border-[#B8F0CF]/35 bg-[#083F2D]/35 p-4">

          <p className="mb-3 text-sm font-semibold text-white">

            How your budget is allocated

          </p>



          <div className="space-y-3">

            <div className="flex items-center justify-between gap-4">

              <span className="text-sm text-[#D8F2E2]">Assigned to planned needs</span>

              <span className="text-sm font-semibold text-white">

                ₦{Math.max(0, remainingPlannedTotal).toLocaleString()}

              </span>

            </div>



            <div className="flex items-center justify-between gap-4">

              <span className="text-sm text-[#D8F2E2]">Protected for emergencies</span>

              <span className="text-sm font-semibold text-white">

                ₦{protectedBuffer.toLocaleString()}

              </span>

            </div>



            <div className="flex items-center justify-between gap-4 border-t border-[#B8F0CF]/30 pt-3">

              <span className="text-sm font-medium text-[#E0F6E8]">Available for flexible spending</span>

              <span className="text-sm font-bold text-white">

                ₦{Math.max(0, safeToSpend).toLocaleString()}

              </span>

            </div>

          </div>

        </div>

      </section>



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



      {/* RECORD SPENDING */}

    {transactions.length > 0 && (

  <details className="mt-4 rounded-2xl border border-[#D9E2DA] bg-white p-6 shadow-sm section-hover">

    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left">

      <h2 className="text-xl font-bold">Recent spending</h2>

      <span className="text-sm font-medium text-[#39745A]">Show / hide</span>

    </summary>

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

            setShowRecordSpending(true);

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

  </details>

)}

<details

  open={showRecordSpending || editingTransactionId !== null}

  onToggle={(event) => setShowRecordSpending(event.currentTarget.open)}

  className="mt-4 rounded-2xl border border-[#D9E2DA] bg-white p-6 shadow-sm section-hover"

>

  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left">

    <h2 className="text-xl font-bold">Record spending</h2>

    <span className="text-sm font-medium text-[#39745A]">Show / hide</span>

  </summary>

  <div className="mt-5">



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

  className="button-primary mt-5 w-full rounded-xl px-6 py-4 text-left font-semibold shadow-md transition hover:shadow-lg active:scale-[0.99]"

>

  {editingTransactionId !== null ? (

  <>

    <span className="block text-lg">Update Spending</span>

    <span className="mt-1 block text-sm font-normal text-slate-300">

      Save your changes to this transaction

    </span>

  </>

) : (

  <>

    <span className="block text-lg">Record Spending</span>

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

  </div>

</details>





      <button

        onClick={() => setStep(2)}

        className="button-primary rounded-xl px-4 py-2 text-sm font-semibold"

      >

        Adjust My Plan

      </button>



    </div>

          <PoweredByYesxtra />

    </main>

);

}