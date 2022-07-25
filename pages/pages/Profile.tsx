import { Link } from 'react-router-dom';

const Profile = () => {
	return (
		<div className='max-h'>
			<input type="text" placeholder="Search" className="search-input border-white ml-32 mt-10 font-light" />
			<div className='grid grid-cols-2 width-header border-blue-300 h-full gap-6'>
				<div className="section rounded-lg">
					&nbsp;
				</div>

				<div className="section rounded-lg">
					&nbsp;
				</div>
				<div className="section row-span-2 rounded-lg">
					&nbsp;
				</div>
				<div className="section row-span-2 rounded-lg">
					&nbsp;
				</div>
			</div>
		</div>

	);
}

export default Profile;