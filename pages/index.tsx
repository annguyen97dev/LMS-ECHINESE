import Dashboard from '~/pages/dashboard';
import LayoutBase from '~/components/LayoutBase';
import NewsFeed from '~/components/Global/NewsFeed/NewsFeed';
import { useWrap } from '~/context/wrap';
import React, { useState, useEffect } from 'react';

function Home() {
	const { userInformation } = useWrap();
	// const [session, loading] = useSession();
	// console.log("Session in index: ", session);

	// if (loading) return ".....loading";

	// if (!session) {
	//   signIn();
	// }

	// useEffect(() => {

	// },[]);

	return (
		<>
			<NewsFeed />
		</>
	);
}

Home.layout = LayoutBase;

export default Home;
