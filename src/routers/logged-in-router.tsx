import React from "react";
import { gql } from "@apollo/client";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { Restaurants } from "../pages/client/restaurants";
import { Header } from "../components/header";
import { useMe } from "../hooks/useMe";
import { ConfirmEmail } from "../pages/user/confirm-email";
import { EditProfile } from "../pages/user/edit-profile";
import { Search } from "../pages/client/search";

const ClientRoutes = [
  <>
    <Route key={1} path='/' exact>
      <Restaurants />
    </Route>
    <Route key={2} path='/confirm' exact>
      <ConfirmEmail />
    </Route>
    <Route key={3} path='/edit-profile' exact>
      <EditProfile />
    </Route>
    <Route key={4} path='/search' exact>
      <Search />
    </Route>
  </>,
];

export const LoggedInRouter = () => {
  const { data, loading, error } = useMe();

  if (!data || loading || error) {
    return (
      <div className='h-screen flex justify-center items-center'>
        <span className='font-medium text-xl tracking-wide'>Loading....</span>
      </div>
    );
  }
  return (
    <Router>
      <Header />
      <Switch>
        {data.me.role === "Client" && ClientRoutes}
        {/* <Redirect to='/' /> */}
      </Switch>
    </Router>
  );
};
