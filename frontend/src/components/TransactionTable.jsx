import { useEffect, useState } from "react";
import "./TransactionTable.css";
import {
  getTransactions,
  updateTransaction,
  deleteTransaction,
} from "../services/transactionApi";

function TransactionTable() {

  const [transactions, setTransactions] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [editData, setEditData] = useState({
    amount: "",
    type: "",
    category: "",
    description: "",
    date: "",
  });


  // =========================
  // Load Transactions
  // =========================

  const loadTransactions = async () => {

    try {

      setLoading(true);

      setError("");

      const data = await getTransactions();

      console.log(
        "TRANSACTIONS:",
        data
      );


      if (Array.isArray(data)) {

        setTransactions(data);

      } else if (
        Array.isArray(data.transactions)
      ) {

        setTransactions(
          data.transactions
        );

      } else if (
        Array.isArray(data.data)
      ) {

        setTransactions(
          data.data
        );

      } else {

        setTransactions([]);

      }

    } catch (err) {

      console.error(
        "TRANSACTION ERROR:",
        err
      );

      setError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        "Failed to load transactions"
      );

    } finally {

      setLoading(false);

    }

  };


  useEffect(() => {

    loadTransactions();

  }, []);


  // =========================
  // Start Editing
  // =========================

  const handleEdit = (transaction) => {

    setEditingId(
      transaction._id ||
      transaction.id
    );

    setEditData({

      amount:
        transaction.amount || "",

      type:
        transaction.type || "expense",

      category:
        transaction.category || "",

      description:
        transaction.description || "",

      date:
        transaction.date || "",

    });

  };


  // =========================
  // Cancel Editing
  // =========================

  const handleCancel = () => {

    setEditingId(null);

    setEditData({
      amount: "",
      type: "",
      category: "",
      description: "",
      date: "",
    });

  };


  // =========================
  // Edit Input
  // =========================

  const handleEditChange = (e) => {

    const {
      name,
      value,
    } = e.target;

    setEditData({
      ...editData,
      [name]: value,
    });

  };


  // =========================
  // Save Edit
  // =========================

  const handleUpdate = async (id) => {

    try {

      const data = {

        amount:
          Number(editData.amount),

        type:
          editData.type,

        category:
          editData.category,

        description:
          editData.description,

        date:
          editData.date,

      };


      await updateTransaction(
        id,
        data
      );


      alert(
        "Transaction updated successfully"
      );


      setEditingId(null);


      await loadTransactions();


    } catch (err) {

      console.error(
        "UPDATE ERROR:",
        err
      );

      alert(
        err.response?.data?.error ||
        "Failed to update transaction"
      );

    }

  };


  // =========================
  // Delete
  // =========================

  const handleDelete = async (id) => {

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this transaction?"
      );


    if (!confirmed) {

      return;

    }


    try {

      await deleteTransaction(id);


      alert(
        "Transaction deleted successfully"
      );


      await loadTransactions();


    } catch (err) {

      console.error(
        "DELETE ERROR:",
        err
      );

      alert(
        err.response?.data?.error ||
        "Failed to delete transaction"
      );

    }

  };


  // =========================
  // Loading
  // =========================

  if (loading) {

    return (

      <div>

        <h2>Transactions</h2>

        <p>
          Loading transactions...
        </p>

      </div>

    );

  }


  // =========================
  // Error
  // =========================

  if (error) {

    return (

      <div>

        <h2>Transactions</h2>

        <p>
          {error}
        </p>

        <button
          onClick={
            loadTransactions
          }
        >
          Try Again
        </button>

      </div>

    );

  }


  return (

    <div
      style={{
        marginTop: "30px",
      }}
    >

      <h2>
        Transactions
      </h2>


      {transactions.length === 0 ? (

        <p>
          No transactions found.
        </p>

      ) : (

        <table
          border="1"
          cellPadding="10"
          style={{
            width: "100%",
            borderCollapse:
              "collapse",
          }}
        >

          <thead>

            <tr>

              <th>
                Amount
              </th>

              <th>
                Type
              </th>

              <th>
                Category
              </th>

              <th>
                Description
              </th>

              <th>
                Date
              </th>

              <th>
                Actions
              </th>

            </tr>

          </thead>


          <tbody>

            {transactions.map(
              (transaction, index) => {

                const id =
                  transaction._id ||
                  transaction.id;


                // =================
                // Editing Row
                // =================

                if (
                  editingId === id
                ) {

                  return (

                    <tr key={id}>

                      <td>

                        <input
                          type="number"
                          name="amount"
                          value={
                            editData.amount
                          }
                          onChange={
                            handleEditChange
                          }
                        />

                      </td>


                      <td>

                        <select
                          name="type"
                          value={
                            editData.type
                          }
                          onChange={
                            handleEditChange
                          }
                        >

                          <option value="expense">
                            Expense
                          </option>

                          <option value="income">
                            Income
                          </option>

                        </select>

                      </td>


                      <td>

                        <input
                          type="text"
                          name="category"
                          value={
                            editData.category
                          }
                          onChange={
                            handleEditChange
                          }
                        />

                      </td>


                      <td>

                        <input
                          type="text"
                          name="description"
                          value={
                            editData.description
                          }
                          onChange={
                            handleEditChange
                          }
                        />

                      </td>


                      <td>

                        <input
                          type="date"
                          name="date"
                          value={
                            editData.date
                          }
                          onChange={
                            handleEditChange
                          }
                        />

                      </td>


                      <td>

                        <button
                          onClick={() =>
                            handleUpdate(
                              id
                            )
                          }
                        >
                          Save
                        </button>


                        <button
                          onClick={
                            handleCancel
                          }
                        >
                          Cancel
                        </button>

                      </td>

                    </tr>

                  );

                }


                // =================
                // Normal Row
                // =================

                return (

                  <tr key={id || index}>

                    <td>
                      ₹
                      {
                        transaction.amount
                      }
                    </td>


                    <td>
                      {
                        transaction.type
                      }
                    </td>


                    <td>
                      {
                        transaction.category
                      }
                    </td>


                    <td>
                      {
                        transaction.description ||
                        "-"
                      }
                    </td>


                    <td>
                      {
                        transaction.date
                      }
                    </td>


                    <td>

                      <button
                        onClick={() =>
                          handleEdit(
                            transaction
                          )
                        }
                      >
                        Edit
                      </button>


                      <button
                        onClick={() =>
                          handleDelete(
                            id
                          )
                        }
                      >
                        Delete
                      </button>

                    </td>

                  </tr>

                );

              }
            )}

          </tbody>

        </table>

      )}

    </div>

  );

}

export default TransactionTable;