import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import SearchComponent from "../../components/search/search";

const Search = () => {
	const router = useRouter();
	const [value, setValue] = useState('');
	const { search } = router.query;
	useEffect(() => {
		setValue(search as string);
	}, [search])
	return (
			<SearchComponent value={value} />
	);
};
export default Search;
