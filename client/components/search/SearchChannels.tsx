import { motion } from "framer-motion";
import classes from "../../styles/Search.module.css";
import Image from "next/image";
import profile from "../../public/AvatarChannel.png";
import { JoinChannel, LeaveChannel } from "../buttons";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

interface ChannelDataType {
	Avatar: any;
	title: string;
	type: string;
	member: boolean;
}

const Channel: React.FC<ChannelDataType> = (props) => {
	const refresh = () => {};
	const router = useRouter();
	return (
		<div className={classes.Channel}>
			<div className={classes.Avatar_Channel}>
				<div className={classes.avatar}>
					<img src={props.Avatar} />
				</div>
				<div className={classes.ChannelName}>{props.title}</div>
			</div>
			<div className={classes.Channeltype}>{props.type}</div>
			{(props.member && (
				<LeaveChannel
					login={props.title}
					router={router}
					refresh={refresh}
				/>
			)) || (
				<JoinChannel
					login={props.title}
					router={router}
					refresh={refresh}
				/>
			)}
		</div>
	);
};

const SearchChannelsList: React.FC = () => {
	const router = useRouter();
	const [searchData, setSearchData] = useState<ChannelDataType[]>([]);
	const refresh = () => {}
	useEffect(() => {
		// fetchDATA(setSearchData, router, '');
		return () => {
			setSearchData([]);
		}
	}, [])
	return (
		<>
			<motion.div className={classes.SearchCTNIN}>
				
			</motion.div>
		</>
	);
};

export default SearchChannelsList;
