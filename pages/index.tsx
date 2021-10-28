import Dashboard from '~/pages/dashboard';
import LayoutBase from '~/components/LayoutBase';
import NewsFeed from '~/components/Global/NewsFeed/NewsFeed';

function Home() {
	// const [session, loading] = useSession();
	// console.log("Session in index: ", session);

	// if (loading) return ".....loading";

	// if (!session) {
	//   signIn();
	// }
	return (
		<>
			{/* <Dashboard /> */}
			<NewsFeed />
		</>
	);
}

Home.layout = LayoutBase;

export default Home;
