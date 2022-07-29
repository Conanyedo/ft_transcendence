import {
	BrowserRouter,
	Switch,
	Route,
	Link,
	useHistory,
} from "react-router-dom";
import Profile from "./profile/profile";

import Skeleton from "../components/skeleton";

const HomePage = () => {
	

	return (
		<BrowserRouter>
			<Skeleton
				elm={
					<Switch>
						<Route exact path="/">
							<Profile />
						</Route>
						<Route path="/live-games">
							<Profile />
						</Route>
						<Route path="/game">
							<Profile />
						</Route>
						<Route path="/chat">
							<Profile />
						</Route>
						<Route path="/Logout">
							<p>Good Bay!!!!</p>
						</Route>
					</Switch>
				}
			/>
		</BrowserRouter>
	);
};

export default HomePage;
