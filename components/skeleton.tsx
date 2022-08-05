import React from "react";
import AppContent from "./Appcontent";
import Header from "./Header/Header";
import classes from "../styles/sideBar.module.css";
import SideNav from "./Header/sideNav";

const Skeleton = (props: { elm: any }) => {
	// const pages = useRouter();
	const navBarHandler = (page: string) => {
		// console.log(page);
		// pages.push(`/${page}`);
	};

	return (
		<div className={classes["app-container"]}>
			<Header />
			<SideNav onNav={navBarHandler} />
			<AppContent elm={props.elm} />
		</div>
	);
};

export default Skeleton;
