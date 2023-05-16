import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { createReservation } from "../utils/api";
import ReservationForm from "./ReservationForm";
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
        //automatically updates mobile number to have dashes in format ###-###-####
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
    if (name === "people") {
      formattedValue = parseInt(value);
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
    const earliestTime = new Date(`${formData["reservation_date"]}T10:30:00`);
    const latestTime = new Date(`${formData["reservation_date"]}T21:30:00`);
    const today = new Date();
    if (reservationDate < earliestTime || reservationDate > latestTime) {
      errorMessages.push(
        "Reservation Time must be between 10:30 AM and 9:30 PM"
      );
    }
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
    if (validateInputs()) {
      createNewReservation({ ...formData, status: "booked" });
    }
  };

  return (
    <main>
      <h1>This is a new Reservation!</h1>
      {errors.length > 0 &&
        errors.map((error, index) => {
          return (
            <div className="alert alert-danger m-2" key={index}>
              {error}
            </div>
          );
        })}
      <ReservationForm
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
      />
      <button onClick={() => history.goBack()}>Cancel</button>
    </main>
  );
}

export default NewReservation;
