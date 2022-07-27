import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import Profile from "./Profile";
import UserPage from "./user";

import Skeleton from "../Layout/skeleton";

const HomePage = () => {
	return (
		<BrowserRouter>
			<Skeleton
				elm={
					<Switch>
						<Route exact path="/Profile">
							<Profile />
						</Route>
						<Route path="/LiveGames">
							<UserPage />
						</Route>
						<Route path="/Game">
							<UserPage />
						</Route>
						<Route path="/Chat">
							<UserPage />
						</Route>
						<Route path="/Logout">
							<UserPage />
						</Route>
						<Route path="/*">
							<Profile />
						</Route>
					</Switch>
				}
			/>
		</BrowserRouter>
	);
};

export default HomePage;
