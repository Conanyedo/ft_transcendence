import { achievementType } from "../Types/dataTypes";
import king from '../public/Achievements/King.svg';


export const AllAchievement: achievementType[] = [
	{
        id: 1,
		logo: king,
		title: "Welcome Winner",
		disc: "your first win in the game",
	},
	{
        id: 2,
		logo: king,
		title: "Serial Winner",
		disc: "won 10 matchs consecutively",
	},
	{
        id: 3,
		logo: king,
		title: "who's the boss",
		disc: "Taking the first place in rank",
	},
	{
        id: 4,
		logo: king,
		title: "Gold king",
		disc: "Reaching the gold tier",
	},
	{
        id: 5,
		logo: king,
		title: "Invincible",
		disc: "won 20 games successively",
	},
	{
        id: 6,
		logo: king,
		title: "Fly higher",
		disc: "reaching the level 5",
	},
];
