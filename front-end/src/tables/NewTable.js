import React, { useEffect, useState } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { createTable } from "../utils/api";

/**
 * Defines the "Table" page for a new table.
 *
 * @returns {JSX.Element}
 */

function NewTable() {
  const history = useHistory();

  const [formData, setFormData] = useState({
    table_name: "",
    capacity: "",
  });

  const [errors, setErrors] = useState([]);
  const [abortController, setAbortController] = useState(null);

  useEffect(() => {
    return () => {
      if (abortController) {
        abortController.abort();
      }
    };
  }, [abortController]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    let formattedValue = value;
    if (name === "capacity") {
      formattedValue = parseInt(value);
    }
    console.log(formData);
    setFormData({ ...formData, [name]: formattedValue });
  };

  const validateInputs = () => {
    let errorMessages = [];
    for (const key in formData) {
      if (formData[key] === "") {
        errorMessages.push("All fields must be filled out.");
        // could call which field is empty if desired
      }
    }
    if (formData["table_name"].length < 2) {
      errorMessages.push("table_name must be 2 characters or longer");
    }

    if (typeof formData["capacity"] !== "number") {
      errorMessages.push("cpacity must be type number");
    }

    if (errorMessages.length > 0) {
      setErrors(errorMessages);
      return false;
    }
    return true;
  };

  function createNewTable(tableData) {
    const newAbortController = new AbortController();
    setAbortController(newAbortController);
    setErrors([]);
    createTable(tableData, newAbortController.signal)
      .then((createdTable) => {
        history.push(`/dashboard`); // need to wait for table to be created and promise to resolve
      })
      .catch((error) => setErrors([error.message]));
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    if (validateInputs()) {
      createNewTable(formData); // history.push('/dashboard') included in createTable function to chain then and account for async and promise
    }
  };

  return (
    <main>
      <h1>Hooray new Table!</h1>
      {errors.length > 0 &&
        errors.map((error, index) => {
          return (
            <div className="alert alert-danger m-2" key={index}>
              {error}
            </div>
          );
        })}
      <form onSubmit={handleSubmit}>
        <input
          name="table_name"
          minLength={2}
          onChange={handleChange}
          value={formData.table_name}
          required
        />
        <input
          name="capacity"
          type="number"
          min="1"
          step="1"
          placeholder="1"
          onChange={handleChange}
          value={formData.capacity}
          required
        />
        <button type="submit" name="submit">
          Submit
        </button>
        <button name="cancel" onClick={() => history.goBack()}>
          Cancel
        </button>
      </form>
    </main>
  );
}

export default NewTable;
