import { useState } from "react";

import { createTransaction } from "../services/transactionApi";

import "./TransactionForm.css";


function TransactionForm({ onTransactionAdded }) {

  const [formData, setFormData] = useState({
    amount: "",
    type: "expense",
    category: "",
    description: "",
    date: "",
  });


  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");


  // ==========================================
  // Input Change
  // ==========================================

  const handleChange = (event) => {

    const {
      name,
      value,
    } = event.target;


    setFormData(
      (previous) => ({
        ...previous,
        [name]: value,
      })
    );

  };


  // ==========================================
  // Transaction Type
  // ==========================================

  const handleTypeChange = (type) => {

    setFormData(
      (previous) => ({
        ...previous,
        type,
      })
    );

  };


  // ==========================================
  // Submit
  // ==========================================

  const handleSubmit = async (event) => {

    event.preventDefault();


    setError("");
    setSuccess("");


    // Validation

    if (!formData.amount) {

      setError(
        "Please enter an amount."
      );

      return;

    }


    if (
      Number(formData.amount) <= 0
    ) {

      setError(
        "Amount must be greater than 0."
      );

      return;

    }


    if (!formData.category) {

      setError(
        "Please enter a category."
      );

      return;

    }


    if (!formData.date) {

      setError(
        "Please select a date."
      );

      return;

    }


    try {

      setLoading(true);


      const data = {

        amount:
          Number(formData.amount),

        type:
          formData.type,

        category:
          formData.category,

        description:
          formData.description,

        date:
          formData.date,

      };


      console.log(
        "CREATING TRANSACTION:",
        data
      );


      await createTransaction(data);


      setSuccess(
        "Transaction added successfully!"
      );


      // Reset form

      setFormData({
        amount: "",
        type: "expense",
        category: "",
        description: "",
        date: "",
      });


      // Tell parent to refresh

      if (onTransactionAdded) {

        onTransactionAdded();

      }

    }

    catch (err) {

      console.error(
        "CREATE TRANSACTION ERROR:",
        err
      );


      setError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        "Failed to create transaction."
      );

    }

    finally {

      setLoading(false);

    }

  };


  return (

    <div className="transaction-form-card">


      {/* ================================= */}
      {/* Header */}
      {/* ================================= */}

      <div className="transaction-form-header">

        <h2>
          Add Transaction
        </h2>

        <p>
          Record your income or expense
          and keep your finances organized.
        </p>

      </div>


      <form
        className="transaction-form"
        onSubmit={handleSubmit}
      >


        {/* ================================= */}
        {/* Amount */}
        {/* ================================= */}

        <div className="form-group">

          <label>
            Amount
          </label>

          <input
            type="number"
            name="amount"
            placeholder="Enter amount"
            value={formData.amount}
            onChange={handleChange}
            min="0"
            step="0.01"
          />

        </div>


        {/* ================================= */}
        {/* Date */}
        {/* ================================= */}

        <div className="form-group">

          <label>
            Date
          </label>

          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
          />

        </div>


        {/* ================================= */}
        {/* Type */}
        {/* ================================= */}

        <div className="form-group full-width">

          <label>
            Transaction Type
          </label>


          <div className="type-buttons">

            <button
              type="button"
              className={
                formData.type === "expense"
                  ? "type-button active"
                  : "type-button"
              }
              onClick={() =>
                handleTypeChange(
                  "expense"
                )
              }
            >
              Expense
            </button>


            <button
              type="button"
              className={
                formData.type === "income"
                  ? "type-button active"
                  : "type-button"
              }
              onClick={() =>
                handleTypeChange(
                  "income"
                )
              }
            >
              Income
            </button>

          </div>

        </div>


        {/* ================================= */}
        {/* Category */}
        {/* ================================= */}

        <div className="form-group">

          <label>
            Category
          </label>

          <input
            type="text"
            name="category"
            placeholder="Food, Salary, Travel..."
            value={formData.category}
            onChange={handleChange}
          />

        </div>


        {/* ================================= */}
        {/* Description */}
        {/* ================================= */}

        <div className="form-group">

          <label>
            Description
          </label>

          <input
            type="text"
            name="description"
            placeholder="Optional description"
            value={formData.description}
            onChange={handleChange}
          />

        </div>


        {/* ================================= */}
        {/* Error */}
        {/* ================================= */}

        {error && (

          <div className="form-message form-error">

            {error}

          </div>

        )}


        {/* ================================= */}
        {/* Success */}
        {/* ================================= */}

        {success && (

          <div className="form-message form-success">

            {success}

          </div>

        )}


        {/* ================================= */}
        {/* Submit */}
        {/* ================================= */}

        <button
          type="submit"
          className="add-transaction-button"
          disabled={loading}
        >

          {loading
            ? "Adding Transaction..."
            : "＋ Add Transaction"}

        </button>

      </form>

    </div>

  );

}


export default TransactionForm;