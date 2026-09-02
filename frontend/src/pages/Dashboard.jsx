import { useEffect, useState } from "react";

import {
  getDashboardSummary,
  getCategoryExpenses,
  getMonthlySummary,
} from "../services/dashboardApi";

import TransactionForm from "../components/TransactionForm";
import TransactionTable from "../components/TransactionTable";
import TransactionCharts from "../components/TransactionCharts.jsx";

import "./Dashboard.css";


function Dashboard() {

  // ==========================================
  // STATE
  // ==========================================

  const [summary, setSummary] = useState(null);

  const [categories, setCategories] = useState(null);

  const [monthly, setMonthly] = useState(null);

  const [summaryError, setSummaryError] = useState("");

  const [categoryError, setCategoryError] = useState("");

  const [monthlyError, setMonthlyError] = useState("");

  const [loading, setLoading] = useState(true);


  // ==========================================
  // LOAD DASHBOARD
  // ==========================================

  const loadDashboard = async () => {

    setLoading(true);


    // ------------------------------------------
    // Summary
    // ------------------------------------------

    try {

      setSummaryError("");

      const data = await getDashboardSummary();

      console.log("SUMMARY SUCCESS:", data);

      setSummary(data);

    } catch (err) {

      console.error("SUMMARY ERROR:", err);

      setSummaryError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        "Summary API failed"
      );

    }


    // ------------------------------------------
    // Categories
    // ------------------------------------------

    try {

      setCategoryError("");

      const data = await getCategoryExpenses();

      console.log("CATEGORIES SUCCESS:", data);

      setCategories(data);

    } catch (err) {

      console.error("CATEGORIES ERROR:", err);

      setCategoryError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        "Categories API failed"
      );

    }


    // ------------------------------------------
    // Monthly
    // ------------------------------------------

    try {

      setMonthlyError("");

      const data = await getMonthlySummary();

      console.log("MONTHLY SUCCESS:", data);

      setMonthly(data);

    } catch (err) {

      console.error("MONTHLY ERROR:", err);

      setMonthlyError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        "Monthly API failed"
      );

    }


    setLoading(false);

  };


  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {

    loadDashboard();

  }, []);


  // ==========================================
  // AFTER TRANSACTION
  // ==========================================

  const handleTransactionAdded = () => {

    loadDashboard();

  };


  // ==========================================
  // GET VALUE
  // ==========================================

  const getValue = (
    object,
    keys,
    fallback = 0
  ) => {

    if (!object) {
      return fallback;
    }


    for (const key of keys) {

      if (
        object[key] !== undefined &&
        object[key] !== null
      ) {

        return object[key];

      }

    }


    return fallback;

  };


  // ==========================================
  // FINANCIAL VALUES
  // ==========================================

  const totalIncome = getValue(
    summary,
    [
      "total_income",
      "income",
      "totalIncome",
    ]
  );


  const totalExpense = getValue(
    summary,
    [
      "total_expense",
      "expense",
      "totalExpense",
    ]
  );


  const balance = getValue(
    summary,
    [
      "balance",
      "total_balance",
      "totalBalance",
    ],
    Number(totalIncome) -
    Number(totalExpense)
  );


  const transactionCount = getValue(
    summary,
    [
      "transaction_count",
      "transactions_count",
      "count",
      "total_transactions",
    ]
  );


  // ==========================================
  // CURRENCY FORMAT
  // ==========================================

  const formatCurrency = (value) => {

    return `₹${Number(
      value || 0
    ).toLocaleString("en-IN")}`;

  };


  // ==========================================
  // LOADING SCREEN
  // ==========================================

  if (loading && !summary) {

    return (

      <div className="dashboard">

        {/* Moving Background */}

        <div className="background-orb orb-one"></div>

        <div className="background-orb orb-two"></div>

        <div className="background-orb orb-three"></div>


        {/* Floating Particles */}

        <div className="floating-particles">

          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>

        </div>


        {/* Loading */}

        <div className="dashboard-loading">

          <div className="loading-spinner"></div>

          <h2>
            Loading Dashboard...
          </h2>

          <p>
            Fetching your financial data
          </p>

        </div>

      </div>

    );

  }


  // ==========================================
  // MAIN DASHBOARD
  // ==========================================

  return (

    <div className="dashboard">


      {/* ====================================== */}
      {/* MOVING BACKGROUND ORBS */}
      {/* ====================================== */}

      <div className="background-orb orb-one"></div>

      <div className="background-orb orb-two"></div>

      <div className="background-orb orb-three"></div>


      {/* ====================================== */}
      {/* FLOATING PARTICLES */}
      {/* ====================================== */}

      <div className="floating-particles">

        <span></span>

        <span></span>

        <span></span>

        <span></span>

        <span></span>

        <span></span>

        <span></span>

        <span></span>

      </div>


      {/* ====================================== */}
      {/* DASHBOARD CONTENT */}
      {/* ====================================== */}

      <div className="dashboard-content">


        {/* ==================================== */}
        {/* HEADER */}
        {/* ==================================== */}

        <header className="dashboard-header">

          <div>

            <div className="dashboard-badge">

              FINANCIAL CONTROL CENTER

            </div>


            <h1 className="dashboard-title">

              Financial Dashboard

            </h1>


            <p className="dashboard-subtitle">

              Track your income, expenses and
              financial activity in one place.

            </p>

          </div>


          {/* Refresh */}

          <button
            className="refresh-button"
            onClick={loadDashboard}
          >

            ↻ Refresh

          </button>

        </header>


        {/* ==================================== */}
        {/* ERROR */}
        {/* ==================================== */}

        {summaryError && (

          <div className="dashboard-error">

            ⚠ {summaryError}

          </div>

        )}


        {/* ==================================== */}
        {/* SUMMARY CARDS */}
        {/* ==================================== */}

        <div className="summary-cards">


          {/* TOTAL BALANCE */}

          <div className="summary-card balance-card">

            <div className="card-icon">

              ₹

            </div>


            <div className="card-content">

              <p>
                Total Balance
              </p>


              <h2>

                {formatCurrency(balance)}

              </h2>


              <span>

                Current financial balance

              </span>

            </div>

          </div>


          {/* TOTAL INCOME */}

          <div className="summary-card income-card">

            <div className="card-icon">

              ↗

            </div>


            <div className="card-content">

              <p>
                Total Income
              </p>


              <h2>

                {formatCurrency(totalIncome)}

              </h2>


              <span>

                Money received

              </span>

            </div>

          </div>


          {/* TOTAL EXPENSE */}

          <div className="summary-card expense-card">

            <div className="card-icon">

              ↘

            </div>


            <div className="card-content">

              <p>
                Total Expenses
              </p>


              <h2>

                {formatCurrency(totalExpense)}

              </h2>


              <span>

                Money spent

              </span>

            </div>

          </div>


          {/* TRANSACTIONS */}

          <div className="summary-card transaction-card">

            <div className="card-icon">

              #

            </div>


            <div className="card-content">

              <p>
                Transactions
              </p>


              <h2>

                {transactionCount}

              </h2>


              <span>

                Total records

              </span>

            </div>

          </div>

        </div>


        {/* ==================================== */}
        {/* FINANCIAL ANALYTICS */}
        {/* ==================================== */}

        <section className="dashboard-section">


          <div className="section-heading">

            <div>

              <span className="section-label">

                FINANCIAL ANALYTICS

              </span>


              <h2>

                Financial Overview

              </h2>

            </div>

          </div>


          <TransactionCharts
            categories={categories}
            monthly={monthly}
          />

        </section>


        {/* ==================================== */}
        {/* CATEGORY ERROR */}
        {/* ==================================== */}

        {categoryError && (

          <div className="dashboard-error">

            ⚠ Category data: {categoryError}

          </div>

        )}


        {/* ==================================== */}
        {/* MONTHLY ERROR */}
        {/* ==================================== */}

        {monthlyError && (

          <div className="dashboard-error">

            ⚠ Monthly data: {monthlyError}

          </div>

        )}


        {/* ==================================== */}
        {/* ADD TRANSACTION */}
        {/* ==================================== */}

        <section className="dashboard-section">


          <div className="section-heading">

            <div>

              <span className="section-label">

                QUICK ACTION

              </span>


              <h2>

                Add New Transaction

              </h2>

            </div>

          </div>


          <TransactionForm
            onTransactionAdded={
              handleTransactionAdded
            }
          />

        </section>


        {/* ==================================== */}
        {/* TRANSACTIONS */}
        {/* ==================================== */}

        <section className="dashboard-section">


          <div className="section-heading">

            <div>

              <span className="section-label">

                ACTIVITY

              </span>


              <h2>

                Recent Transactions

              </h2>

            </div>

          </div>


          <TransactionTable />

        </section>


        {/* ==================================== */}
        {/* FOOTER */}
        {/* ==================================== */}

        <footer className="dashboard-footer">

          <span>

            Financial Dashboard

          </span>


          <span>

            Secure • Organized • Intelligent

          </span>

        </footer>


      </div>

    </div>

  );

}


export default Dashboard;
