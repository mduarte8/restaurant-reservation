import React, { useEffect, useState } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { createReservation } from "../utils/api";
/**
 * Defines the "Form" page for a new reservation.
 *
 * @returns {JSX.Element}
 */

function NewReservation() {
  const history = useHistory();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 1,
  });

  const [error, setError] = useState(null);
  const [abortController, setAbortController] = useState(null);

  useEffect(() => {
    return () => {
      if (abortController) {
        abortController.abort();
      }
    };
  }, [abortController]);

  const handleChange = (event) => {
    if (event.target.name === "mobile_number") {
      const input = event.target.value.replace(/\D/g, "");
      const formatted = `${input.slice(0, 3)}-${input.slice(
        3,
        6
      )}-${input.slice(6, 10)}`;
      event.target.value = formatted;
    }
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const validateInputs = () => {
    for (const key in formData) {
      if (formData[key] === "") {
        return false;
      }
    }
    return true;
  };

  function createNewReservation(reservationData) {
    const newAbortController = new AbortController();
    setAbortController(newAbortController);
    setError(null);
    createReservation(reservationData, newAbortController.signal)
      .then((createdReservation) => {
        history.push(`/dashboard?date=${formData.reservation_date}`);
      })
      .catch((error) => setError(error.message));
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    // to push to database here
    // need to format reservation time using utils/format-reservationtime, as well as reservation-date
    if (validateInputs()) {
      createNewReservation(formData);
    } else {
      setError("All fields must be filled out.");
    }
  };

  return (
    <main>
      <h1>This is a new Reservation!</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <input
          name="first_name"
          placeholder="First Name"
          value={formData.first_name}
          onChange={handleChange}
        />
        <input
          name="last_name"
          placeholder="Last Name"
          value={formData.last_name}
          onChange={handleChange}
        />
        <input
          name="mobile_number"
          id="mobile_number"
          type="tel"
          placeholder="Mobile Number"
          pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
          value={formData.mobile_number}
          onChange={handleChange}
          required
        />
        <input
          name="reservation_date"
          type="date"
          placeholder="Reservation Date"
          value={formData.reservation_date}
          onChange={handleChange}
        />
        <input
          name="reservation_time"
          type="time"
          placeholder="Reservation Time"
          value={formData.reservation_time}
          onChange={handleChange}
        />
        <input
          type="number"
          min="1"
          step="1"
          name="people"
          placeholder="1"
          value={formData.people}
          onChange={handleChange}
        />
        <button type="submit">Submit</button>
        <button onClick={() => history.goBack()}>Cancel</button>
      </form>
    </main>
  );
}

export default NewReservation;
