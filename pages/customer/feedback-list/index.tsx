import React from 'react';
import LayoutBase from '~/components/LayoutBase';
import TitlePage from '~/components/TitlePage';

const FeedbackList = () => {
	return (
		<div>
			<TitlePage title="Phản hồi" />
		</div>
	);
};

FeedbackList.layout = LayoutBase;
export default FeedbackList;
