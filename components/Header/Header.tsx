import React, { FormEventHandler, useEffect, useRef, useState } from "react";
import classes from "../../styles/Header.module.css";
import { Text } from "../../styles/styled-components";
import Image from "next/image";
import Search from "../../public/Icon.svg";
import Avatar from "../../public/profile.jpg";
import DownArrow from "../../public/Caret down.svg";
import { useRouter } from "next/router";

interface DATA {
	image: any;
	name: string;
	ntf: boolean;
}

const dataUser: DATA = {
	image: Avatar,
	name: "Halima Elgmal",
	ntf: true,
};

const Header = () => {
	const input = useRef(null);
	const router = useRouter();
	const searchHanler:FormEventHandler = (e) => {
		e.preventDefault();
		router.push({
			pathname: '/search',
			query: { search: `${input.current!.value}` },
		})
	}
	useEffect(() => {
		input.current!.value = (router.query.data) ? router.query.data : '';
	}, [input])

	const [userData] = useState<DATA>(dataUser);
	return (
		<div className={classes.topBar}>
			<div className={classes.tmpctn}>
				<div className={classes.inputContainer}>
					<Image src={Search} width={24} height={24} />
					<form className={classes.inputContainer} onSubmit={searchHanler}>
						<input
							ref={input}
							type="text"
							className={classes.searchInput}
							placeholder="Search"
						/>
					</form>
				</div>
				<div className={classes.avatarContainer}>
					<Image
						src={userData.image}
						width={36}
						height={36}
						style={{ borderRadius: "10px" }}
					/>
					<Text className={classes.userName}>{userData.name}</Text>

					<Image src={DownArrow} width={24} height={24} />
				</div>
			</div>
		</div>
	);
};

export default Header;
