import React, { useEffect, useState } from "react";
import { updateReservationStatus } from "../utils/api";

function ReservationList({ reservations, setReload }) {
  const [errors, setErrors] = useState([]);
  const [abortController, setAbortController] = useState(null);

  useEffect(() => {
    return () => {
      if (abortController) {
        abortController.abort();
      }
    };
  }, [abortController]);

  function handleCancel(reservation) {
    if (
      window.confirm(
        "Do you want to cancel this reservation? This cannot be undone."
      )
    ) {
      cancelReservation(reservation);
    }
  }

  function cancelReservation(reservation_id) {
    const newAbortController = new AbortController();
    setAbortController(newAbortController);
    setErrors([]);
    updateReservationStatus(
      reservation_id,
      "cancelled",
      newAbortController.signal
    )
      .then(() => {
        setReload((previous) => !previous);
      })
      .catch((error) => setErrors([error.message]));
  }

  return (
    <table>
      {errors.length > 0 &&
        errors.map((error, index) => {
          return (
            <div className="alert alert-danger m-2" key={index}>
              {error}
            </div>
          );
        })}
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
          <th>Cancel?</th>
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
                {reservation.status === "booked" && (
                  <a
                    className="btn btn-secondary"
                    href={`/reservations/${reservation.reservation_id}/edit`}
                  >
                    Edit
                  </a>
                )}
              </td>
              <td>
                {reservation.status === "booked" && (
                  <a
                    className="btn btn-secondary"
                    href={`/reservations/${reservation.reservation_id}/seat`}
                  >
                    Seat
                  </a>
                )}
              </td>
              <td>
                {reservation.status === "booked" && (
                  <button
                    data-reservation-id-cancel={reservation.reservation_id}
                    className="btn btn-danger"
                    onClick={() => handleCancel(reservation.reservation_id)}
                  >
                    cancel {reservation.reservation_id}
                  </button>
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
