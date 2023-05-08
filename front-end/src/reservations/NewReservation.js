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

    if (name === "mobile_number") {
      const input = value.replace(/\D/g, "");
      if (input.length <= 3) {
        formattedValue = input;
      } else if (input.length <= 6) {
        formattedValue = `${input.slice(0, 3)}-${input.slice(3)}`;
      } else {
        formattedValue = `${input.slice(0, 3)}-${input.slice(
          3,
          6
        )}-${input.slice(6, 10)}`;
      }
    }

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
    const reservationDate = new Date(
      `${formData["reservation_date"]}T${formData["reservation_time"]}:00`
    );
    const today = new Date();
    if (reservationDate < today) {
      errorMessages.push(
        "Reservation Date must be in the future. Please select valid date"
      );
    }
    if (reservationDate.getDay() === 2 /*date is tuesday*/) {
      errorMessages.push(
        "Restaurant closed on Tuesdays. Please select another day."
      );
    }
    if (errorMessages.length > 0) {
      setErrors(errorMessages);
      return false;
    }
    return true;
  };

  function createNewReservation(reservationData) {
    const newAbortController = new AbortController();
    setAbortController(newAbortController);
    setErrors([]);
    createReservation(reservationData, newAbortController.signal)
      .then((createdReservation) => {
        history.push(`/dashboard?date=${formData.reservation_date}`);
      })
      .catch((error) => setErrors([error.message]));
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("errors is", errors);
    console.log("errors.length is", errors.length);
    // to push to database here
    // need to format reservation time using utils/format-reservationtime, as well as reservation-date
    if (validateInputs()) {
      createNewReservation(formData);
    }
  };

  return (
    <main>
      <h1>This is a new Reservation!</h1>
      {errors.length > 0 &&
        errors.map((error, index) => {
          return (
            <div className="alert alert-danger" key={index}>
              {error}
            </div>
          );
        })}
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
          placeholder="YYYY-MM-DD"
          pattern="\d{4}-\d{2}-\d{2}"
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
