import { motion } from "framer-motion";
import classes from "../../styles/Search.module.css";
import Image from "next/image";
import profile from "../../public/AvatarChannel.png";

interface ChannelDataType {
	Avatar: any;
	fullName: string;
	type: string;
    isNew: boolean;
}

const Channel: React.FC<ChannelDataType> = (props) => {
	return (
		<div className={classes.Channel}>
			<div className={classes.Avatar_Channel}>
				<div className={classes.avatar}>
					<Image src={props.Avatar} />
				</div>
				<div className={classes.ChannelName}>{props.fullName}</div>
			</div>
			<div className={classes.Channeltype}>{props.type}</div>
			{props.isNew && <div className={classes.joinBtn}>
				{/* <Image src='#' /> */}
				Join
			</div> || <div className={classes.LeaveBtn}>
				{/* <Image src='#' /> */}
				Exit
			</div>}
		</div>
	);
};

const SearchChannelsList: React.FC = () => {
	return (
		<>
			<motion.div className={classes.SearchCTNIN}>
				<Channel fullName="One Piece" Avatar={profile} type="Public" isNew={false} />
				<Channel
					fullName="One Piece"
					Avatar={profile}
					type="Protected"
                    isNew={true}
				/>
				<Channel fullName="One Piece" Avatar={profile} type="Public" isNew={true}/>
				<Channel
					fullName="One Piece"
					Avatar={profile}
					type="Protected"
                    isNew={true}
				/>
				<Channel fullName="One Piece" Avatar={profile} type="Public" isNew={false}/>
				<Channel fullName="One Piece" Avatar={profile} type="Public" isNew={true}/>
			</motion.div>
		</>
	);
};

export default SearchChannelsList;
