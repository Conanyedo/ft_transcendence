import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import AppContent from "../components/Appcontent";
import Header from "../components/Header/Header";
import classes from "../components/sideBar.module.css";

const Skeleton = (props: { elm: any}) => {
  return (
    <div className={classes["app-container"]}>
        <Header />
        <AppContent elm={props.elm}/>
    </div>
  );
}

export default Skeleton;