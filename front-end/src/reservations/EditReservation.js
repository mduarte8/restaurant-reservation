import React, { useEffect, useState } from "react";
import { Link, useHistory, useLocation, useParams } from "react-router-dom";
import { createTable } from "../utils/api";
import ReservationForm from "./ReservationForm";
import useQuery from "../utils/useQuery";
import { readReservation, updateReservation } from "../utils/api";

function EditReservation() {
  const history = useHistory();
  const { reservation_id } = useParams();

  const [errors, setErrors] = useState([]);
  const [abortController, setAbortController] = useState(null);
  const [reservation, setReservation] = useState({});
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 1,
  });

  useEffect(() => {
    return () => {
      if (abortController) {
        abortController.abort();
      }
    };
  }, [abortController]);

  useEffect(() => {
    const newAbortController = new AbortController();
    setAbortController(newAbortController);
    setErrors([]);
    readReservation({ reservation_id }, newAbortController.signal)
      .then((reservationData) => {
        // setReservation(reservationData);
        setFormData({ ...reservationData });
      })
      .then(() => {
        setReservation({ reservation_id: reservation_id });
      })
      .catch((error) => setErrors([error.message]));
  }, [reservation_id]);

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

  function updateExistingReservation(reservationData) {
    const newAbortController = new AbortController();
    setAbortController(newAbortController);
    setErrors([]);
    updateReservation(reservationData, newAbortController.signal) // API call
      .then((updatedReservation) => {
        history.push(`/dashboard?date=${formData.reservation_date}`);
      })
      .catch((error) => {
        console.log("error from updateRes is", error);
        setErrors([error.message]);
      });
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("formData is", formData);
    console.log("errors is", errors);
    // to push to database here
    // need to format reservation time using utils/format-reservationtime, as well as reservation-date
    if (validateInputs()) {
      updateExistingReservation({ ...formData, status: "booked" });
    }
  };

  const handleCancel = (event) => {
    event.preventDefault();
    if (window.confirm("Do you want to cancel this reservation?")) {
      console.log("yay!");
    }
    history.goBack();
  };

  return (
    <main>
      <h1>Edit Reservation {reservation_id}!</h1>
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
        history={history}
      />
      <button
        data-reservation-id-cancel={reservation.reservation_id - 1}
        className="btn btn-danger"
        onClick={handleCancel}
      >
        Cancel {reservation.reservation_id}
      </button>
    </main>
  );
}

export default EditReservation;
