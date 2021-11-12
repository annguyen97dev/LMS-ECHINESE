import React from 'react';
import { DoneTestProvider } from '~/context/useDoneTest';
import PackageResultDetail from '~/components/Global/Package/PackageResultDetail/PackageResultDetail';
import { DoingTestProvider } from '~/context/useDoingTest';
import CourseExamResult from '~/components/Global/CourseExam/CourseExamResult';
import LayoutBase from '~/components/LayoutBase';

const CourseExamResultStudentPage = () => {
	return (
		<>
			<DoingTestProvider>
				<DoneTestProvider>
					<CourseExamResult />
				</DoneTestProvider>
			</DoingTestProvider>
		</>
	);
};

CourseExamResultStudentPage.layout = LayoutBase;
export default CourseExamResultStudentPage;
