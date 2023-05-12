import React, { useEffect, useState } from "react";
import { listReservations, listTables, unseatTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import useQuery from "../utils/useQuery";
import { useLocation, Link } from "react-router-dom/cjs/react-router-dom.min";
import { today, previous, next } from "../utils/date-time";

/**
 * Defines the dashboard page.
 * @param dateString
 *  the date in string format for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard() {
  const [dateString, setDateString] = useState(today());
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);
  const [reload, setReload] = useState(false);
  const [abortController, setAbortController] = useState(null);

  // console.log("passed in dateString is", dateString);

  const location = useLocation();
  const query = useQuery();
  const queryDateString = query.get("date");

  useEffect(() => {
    if (queryDateString) {
      setDateString(queryDateString);
    }
  }, [queryDateString]);

  useEffect(loadDashboard, [dateString, reload]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    // const date = dateString; // need this to pass in date as correct param to the api function call
    listReservations({ date: dateString }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    listTables({}, abortController.signal)
      .then(setTables)
      .catch(setTablesError);
    return () => abortController.abort();
  }
  // console.log(reservations);

  function handleFinish(table_id) {
    if (
      window.confirm(
        " Is this table ready to seat new guests? This cannot be undone."
      )
    ) {
      const newAbortController = new AbortController();
      setAbortController(newAbortController);
      setTablesError(null);
      unseatTable(table_id, newAbortController.signal)
        .then(() => setReload(!reload))
        .catch((error) => {
          setTablesError(error);
        });
    }
  }

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for {dateString}</h4>
        <h1>{}</h1>
        <div>
          <Link
            className="btn btn-primary"
            to={`/dashboard?date=${previous(dateString)}`}
          >
            Previous {previous(dateString)}
          </Link>
          <Link className="btn btn-primary" to={`/reservations`}>
            Today {today()}
          </Link>
          <Link
            className="btn btn-primary"
            to={`/dashboard?date=${next(dateString)}`}
          >
            Next {next(dateString)}
          </Link>
        </div>
      </div>
      <ErrorAlert error={reservationsError} />
      {/* this code below needs to change */}
      {reservations && reservations.length ? (
        // JSON.stringify(reservations)
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
                  <td>
                    <a
                      className="btn btn-secondary"
                      href={`/reservations/${reservation.reservation_id}/seat`}
                    >
                      Seat
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <p>No Reservations for {dateString}</p>
      )}
      <ErrorAlert error={tablesError} />
      {tables && tables.length ? (
        // JSON.stringify(tables)
        <table>
          <thead>
            <tr>
              <th>Table Id</th>
              <th>Table Name</th>
              <th>Capacity</th>
              <th>Availability</th>
              <th>End?</th>
            </tr>
          </thead>
          <tbody>
            {tables.map((table, index) => {
              return (
                <tr key={index}>
                  <td>{table.table_id}</td>
                  <td>{table.table_name}</td>
                  <td>{table.capacity}</td>
                  <td data-table-id-status={table.table_id}>
                    {!table.reservation_id ? "free" : "occupied"}
                  </td>
                  <td>
                    {!table.reservation_id ? (
                      ""
                    ) : (
                      <button
                        data-table-id-finish={table.table_id}
                        onClick={() => handleFinish(table.table_id)}
                      >
                        Finish
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <p>No tables :/</p>
      )}
    </main>
  );
}

export default Dashboard;
