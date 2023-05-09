import React, { useEffect, useState } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { createReservation } from "../utils/api";

/**
 * Defines the "Table" page for a new table.
 *
 * @returns {JSX.Element}
 */

function NewTable() {
  const history = useHistory();
  return (
    <main>
      <h1>Hooray new Table!</h1>
      <form>
        <input name="table_name" minLength={2} required />
        <input
          name="capacity"
          type="number"
          min="1"
          step="1"
          placeholder="1"
          required
        />
        <button type="submit" name="submit">
          Submit
        </button>
        <button name="cancel" onClick={() => history.goBack()}>
          Cancel
        </button>
      </form>
    </main>
  );
}

export default NewTable;
