import classes from "../../../styles/BlockList.module.css";
import { useEffect, useState } from "react";
import { UserType } from "../../../Types/dataTypes";
import axios from "axios";
import { useRouter } from "next/router";

const Pendingfriend: React.FC<friendDataType> = (props) => {
	const route = useRouter();
	const Clickhandler = () => route.push('/profile/' + props.id);
	return (
		<div className={classes.friend}>
			<div className={classes.Avatar_name} onClick={Clickhandler} >
				<div className={classes.avatar}>
					<img src={props.Avatar} />
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
	id:number;
}

const BlockList = () => {
	const [listblock, setListblock] = useState<UserType[]>();
	let users:UserType[] = [];
	useEffect(() => {
		const fetchData = async () => {
			const data = await axios
				.get("https://test-76ddc-default-rtdb.firebaseio.com/friend.json")
				.then((res) => {
					const entries = Object.entries(res.data);
					entries.map((user) => {
						users.push(user[1]);
					});
					setListblock(users);
				});
		};
		if (!listblock) fetchData();
	}, []);


	return (
		<div className={classes.listFriends}>
			{
				listblock?.map((user) => <Pendingfriend key={user.id} fullName={user.fullName} Avatar={user.avatar} id={user.id} />)
			}{
				listblock?.map((user) => <Pendingfriend key={user.id} fullName={user.fullName} Avatar={user.avatar} id={user.id} />)
			}{
				listblock?.map((user) => <Pendingfriend key={user.id} fullName={user.fullName} Avatar={user.avatar} id={user.id} />)
			}{
				listblock?.map((user) => <Pendingfriend key={user.id} fullName={user.fullName} Avatar={user.avatar} id={user.id} />)
			}{
				listblock?.map((user) => <Pendingfriend key={user.id} fullName={user.fullName} Avatar={user.avatar} id={user.id} />)
			}{
				listblock?.map((user) => <Pendingfriend key={user.id} fullName={user.fullName} Avatar={user.avatar} id={user.id} />)
			}{
				listblock?.map((user) => <Pendingfriend key={user.id} fullName={user.fullName} Avatar={user.avatar} id={user.id} />)
			}{
				listblock?.map((user) => <Pendingfriend key={user.id} fullName={user.fullName} Avatar={user.avatar} id={user.id} />)
			}{
				listblock?.map((user) => <Pendingfriend key={user.id} fullName={user.fullName} Avatar={user.avatar} id={user.id} />)
			}
		</div>
	);
};

export default BlockList;
