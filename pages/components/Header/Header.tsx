import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import classes from "./Header.module.css";

const Header = () => {
  return (
    <div className={`absolute top-0 left-0 bottom-0 ${classes.sidenav}`}>
        <div className={`${classes.sidenav}`}>

        </div>
    </div>
  );
}

export default Header;