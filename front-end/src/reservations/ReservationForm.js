import React from "react";
// import { Link, useHistory, useLocation } from "react-router-dom";

function ReservationForm({ formData, handleChange, handleSubmit }) {
  //   const history = useHistory();

  return (
    <form onSubmit={handleSubmit} className="form-floating">
      <div className="form-floating mb-3">
        <input
          name="first_name"
          id="first_name"
          placeholder="First Name"
          value={formData.first_name}
          onChange={handleChange}
          className="form-control"
        />
        <label htmlFor="first_name">First Name</label>
      </div>
      <div className="form-floating mb-3">
        <input
          name="last_name"
          id="last_name"
          placeholder="Last Name"
          value={formData.last_name}
          onChange={handleChange}
          className="form-control"
        />
        <label htmlFor="last_name">Last Name</label>
      </div>
      <div className="form-floating mb-3">
        <input
          name="mobile_number"
          id="mobile_number"
          type="tel"
          placeholder="650-555-1234"
          pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
          value={formData.mobile_number}
          onChange={handleChange}
          className="form-control"
          required
        />
        <label htmlFor="mobile_number">Mobile Number</label>
      </div>
      <div className="form-floating mb-3">
        <input
          name="reservation_date"
          id="reservation_date"
          type="date"
          placeholder="YYYY-MM-DD"
          pattern="\d{4}-\d{2}-\d{2}"
          value={formData.reservation_date}
          onChange={handleChange}
          className="form-control"
        />
        <label htmlFor="reservation_date">Reservation Date</label>
      </div>
      <div className="form-floating mb-3">
        <input
          name="reservation_time"
          id="reservation_time"
          type="time"
          placeholder="Reservation Time"
          value={formData.reservation_time}
          onChange={handleChange}
          className="form-control"
        />
        <label htmlFor="reservation_time">Reservation Time</label>
      </div>
      <div className="form-floating mb-3">
        <input
          type="number"
          min="1"
          step="1"
          name="people"
          id="people"
          placeholder="1"
          value={formData.people}
          onChange={handleChange}
          className="form-control"
        />
        <label htmlFor="people">Number of People</label>
      </div>
      <button type="submit" className="btn btn-primary mb-3">
        Submit
      </button>
    </form>
  );
}

export default ReservationForm;
