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
    // console.log("reservationDate is", reservationDate);
    // console.log("formData[reservaiton_date] is", formData["reservation_date"]);
    // console.log(
    //   'formData["reservation_date"]}T${formData["reservation_time"]}:00',
    //   `${formData["reservation_date"]}T${formData["reservation_time"]}:00`
    // );
    // console.log("reservationDate.getDay()", reservationDate.getDay());
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
