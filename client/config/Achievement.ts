import { achievementType } from "../Types/dataTypes";
import king from '../public/Achievements/King.svg';
import boss from '../public/Achievements/boss.svg';
import Fly_higher from '../public/Achievements/Fly_higher.svg';
import Invincible from '../public/Achievements/Invincible.svg';
import Welcome_winner from '../public/Achievements/Welcome_winner.svg';


export const AllAchievement: achievementType[] = [
	{
        id: 1,
		logo: Welcome_winner,
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
		logo: Invincible,
		title: "Invincible",
		disc: "won 20 games successively",
	},
	{
				id: 4,
		logo: Fly_higher,
		title: "Fly higher",
		disc: "reaching the level 5",
	},
	{
				id: 5,
		logo: king,
		title: "Gold king",
		disc: "Reaching the gold tier",
	},
	{
        id: 6,
		logo: boss,
		title: "who's the boss",
		disc: "Taking the first place in rank",
	},
];
