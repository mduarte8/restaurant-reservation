import React, { useEffect, useState } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { createReservation } from "../utils/api";

function ReservationList({ reservations }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Reservation ID</th>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Phone #</th>
          <th>Reservation Date</th>
          <th>Reservation Time</th>
          <th>Party Size</th>
          <th>Status</th>
          <th>Edit</th>
          <th>Seat</th>
        </tr>
      </thead>
      <tbody>
        {reservations.map((reservation, index) => {
          return (
            <tr key={index}>
              <td>{reservation.reservation_id}</td>
              <td>{reservation.first_name}</td>
              <td>{reservation.last_name}</td>
              <td>{reservation.mobile_number}</td>
              <td>{reservation.reservation_date}</td>
              <td>{reservation.reservation_time}</td>
              <td>{reservation.people}</td>
              <td data-reservation-id-status={`${reservation.reservation_id}`}>
                {reservation.status}
              </td>
              <td>
                {reservation.status === "booked" ? (
                  <a
                    className="btn btn-secondary"
                    href={`/reservations/${reservation.reservation_id}/edit`}
                  >
                    Edit
                  </a>
                ) : (
                  ""
                )}
              </td>
              <td>
                {reservation.status === "seated" ? (
                  ""
                ) : (
                  <a
                    className="btn btn-secondary"
                    href={`/reservations/${reservation.reservation_id}/seat`}
                  >
                    Seat
                  </a>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default ReservationList;
