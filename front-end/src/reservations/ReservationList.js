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
    <>
      {errors.length > 0 &&
        errors.map((error, index) => {
          return (
            <div className="alert alert-danger m-2" key={index}>
              {error}
            </div>
          );
        })}
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Reservation ID</th>
            <th scope="col">First Name</th>
            <th scope="col">Last Name</th>
            <th scope="col">Phone #</th>
            <th scope="col">Reservation Date</th>
            <th scope="col">Reservation Time</th>
            <th scope="col">Party Size</th>
            <th scope="col">Status</th>
            <th scope="col">Edit</th>
            <th scope="col">Seat</th>
            <th scope="col">Cancel?</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((reservation, index) => {
            return (
              <tr key={reservation.reservation_id}>
                <th scope="row">{reservation.reservation_id}</th>
                <td>{reservation.first_name}</td>
                <td>{reservation.last_name}</td>
                <td>{reservation.mobile_number}</td>
                <td>{reservation.reservation_date}</td>
                <td>{reservation.reservation_time}</td>
                <td>{reservation.people}</td>
                <td
                  data-reservation-id-status={`${reservation.reservation_id}`}
                >
                  {reservation.status.charAt(0).toUpperCase() +
                    reservation.status.slice(1)}
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
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}

export default ReservationList;
