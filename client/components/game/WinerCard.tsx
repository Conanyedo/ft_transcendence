import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getImageBySize } from "../../customHooks/Functions";
import { fetchDATA } from "../../customHooks/useFetchData";
import classes from "../../styles/Game.module.css";
import { EmtyUser, UserTypeNew } from "../../Types/dataTypes";

const WinerCard: React.FC<any> = (props) => {
	const router = useRouter();
	const [UserData, setUserData] = useState<UserTypeNew>(EmtyUser);
	useEffect(() => {
		if (props.showWinner)
			fetchDATA(setUserData, router, `user/info/${props.showWinner}`);
	}, [props.showWinner]);
	const pathImage = getImageBySize(UserData?.avatar, 220);
	return (
		<>
			<div className={classes.BackGround}>
				<div className={classes.avatar}>
					<img src={pathImage} />
				</div>
				<h1>{UserData.fullname}</h1>
				<h2>Winner</h2>
			</div>
		</>
	);
};

export default WinerCard;
