import profile from "./profile.png";
import Image, { StaticImageData } from "next/image";
import classes from "./userInfo.module.css";
import { useState } from "react";

export interface User {
	name: string;
	src: StaticImageData;
	alt: string;
}

const DUMMYUSER: User = {
	name: "Younness booooot",
	src: profile,
	alt: "Younness bouddou",
};

const UserTopInfo = () => {
	const [data] = useState(DUMMYUSER);
	return (
		<div className="p-3 ox6 pt-2 usertopinfo">
			<div className={classes["cnt-img"]}>
				<Image
					className={classes["cnt-img"]}
					src={data.src}
					alt={data.alt}
					width={34}
					height={34}
				/>
			</div>
			<p className={classes.name}>{data.name}</p>
		</div>
	);
};

export default UserTopInfo;
