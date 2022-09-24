import { useState } from "react";
import classes from "../../styles/Search.module.css";
import { motion } from "framer-motion";
import SearchUserList from "./SearchUser";
import SearchChannelsList from "./SearchChannels";

const SearchComponent: React.FC<{value: string}> = (props) => {
	const [overUsers, setOverUsers] = useState(true);

	const showOverView = () => setOverUsers(true)

	const hideOverView = () => setOverUsers(false)

    let underLineOverView = overUsers ? classes.overViewbtn : " ";
	let underLinefriends = !overUsers ? classes.FriendsBtn : " ";
	let classesIndic = (!overUsers && classes.IndicChannel) || classes.Indic;
	return (
		<div className={classes.SearchCTN}>
			<div className={classes.navView}>
				<div
					className={`${classes.TitleOverView}  ${underLineOverView}`}
					onClick={showOverView}
				>
					Users
				</div>
				<div
					className={`${classes.TitleOverView} ${underLinefriends} `}
					onClick={hideOverView}
				>
					Channels
				</div>
			</div>
            <div className={classes.ctnIndic}>
				<motion.div
					animate="animate"
					className={classesIndic}
				></motion.div>
			</div>
            {overUsers && <SearchUserList {...props}/>}
            {!overUsers && <SearchChannelsList {...props}/>}
		</div>
	);
};

export default SearchComponent;
