import { motion } from "framer-motion";
import classes from "../../styles/Search.module.css";
import Image from "next/image";
import profile from "../../public/AvatarChannel.png";
import { JoinChannel, LeaveChannel } from "../buttons";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { fetchDATA } from "@hooks/useFetchData";
import { getImageBySize } from "@hooks/Functions";

interface ChannelDataType {
	Avatar: string;
	title: string;
	type: string;
	member: boolean;
	refresh: any;
	convId: string;
}
const Channel: React.FC<ChannelDataType> = (props) => {
	const refresh = () => props.refresh();
	const router = useRouter();
	const pathImage = getImageBySize(props.Avatar, 70);
	return (
		<div className={classes.Channel}>
			<div className={classes.Avatar_Channel}>
				<div className={classes.avatar}>
					<img src={pathImage} />
				</div>
				<div className={classes.ChannelName}>{props.title}</div>
			</div>
			<div className={classes.Channeltype}>{props.type}</div>
			{(props.member && (
				<LeaveChannel
					id={props.convId}
					router={router}
					refresh={refresh}
				/>
			)) || (
				<JoinChannel
					type={props.type}
					name={props.title}
					id={props.convId}
					router={router}
					refresh={refresh}
				/>
			)}
		</div>
	);
};

const SearchChannelsList: React.FC<{value: string}> = (props) => {
	const router = useRouter();
	const [searchData, setSearchData] = useState<ChannelDataType[]>([]);
	const refresh = () => fetchDATA(
			setSearchData,
			router,
			`search/channels?search=${props.value}`
		);
	useEffect(() => {
		fetchDATA(
			setSearchData,
			router,
			`search/channels?search=${props.value}`
		);
		return () => {
			setSearchData([]);
		};
	}, [props.value]);
	return (
		<>
			<motion.div className={classes.SearchCTNIN}>
				{searchData.length === 0 && <p className={classes.userNotFound}>couldn't find anything with '{props.value}'</p>}
				{searchData.length !== 0 && searchData?.map((channel) => <Channel {...channel} key={channel.title} refresh={refresh} />)  }
			</motion.div>
		</>
	);
};

export default SearchChannelsList;
