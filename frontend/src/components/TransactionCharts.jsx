import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

import { Doughnut, Bar } from "react-chartjs-2";

import "./TransactionCharts.css";


// Register Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);


function TransactionCharts({ categories, monthly }) {

  // ==========================================
  // CATEGORY DATA
  // ==========================================

  const categoryLabels = [];
  const categoryValues = [];

  if (Array.isArray(categories)) {

    categories.forEach((item) => {

      categoryLabels.push(
        item.category ||
        item.name ||
        item._id ||
        "Other"
      );

      categoryValues.push(
        Number(
          item.amount ??
          item.total ??
          item.total_expense ??
          item.value ??
          0
        )
      );

    });

  } else if (
    categories &&
    typeof categories === "object"
  ) {

    Object.entries(categories).forEach(
      ([category, amount]) => {

        categoryLabels.push(category);

        categoryValues.push(
          Number(amount || 0)
        );

      }
    );

  }


  // ==========================================
  // MONTHLY DATA
  // ==========================================

  const monthlyLabels = [];
  const incomeValues = [];
  const expenseValues = [];

  if (Array.isArray(monthly)) {

    monthly.forEach((item) => {

      monthlyLabels.push(
        item.month ||
        item._id ||
        item.date ||
        "Month"
      );

      incomeValues.push(
        Number(
          item.income ??
          item.total_income ??
          0
        )
      );

      expenseValues.push(
        Number(
          item.expense ??
          item.total_expense ??
          0
        )
      );

    });

  } else if (
    monthly &&
    typeof monthly === "object"
  ) {

    Object.entries(monthly).forEach(
      ([month, value]) => {

        monthlyLabels.push(month);

        if (
          value &&
          typeof value === "object"
        ) {

          incomeValues.push(
            Number(
              value.income ??
              value.total_income ??
              0
            )
          );

          expenseValues.push(
            Number(
              value.expense ??
              value.total_expense ??
              0
            )
          );

        } else {

          incomeValues.push(0);

          expenseValues.push(
            Number(value || 0)
          );

        }

      }
    );

  }


  // ==========================================
  // CATEGORY CHART
  // ==========================================

  const categoryData = {

    labels:
      categoryLabels.length > 0
        ? categoryLabels
        : ["No Data"],

    datasets: [

      {

        data:
          categoryValues.length > 0
            ? categoryValues
            : [1],

        backgroundColor: [
          "#6366f1",
          "#8b5cf6",
          "#0ea5e9",
          "#10b981",
          "#f59e0b",
          "#f43f5e",
          "#ec4899",
          "#14b8a6",
        ],

        borderWidth: 0,

        hoverOffset: 10,

      },

    ],

  };


  // ==========================================
  // MONTHLY CHART
  // ==========================================

  const monthlyData = {

    labels:
      monthlyLabels.length > 0
        ? monthlyLabels
        : ["No Data"],

    datasets: [

      {

        label: "Income",

        data:
          incomeValues.length > 0
            ? incomeValues
            : [0],

        backgroundColor: "#10b981",

        borderRadius: 8,

      },

      {

        label: "Expenses",

        data:
          expenseValues.length > 0
            ? expenseValues
            : [0],

        backgroundColor: "#f43f5e",

        borderRadius: 8,

      },

    ],

  };


  // ==========================================
  // DOUGHNUT OPTIONS
  // ==========================================

  const doughnutOptions = {

    responsive: true,

    maintainAspectRatio: false,

    cutout: "65%",

    animation: {

      duration: 1200,

    },

    plugins: {

      legend: {

        position: "bottom",

        labels: {

          usePointStyle: true,

          padding: 15,

        },

      },

      tooltip: {

        padding: 12,

        cornerRadius: 10,

      },

    },

  };


  // ==========================================
  // BAR OPTIONS
  // ==========================================

  const barOptions = {

    responsive: true,

    maintainAspectRatio: false,

    animation: {

      duration: 1200,

    },

    plugins: {

      legend: {

        position: "top",

        labels: {

          usePointStyle: true,

          padding: 15,

        },

      },

      tooltip: {

        padding: 12,

        cornerRadius: 10,

      },

    },

    scales: {

      x: {

        grid: {

          display: false,

        },

      },

      y: {

        beginAtZero: true,

        grid: {

          color:
            "rgba(148, 163, 184, 0.15)",

        },

        ticks: {

          callback: (value) => {

            return (
              "₹" +
              Number(value)
                .toLocaleString("en-IN")
            );

          },

        },

      },

    },

  };


  // ==========================================
  // RETURN
  // ==========================================

  return (

    <div className="charts-container">


      {/* ================================== */}
      {/* Category Chart */}
      {/* ================================== */}

      <div className="chart-card">

        <div className="chart-header">

          <div>

            <span className="chart-label">
              EXPENSE ANALYTICS
            </span>

            <h2>
              Expenses by Category
            </h2>

            <p>
              See where your money is going
            </p>

          </div>


          <div className="chart-icon">
            ◉
          </div>

        </div>


        <div className="doughnut-wrapper">

          <Doughnut
            data={categoryData}
            options={doughnutOptions}
          />

        </div>

      </div>


      {/* ================================== */}
      {/* Monthly Chart */}
      {/* ================================== */}

      <div className="chart-card">

        <div className="chart-header">

          <div>

            <span className="chart-label">
              MONTHLY ANALYTICS
            </span>

            <h2>
              Income vs Expenses
            </h2>

            <p>
              Compare your monthly financial flow
            </p>

          </div>


          <div className="chart-icon">
            ↗
          </div>

        </div>


        <div className="bar-wrapper">

          <Bar
            data={monthlyData}
            options={barOptions}
          />

        </div>

      </div>


    </div>

  );
}


export default TransactionCharts;