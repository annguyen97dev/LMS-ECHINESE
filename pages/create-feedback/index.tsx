import React, { useLayoutEffect, useState } from 'react';
import { Select, Modal, Popover, Input } from 'antd';
import Link from 'next/link';
import { Filter, Eye, CheckCircle } from 'react-feather';
import { Tooltip } from 'antd';
import LayoutBase from '~/components/LayoutBase';
import { FeedbackApi } from '~/apiBase';
import FeedbackTable from '~/components/FeedbackTable';
import { useWrap } from '~/context/wrap';
import StudentFeedbackList from '~/components/FeedBack/student-feed-back';
import { FeedbackCategoryApi } from '~/apiBase/feed-back-category';

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
