import React, { Fragment, useEffect, useState } from 'react';
import CourseExamAdmin from '~/components/Global/CourseExam/CourseExamAdmin';

import LayoutBase from '~/components/LayoutBase';
import TitlePage from '~/components/TitlePage';

const CourseExam = () => {
	return (
		<>
			<TitlePage title="Bài tập-kiểm tra" />
			<CourseExamAdmin />;
		</>
	);
};
CourseExam.layout = LayoutBase;
export default CourseExam;
