import React from "react";

import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NewReservation from "../reservations/NewReservation";
import NotFound from "./NotFound";
import useQuery from "../utils/useQuery";
import NewTable from "../tables/NewTable";
import Search from "../search/Search";

import { today } from "../utils/date-time";
import ManageReservation from "../reservations/ManageReservation";

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {
  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact path="/reservations/:reservation_id/seat">
        <ManageReservation />
      </Route>
      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact path="/reservations/new">
        <NewReservation />
      </Route>
      {/* May need an exact path below */}
      <Route exact path="/dashboard">
        {/* taking out date={today()} */}
        <Dashboard />
      </Route>
      <Route exact path="/tables/new">
        <NewTable />
      </Route>
      <Route exact path="/search">
        <Search />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
