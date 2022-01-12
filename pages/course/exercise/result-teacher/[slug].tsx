import React from 'react';
import LayoutBase from '~/components/LayoutBase';
import { DoneTestProvider } from '~/context/useDoneTest';
import { DoingTestProvider } from '~/context/useDoingTest';
import ResultTeacherDetail from '~/components/Global/CourseList/CourseListDetail/Homework/ResultTeacherDetail';

const ServiceTestTeacherDetailPage = (props: any) => {
	return (
		<DoingTestProvider>
			<DoneTestProvider>
				<ResultTeacherDetail />
			</DoneTestProvider>
		</DoingTestProvider>
	);
};
ServiceTestTeacherDetailPage.layout = LayoutBase;
export default ServiceTestTeacherDetailPage;
