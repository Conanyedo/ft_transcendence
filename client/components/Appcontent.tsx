import React, { useRef, useState } from "react";
import Section from "./section";

const AppContent = (props: { elm: HTMLAllCollection }) => {
	return <Section elm={props.elm} />;
};

export default AppContent;
