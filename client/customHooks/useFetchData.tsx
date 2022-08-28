import axios from "axios";
import { getCookie } from "cookies-next";
import { useRouter } from "next/router";

function useFetchData(api: string){
	const token = getCookie("jwt");
	if (!token) return;
	const route = useRouter();
	const data = async () => {
		try {
			const result = await axios.get(`http://localhost:5000/${api}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
				withCredentials: true,
			});
			if (result.data)
				route.push('/profile');
		} catch (err) {
            return err;
		}
	};
	return data();
};

export default useFetchData;
