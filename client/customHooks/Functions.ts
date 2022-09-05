import { useEffect } from "react";
import { allRanks } from "../config/baseURL";

import unranked from '../public/Tiers/Unranked.svg';
import Jallou9 from '../public/Tiers/Jallou9.svg';
import Bronze from '../public/Tiers/Bronze.svg';
import Silver from '../public/Tiers/Silver.svg';
import Gold from '../public/Tiers/Gold.svg';

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


export function getRankUser(GamePoint: number) {
	if (!GamePoint && GamePoint <= 250)
		return [allRanks[4], '#BEB5B6', unranked];
	else if (GamePoint <= 500)
		return [allRanks[3], '#82B3BF', Jallou9];
	else if (GamePoint <= 800)
		return [allRanks[2], '#BD8A65', Bronze];
	else if (GamePoint < 1600)
		return [allRanks[1], '#C2C4CD', Silver];
	else if (GamePoint >= 1600)
		return [allRanks[0], '#CFA365', Gold];
}