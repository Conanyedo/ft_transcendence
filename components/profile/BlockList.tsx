import Image from "next/image";

import classes from "../../styles/BlockList.module.css";
import profile from "../../public/profileImage.png";

const Pendingfriend: React.FC<friendDataType> = (props) => {
	return (
		<div className={classes.friend}>
			<div className={classes.Avatar_name}>
				<div className={classes.avatar}>
					<Image src={props.Avatar} />
				</div>
				<div className={classes.friendName}>{props.fullName}</div>
			</div>
			<div className={`${classes.sendMsg}`}>Unblock</div>
		</div>
	);
};

interface friendDataType {
	Avatar: any;
	fullName: string;
}

const BlockList = () => {
	return (
		<div className={classes.listFriends}>
			<Pendingfriend fullName="Ayoub boulbaz" Avatar={profile} />
			<Pendingfriend fullName="molat dar" Avatar={profile} />
			<Pendingfriend fullName="Fati mart lklb" Avatar={profile} />
			<Pendingfriend fullName="l3alwa bon3ala" Avatar={profile} />
			<Pendingfriend fullName="mohamed l3lawi" Avatar={profile} />
			<Pendingfriend fullName="molat dar" Avatar={profile} />
			<Pendingfriend fullName="Fati mart lklb" Avatar={profile} />
			<Pendingfriend fullName="l3alwa bon3ala" Avatar={profile} />
		</div>
	);
};

export default BlockList;
