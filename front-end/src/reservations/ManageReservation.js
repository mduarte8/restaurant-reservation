import React, { useEffect, useState } from "react";
import { Link, useHistory, useLocation, useParams } from "react-router-dom";
import { readReservation, listTables } from "../utils/api";
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
  const [slectedTable, setSelectedTable] = useState({
    table_id: null,
  });

  useEffect(() => {
    return () => {
      if (abortController) {
        abortController.abort();
      }
    };
  }, [abortController]);

  //   const [dateString, setDateString] = useState(today());

  //   console.log("passed in dateString is", dateString);

  //   const queryDateString = query.get("date");

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
      .then(setTables)
      .catch(setTablesError);
    return () => abortController.abort();
  }

  const handleChange = (event) => {
    const { value } = event.target;
    console.log("event.target is", event.target);
    console.log("value is", value);
    let formattedTableId = parseInt(value); // take table_id from value of option, force it to be type int
    console.log("formattedTableId is", formattedTableId);
    setSelectedTable({ table_id: formattedTableId });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // console.log("errors is", errors);
    // console.log("errors.length is", errors.length);
    // to push to database here
    // need to format reservation time using utils/format-reservationtime, as well as reservation-date
    // if (validateInputs()) {
    //   createNewTable(formData);
    // }
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
          <tr>
            <th>Reservation ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Phone #</th>
            <th>Reservation Date</th>
            <th>Reservation Time</th>
            <th>Party Size</th>
          </tr>
          <tr>
            <td>{reservation.reservation_id}</td>
            <td>{reservation.first_name}</td>
            <td>{reservation.last_name}</td>
            <td>{reservation.mobile_number}</td>
            <td>{reservation.reservation_date}</td>
            <td>{reservation.reservation_time}</td>
            <td>{reservation.people}</td>
          </tr>
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
            {tables.map((table, index) => {
              return (
                //   <tr key={index}>
                //     <td>{table.table_id}</td>
                //     <td>{table.table_name}</td>
                //     <td>{table.capacity}</td>
                //     <td>{!table.reservation_id ? "Open" : "Occupied"}</td>
                //   </tr>
                <option value={table.table_id}>
                  {table.table_name} - {table.capacity} from {table.table_id}
                </option>
              );
            })}
          </select>
          <button type="submit">Submit</button>
        </form>
      ) : (
        <p>No tables :/</p>
      )}
    </main>
  );
}

export default ManageReservation;
