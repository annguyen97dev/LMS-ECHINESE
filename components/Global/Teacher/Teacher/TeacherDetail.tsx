import ProfileBase from '~/components/Profile';

import LayoutBase from '~/components/LayoutBase';
import {useRouter} from 'next/router';

const TeacherDetail = () => {
	const router = useRouter();
	const slug = router.query.slug;
	return <ProfileBase />;
};
export default TeacherDetail;
