import classes from "../../styles/FriendList.module.css";
import Image from "next/image";
import profile from "../../public/profileImage.png";

import Search from "../../public/Icon.svg";
import Message from "../../public/SelectedSideNav/ChatSelected.svg";
import Options from "../../public/LeaderBoard/Options.svg";

const FriendList = () => {
	return (
		<div className={classes.friends}>
			<div className={classes.friendHeader}>
				<div className={classes.btnCtn}>
					<div
						className={`${classes.btnFriend} ${classes.btnSelected}`}
					>
						Friend List
					</div>
					<div className={`${classes.btnFriend}`}>Pending</div>
					<div className={`${classes.btnFriend}`}>
						Blocked Accounts
					</div>
				</div>
			</div>
			<div className={classes.listFriends}>
				<div className={classes.friend}>
					<div className={classes.Avatar_name}>
						<div className={classes.avatar}>
							<Image src={profile} />
						</div>
						<div className={classes.friendName}>Anass Elmqas</div>
					</div>
					<div className={classes.statusFriend}>In Game</div>
					<div className={classes.optionFriend}>
						<div className={classes.sendMsg}>
							<Image src={Message} />
						</div>
						<div className={classes.sendMsg}>
							<Image src={Options} />
						</div>
					</div>
				</div>
                <div className={classes.friend}>
					<div className={classes.Avatar_name}>
						<div className={classes.avatar}>
							<Image src={profile} />
						</div>
						<div className={classes.friendName}>Anass Elmqas</div>
					</div>
					<div className={classes.statusFriend}>In Game</div>
					<div className={classes.optionFriend}>
						<div className={classes.sendMsg}>
							<Image src={Message} />
						</div>
						<div className={classes.sendMsg}>
							<Image src={Options} />
						</div>
					</div>
				</div>
                <div className={classes.friend}>
					<div className={classes.Avatar_name}>
						<div className={classes.avatar}>
							<Image src={profile} />
						</div>
						<div className={classes.friendName}>Anass Elmqas</div>
					</div>
					<div className={classes.statusFriend}>In Game</div>
					<div className={classes.optionFriend}>
						<div className={classes.sendMsg}>
							<Image src={Message} />
						</div>
						<div className={classes.sendMsg}>
							<Image src={Options} />
						</div>
					</div>
				</div>
                <div className={classes.friend}>
					<div className={classes.Avatar_name}>
						<div className={classes.avatar}>
							<Image src={profile} />
						</div>
						<div className={classes.friendName}>Anass Elmqas</div>
					</div>
					<div className={classes.statusFriend}>In Game</div>
					<div className={classes.optionFriend}>
						<div className={classes.sendMsg}>
							<Image src={Message} />
						</div>
						<div className={classes.sendMsg}>
							<Image src={Options} />
						</div>
					</div>
				</div>
                <div className={classes.friend}>
					<div className={classes.Avatar_name}>
						<div className={classes.avatar}>
							<Image src={profile} />
						</div>
						<div className={classes.friendName}>Anass Elmqas</div>
					</div>
					<div className={classes.statusFriend}>In Game</div>
					<div className={classes.optionFriend}>
						<div className={classes.sendMsg}>
							<Image src={Message} />
						</div>
						<div className={classes.sendMsg}>
							<Image src={Options} />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default FriendList;
