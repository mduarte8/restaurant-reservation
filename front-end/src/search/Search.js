import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import ReservationList from "../reservations/ReservationList";

function Search() {
  const [mobileSearch, setMobileSearch] = useState("");
  const [abortController, setAbortController] = useState(null);
  const [errors, setErrors] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [noResultsFoundMessage, setNoResultsFoundMessage] = useState("");
  const [reload, setReload] = useState(false);

  useEffect(() => {
    return () => {
      if (abortController) {
        abortController.abort();
      }
    };
  }, [abortController]);

  // runs on page load, effectively lists all reservations
  useEffect(listSearchedReservations, [reload]);

  const handleChange = (event) => {
    const { value } = event.target;
    let formattedValue = value;
    const input = value.replace(/\D/g, "");
    if (input.length <= 3) {
      formattedValue = input;
    } else if (input.length <= 6) {
      formattedValue = `${input.slice(0, 3)}-${input.slice(3)}`;
    } else {
      formattedValue = `${input.slice(0, 3)}-${input.slice(3, 6)}-${input.slice(
        6,
        10
      )}`;
    }
    setMobileSearch(formattedValue);
  };

  function listSearchedReservations() {
    const newAbortController = new AbortController();
    setAbortController(newAbortController);
    setErrors([]);
    listReservations({ mobile_number: mobileSearch }, newAbortController.signal)
      .then((foundReservations) => {
        setReservations(foundReservations);
      })
      .catch((error) => setErrors([error.message]));
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    setNoResultsFoundMessage("No reservations found");
    listSearchedReservations();
  };

  return (
    <main>
      <h1>This is a Search!</h1>
      {errors.length > 0 &&
        errors.map((error, index) => {
          return (
            <div className="alert alert-danger m-2" key={index}>
              {error}
            </div>
          );
        })}
      <form onSubmit={handleSubmit} className="form-floating">
        <div className="form-floating">
          <input
            name="mobile_number"
            id="mobile_number"
            type="tel"
            placeholder="Enter a customer's phone number"
            pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
            value={mobileSearch}
            onChange={handleChange}
            className="form-control w-25"
            required
          />
          <label htmlFor="mobile_number">Search Phone Number</label>
        </div>
        <button type="submit" className="btn btn-primary mt-2 mb-2">
          Find
        </button>
      </form>
      {reservations && reservations.length ? (
        <ReservationList reservations={reservations} setReload={setReload} />
      ) : (
        noResultsFoundMessage
      )}
    </main>
  );
}

export default Search;
