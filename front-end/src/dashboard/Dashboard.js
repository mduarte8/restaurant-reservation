import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import useQuery from "../utils/useQuery";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";
import { today } from "../utils/date-time";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

  const location = useLocation();
  const query = useQuery();
  const queryDate = query.get("date");
  if (queryDate) {
    date = queryDate;
  }
  // } else {
  //   date = "2020-12-31";
  // }
  if (!date) date = today();
  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }
  // console.log(reservations);

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for {date}</h4>
      </div>
      <ErrorAlert error={reservationsError} />
      {/* this code below needs to change */}
      {reservations && reservations.length ? (
        JSON.stringify(reservations)
      ) : (
        <p>No Reservations for {date}</p>
      )}
    </main>
  );
}

export default Dashboard;
