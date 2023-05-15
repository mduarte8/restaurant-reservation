import React, { useEffect, useState } from "react";
import { Link, useHistory, useLocation, useParams } from "react-router-dom";
import { readReservation, listTables, seatTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
/**
 * Defines the page for to seat a reservation.
 *
 * @returns {JSX.Element}
 */

function ManageReservation() {
  const history = useHistory();
  const location = useLocation();
  //   const query = useQuery();
  const { reservation_id } = useParams();

  const [errors, setErrors] = useState([]);
  const [abortController, setAbortController] = useState(null);
  const [reservation, setReservation] = useState([]);
  const [reservationError, setReservationError] = useState(null);
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);
  const [selectedTable, setSelectedTable] = useState(null);

  useEffect(() => {
    return () => {
      if (abortController) {
        abortController.abort();
      }
    };
  }, [abortController]);

  useEffect(loadManageReservation, [reservation_id]);

  function loadManageReservation() {
    const abortController = new AbortController();
    setReservationError(null);
    // const date = dateString; // need this to pass in date as correct param to the api function call
    // NEED TO CREATE readReservation
    readReservation({ reservation_id }, abortController.signal)
      .then(setReservation)
      .catch(setReservationError);
    listTables({}, abortController.signal)
      .then((tables) => {
        setTables(tables);
        if (tables.length > 0) {
          setSelectedTable(tables[0].table_id); // IMPORTANT! corresponds to first option that comes back i.e. default first listed option in selector drop dow
        }
      })
      .catch(setTablesError);
    return () => abortController.abort();
  }

  const handleChange = (event) => {
    const { value } = event.target;
    let formattedTableId = parseInt(value); // take table_id from value of option, force it to be type int
    setSelectedTable(formattedTableId);
  };

  function validateInputs(table) {
    let errorMessages = [];
    if (table.capacity < reservation.people) {
      errorMessages.push(
        "table capacity smaller than party size. Choose another table"
      );
      return false;
    }
    return true;
  }

  function seatReservationAtTable(table) {
    const newAbortController = new AbortController();
    setAbortController(newAbortController);
    setErrors([]);
    setReservationError(null);
    setTablesError(null);
    seatTable(table.table_id, reservation_id, newAbortController.signal)
      .then((seatedTable) => {
        history.push("/dashboard");
      })
      .catch((error) => setErrors([error.message]));

    // createTable(tableData, newAbortController.signal)
    //   .then((createdTable) => {
    //     history.push(`/dashboard`); // need to wait for table to be created and promise to resolve
    //   })
    //   .catch((error) => setErrors([error.message]));
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const submitErrors = [];
    const foundTable = tables.find((table) => table.table_id === selectedTable);
    if (validateInputs(foundTable)) {
      seatReservationAtTable(foundTable);
    }
  };

  return (
    <main>
      <h1>Seat This Reservation!</h1>
      {/* {reservationError &&
        reservationError.map((error, index) => {
          return (
            <div className="alert alert-danger m-2" key={index}>
              {error}
            </div>
          );
        })} */}
      <ErrorAlert error={reservationError} />
      {reservation ? (
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
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{reservation.reservation_id}</td>
              <td>{reservation.first_name}</td>
              <td>{reservation.last_name}</td>
              <td>{reservation.mobile_number}</td>
              <td>{reservation.reservation_date}</td>
              <td>{reservation.reservation_time}</td>
              <td>{reservation.people}</td>
            </tr>
          </tbody>
        </table>
      ) : (
        <p>No Reservations for {reservation_id}</p>
      )}
      {/* {tablesError &&
        tablesError.map((error, index) => {
          return (
            <div className="alert alert-danger m-2" key={index}>
              {error}
            </div>
          );
        })} */}
      <ErrorAlert error={tablesError} />
      {errors.length > 0 &&
        errors.map((error, index) => {
          return (
            <div className="alert alert-danger m-2" key={index}>
              {error}
            </div>
          );
        })}
      {tables && tables.length ? (
        // JSON.stringify(tables)
        <form onSubmit={handleSubmit}>
          <select name="table_id" onChange={handleChange}>
            {/* <option value="">Select a table</option> */}
            {tables.map((table, index) => {
              return (
                //   <tr key={index}>
                //     <td>{table.table_id}</td>
                //     <td>{table.table_name}</td>
                //     <td>{table.capacity}</td>
                //     <td>{!table.reservation_id ? "Open" : "Occupied"}</td>
                //   </tr>
                <option value={table.table_id} key={table.table_id}>
                  {table.table_name} - {table.capacity}
                </option>
              );
            })}
          </select>
          <button type="submit">Submit</button>
          <button onClick={() => history.goBack()}>Cancel</button>
        </form>
      ) : (
        <p>No tables :/</p>
      )}
    </main>
  );
}

export default ManageReservation;
