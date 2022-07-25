import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import classes from "./sideBar.module.css";
import SideBar from './sideBar';
import Section from "./section";

const AppContent = (props: {elm: HTMLAllCollection}) => {
  return (
    <div className={classes["app-content"]}>
        <SideBar />
        <Section elm={props.elm} />
    </div>
  );
}

export default AppContent;