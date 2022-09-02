import { useEffect } from "react";
import { allRanks } from "../config/baseURL";

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


export function getRankUser(GamePoint: number) { // TODO get tiers also
	if (GamePoint < 250)
		return [allRanks[4], '#BEB5B6'];
	else if (GamePoint < 500)
		return [allRanks[3], '#82B3BF'];
	else if (GamePoint < 800)
		return [allRanks[2], '#BD8A65'];
	else if (GamePoint < 1600)
		return [allRanks[1], '#C2C4CD'];
	else
		return [allRanks[0], '#CFA365'];
}