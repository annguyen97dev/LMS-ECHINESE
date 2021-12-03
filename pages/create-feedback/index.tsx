import React, { useLayoutEffect, useState } from 'react';
import LayoutBase from '~/components/LayoutBase';
import { useWrap } from '~/context/wrap';
import StudentFeedbackList from '~/components/FeedBack/student-feed-back';

const CreateFeedback = () => {
	const { userInformation } = useWrap();

	return (
		<>
			{userInformation !== null && userInformation.RoleID === 6 && (
				<>
					<StudentFeedbackList />
				</>
			)}
		</>
	);
};

CreateFeedback.layout = LayoutBase;
export default CreateFeedback;
