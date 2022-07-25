import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import Profile from "./Profile";
import UserPage from "./user";
import SideBar from "../components/sideBar";
import OverView from '../Layout/overView'

const HomePage = () => {
  return (
    <BrowserRouter>
      <OverView elm={
        <Switch>
          <Route exact path="/">
            <Profile />
          </Route>
          <Route path="/users">
            <UserPage />
          </Route>
        </Switch>
      }/>
    </BrowserRouter>
  );
};

export default HomePage;
