import { Link, useHistory } from "react-router-dom";
import React, { useRef, useState } from "react";
import AppContent from "../components/Appcontent";
import Header from "./Header/Header";
import classes from "../components/sideBar.module.css";
import SideNav from "./Header/sideNav";


const Skeleton = (props: { elm: any}) => {
	const pages = useHistory();
	const navBarHandler = (page: string) => {
		pages.push(`/${page}`);
	}

  return (
	<div className={classes["app-container"]}>
		<Header />
		<SideNav onNav={navBarHandler} />
		<AppContent elm={props.elm}/>
	</div>
  );
}

export default Skeleton;