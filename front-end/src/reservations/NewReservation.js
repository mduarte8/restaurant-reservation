import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
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

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
    console.log(formData);
  };

  const validateInputs = () => {
    for (const key in formData) {
      if (formData[key] === "") {
        return false;
      }
    }
    return true;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // to push to database here
    // need to format reservation time using utils/format-reservationtime, as well as reservation-date
    if (validateInputs()) {
      console.log("yay submit!");
      console.log(formData.reservation_date);
      console.log(formData.reservation_time);
      history.push(`/dashboard?date=${formData.reservation_date}`); // update for reservaiton made
      setError(null);
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
          placeholder="Mobile Number"
          value={formData.mobile_number}
          onChange={handleChange}
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
