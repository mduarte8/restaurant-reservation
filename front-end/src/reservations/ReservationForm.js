import React, { useEffect, useState } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { createTable } from "../utils/api";

function ReservationForm({
  formData,
  handleChange,
  handleSubmit,
  history = null,
}) {
  return (
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
      <button onClick={() => history.goBack()}>Go Back</button>
    </form>
  );
}

export default ReservationForm;
