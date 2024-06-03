import React, { useEffect, useState } from "react";
import { listReservations, listTables, unseatTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import useQuery from "../utils/useQuery";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import { today, previous, next } from "../utils/date-time";
import ReservationList from "../reservations/ReservationList";
import LoadingSpinner from "../components/LoadingSpinner"; // Import the new spinner component

function Dashboard() {
  const [dateString, setDateString] = useState(today());
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);
  const [loading, setLoading] = useState(false); // State for loading spinner
  const [reload, setReload] = useState(false);
  const [abortController, setAbortController] = useState(null);

  const query = useQuery();
  const queryDateString = query.get("date");

  useEffect(() => {
    if (queryDateString) {
      setDateString(queryDateString);
    }
  }, [queryDateString]);

  useEffect(() => {
    return () => {
      if (abortController) {
        abortController.abort();
      }
    };
  }, [abortController]);

  useEffect(() => {
    setLoading(true); // Show spinner when loading starts
    loadDashboard().finally(() => setLoading(false)); // Hide spinner when loading finishes
  }, [dateString, reload]);

  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function loadDashboard() {
    const abortController = new AbortController();
    setAbortController(abortController);
    setReservationsError(null);
    setTablesError(null);

    try {
      await delay(10000);
      const reservations = await listReservations(
        { date: dateString },
        abortController.signal
      );
      setReservations(reservations);
      const tables = await listTables({}, abortController.signal);
      setTables(tables);
    } catch (error) {
      if (error.name !== "AbortError") {
        setReservationsError(error);
        setTablesError(error);
      }
    } finally {
      setLoading(false);
    }
  }

  function handleFinish(table_id) {
    if (
      window.confirm(
        "Is this table ready to seat new guests? This cannot be undone."
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
      <LoadingSpinner
        visible={loading}
        messages={[
          "Loading...",
          "Still loading...",
          "Downside of using free tier...",
          "Just a moment...",
          "Almost there...",
        ]}
      />
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3 justify-content-between mt-1">
        <h4 className="d-flex justify-content-center align-items-center mb-0">
          Reservations for {dateString}
        </h4>
        <div className="d-flex justify-content-center">
          <Link
            className="btn btn-primary m-1"
            to={`/dashboard?date=${previous(dateString)}`}
          >
            Previous {previous(dateString)}
          </Link>
          <Link className="btn btn-primary m-1" to={`/reservations`}>
            Today {today()}
          </Link>
          <Link
            className="btn btn-primary m-1"
            to={`/dashboard?date=${next(dateString)}`}
          >
            Next {next(dateString)}
          </Link>
        </div>
      </div>
      <ErrorAlert error={reservationsError} />
      {reservations && reservations.length ? (
        <ReservationList reservations={reservations} setReload={setReload} />
      ) : (
        <p>No Reservations for {dateString}</p>
      )}
      <h2>Tables</h2>
      <ErrorAlert error={tablesError} />
      {!loading && tables && tables.length ? (
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Table Id</th>
              <th scope="col">Table Name</th>
              <th scope="col">Capacity</th>
              <th scope="col">Availability</th>
              <th scope="col">End?</th>
            </tr>
          </thead>
          <tbody>
            {tables.map((table, index) => {
              return (
                <tr key={table.table_id}>
                  <th scope="row">{table.table_id}</th>
                  <td>{table.table_name}</td>
                  <td>{table.capacity}</td>
                  <td data-table-id-status={table.table_id}>
                    {!table.reservation_id ? "Free" : "Occupied"}
                  </td>
                  <td>
                    {!table.reservation_id ? (
                      ""
                    ) : (
                      <button
                        data-table-id-finish={table.table_id}
                        onClick={() => handleFinish(table.table_id)}
                        className="btn btn-secondary"
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
        !loading && <p>No tables :/</p>
      )}
    </main>
  );
}

export default Dashboard;
