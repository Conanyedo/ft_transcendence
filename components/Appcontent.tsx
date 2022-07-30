import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import classes from "../styles/sideBar.module.css";
import SideBar from "./sideBar";
import Section from "./section";

const AppContent = (props: { elm: HTMLAllCollection }) => {
	return <Section elm={props.elm} />;
};

export default AppContent;
