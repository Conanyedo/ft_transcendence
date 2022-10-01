import GameLobby from "@components/game/GameLobby";
import LoadingElm from "@components/loading/Loading_elm";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";


const LobbyPage = () => {
	const router = useRouter();
	const [id, setId] = useState('');
	const { gameID } = router.query;


	useEffect(() => {
		if (gameID) setId(gameID as string);
	}, [gameID]);

	if (id === '') return <LoadingElm />

	return (
		<>
			{id !== '' && <GameLobby GameID={id} />}
		</>
	);
};
export default LobbyPage;