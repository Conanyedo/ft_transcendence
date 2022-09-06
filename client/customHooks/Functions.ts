import { useEffect } from "react";
import { allRanks } from "../config/baseURL";

import unranked from '../public/Tiers/Unranked.svg';
import Jallou9 from '../public/Tiers/Jallou9.svg';
import Bronze from '../public/Tiers/Bronze.svg';
import Silver from '../public/Tiers/Silver.svg';
import Gold from '../public/Tiers/Gold.svg';
import { rankObj } from "../Types/dataTypes";

export function useOutsideAlerter(ref: any, setToggle: (t: boolean) => void) {
	useEffect(() => {
		function handleClickOutside(event: any) {
			if (ref.current && !ref.current.contains(event.target)) {
				setToggle(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [ref]);
}

export function useInSideAlerter(
	ref: any,
	setToggle: (t: boolean) => void,
	move: () => void
) {
	useEffect(() => {
		function handleClickOutside(event: any) {
			if (ref.current && ref.current.contains(event.target)) {
				move();
				setToggle(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [ref]);
}

export function getRankUser(GamePoint: number): rankObj {
	if (GamePoint <= 250)
		return {rank: allRanks[4], color: '#BEB5B6', tier: unranked};
	else if (GamePoint <= 500)
		return {rank: allRanks[3], color:'#82B3BF', tier: Jallou9};
	else if (GamePoint <= 800)
		return {rank: allRanks[2], color:'#BD8A65', tier:Bronze};
	else if (GamePoint < 1600)
		return {rank: allRanks[1], color:'#C2C4CD', tier:Silver};
	else if (GamePoint >= 1600)
		return {rank: allRanks[0], color:'#CFA365', tier:Gold};
	else
		return {rank: allRanks[4], color: '#BEB5B6', tier: unranked};
}