import Image from "next/image";
import { motion } from "framer-motion";

import UserSelected from "../../public/SelectedSideNav/ProfileSelected.svg";
import User from "../../public/SideNav/Profile.svg";

import LiveGameSelected from "../../public/SelectedSideNav/LiveGameSelected.svg";
import LiveGame from "../../public/SideNav/LiveGame.svg";

import ChatSelected from "../../public/SelectedSideNav/ChatSelected.svg";
import Chat from "../../public/SideNav/Chat.svg";

import GameSelected from "../../public/SelectedSideNav/GameSelected.svg";
import Game from "../../public/SideNav/Game.svg";

import Indicator from "../../public/indicator.svg";
import LogoutSelected from "../../public/SelectedSideNav/LogOutSelected.svg";
import Logout from "../../public/Logout.svg";
import Burger from "../../public/menu-burger.svg";

import classes from "../../styles/sideNav.module.css";
import Link from "next/link";
import { useRouter } from "next/router";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import {
	useInSideAlerter,
	useOutsideAlerter,
} from "../profile/ProfileInfoEdit";

interface N_ITEMS {
	alt: string;
	src: any;
	move: any;
	ref_ctn: MutableRefObject<null> | any;
	Toggle: (t: boolean) => void;
}

const ItemsNav: React.FC<N_ITEMS> = (props) => {
	const rout = useRouter();
	const ref = useRef(null);
	const moveHndler = () => {
		props.move(props.alt);
		rout.push(props.alt);
	};
	useInSideAlerter(ref, props.Toggle, moveHndler);
	return (
		<div className={classes.backIcons} onClick={moveHndler}>
			<div className={classes.IconsNav} ref={ref}>
				<Image alt={props.alt} src={props.src}></Image>
			</div>
		</div>
	);
};

function useOutside(ref: any, setToggle: (t: boolean) => void) {
	useEffect(() => {
		let width = 0;
		window.addEventListener("click", () => {
			width = window.innerWidth;
		});
		function handleClickOutside(event: any) {
			if (ref.current && !ref.current.contains(event.target))
				if (width < 600 && width !== 0) {
					setToggle(false);
				}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [ref]);
}

const Burger_test: React.FC<{
	Handler: (t: boolean) => void;
	value: boolean;
	ref_check: MutableRefObject<null>;
}> = (props) => {
	const handlerClick = () => {
		props.Handler(!props.value);
	};
	return (
		<label htmlFor="check" className={classes.label}>
			<input
				type="checkbox"
				id="check"
				className={classes.input}
				ref={props.ref_check}
				onClick={handlerClick}
			/>
			<span className={classes.span}></span>
			<span className={classes.span}></span>
			<span className={classes.span}></span>
		</label>
	);
};

const SideNav: React.FC<{
	onNav: (page: string) => void;
	currentPos: string;
}> = (props) => {
	const ref_nav = useRef(null);
	const ref_check = useRef(null);
	// const [menu, setMenuDisplay] = useState(classes.HideNav);
	const ctn = useRouter();
	const NamePage = "/" + ctn.pathname.split("/")[1];

	const handlerLogOut = () => props.onNav("/");
	const [isOpen, setIsOpen] = useState(false);

	const variants = {
		open: { opacity: 1, x: 0 },
		closed: { opacity: 0, x: "-100%" },
	};
	const ToggleAll = (value: boolean) => {
		setIsOpen(value);
		ref_check.current.checked = false;
	};
	useOutside(ref_nav, ToggleAll);
	const NAVITEMS: N_ITEMS[] = [
		{
			alt: "/profile",
			src: NamePage !== "/profile" ? User : UserSelected,
			move: props.onNav,
			ref_ctn: ref_nav,
			Toggle: ToggleAll,
		},
		{
			alt: "/live-games",
			src: NamePage !== "/live-games" ? LiveGame : LiveGameSelected,
			move: props.onNav,
			ref_ctn: ref_nav,
			Toggle: ToggleAll,
		},
		{
			alt: "/game",
			src: NamePage !== "/game" ? Game : GameSelected,
			move: props.onNav,
			ref_ctn: ref_nav,
			Toggle: ToggleAll,
		},
		{
			alt: "/chat",
			src: NamePage !== "/chat" ? Chat : ChatSelected,
			move: props.onNav,
			ref_ctn: ref_nav,
			Toggle: ToggleAll,
		},
	];
	return (
		<motion.div ref={ref_nav}>
			<div className={classes.burger}>
				<Burger_test
					Handler={setIsOpen}
					value={isOpen}
					ref_check={ref_check}
				/>
			</div>
			<motion.div
				animate={isOpen ? "open" : "closed"}
				variants={variants}
				className={`absolute top-0 left-0 bottom-0 ${classes.sidenav}`}
			>
				<div className={`${classes.sideItems}`}>
					{NAVITEMS.map((item) => (
						<ItemsNav
							move={item.move}
							alt={item.alt}
							src={item.src}
							ref_ctn={item.ref_ctn}
							Toggle={item.Toggle}
						/>
					))}
				</div>
				<div
					className={`${classes.backIcons} ${classes.logOut}`}
					onClick={handlerLogOut}
				>
					<Image
						src={NamePage === "/logout" ? LogoutSelected : Logout}
						width={34}
						height={34}
						style={{ backgroundColor: "#242426" }}
					/>
				</div>
			</motion.div>
			<div
				className={`absolute top-0 left-0 bottom-0 ${classes.sidenavInd}`}
			>
				<motion.div className={`${props.currentPos}`} animate="animate">
					<Image
						src={Indicator}
						width="8rem"
						height={28}
						style={{
							backgroundColor: "#242426",
						}}
					/>
				</motion.div>
			</div>
		</motion.div>
	);
};

export default SideNav;
