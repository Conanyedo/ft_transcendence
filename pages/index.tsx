
import { useRouter } from "next/router";

const HomePage = () => {
	const router = useRouter();
	
	router.push("/profile");
	// console.log(router);

	return (
		<>
		</>
		// <Skeleton elm={<Profile />} />
		// <BrowserRouter>
		// 	<Skeleton
		// 		elm={
		// 			<Switch>
		// 				<Route exact path="/">
		// 					<Profile />
		// 				</Route>
		// 				<Route path="/profile/:id">
		// 					<p>Hello</p>
		// 					<ProfileFriend />
		// 				</Route>
		// 				<Route path="/live-games">
		// 					<Profile />
		// 				</Route>
		// 				<Route path="/game">
		// 					<Profile />
		// 				</Route>
		// 				<Route path="/chat">
		// 					<Profile />
		// 				</Route>
		// 				<Route path="/Logout">
		// 					<p>Good Bay!!!!</p>
		// 				</Route>
		// 			</Switch>
		// 		}
		// 	/>
		// </BrowserRouter>
	);
};

export default HomePage;
