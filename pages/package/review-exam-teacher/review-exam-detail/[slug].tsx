import React from 'react';
import LayoutBase from '~/components/LayoutBase';
import { DoneTestProvider } from '~/context/useDoneTest';
import PackageResultDetail from '~/components/Global/Package/PackageResultDetail/PackageResultDetail';
import { DoingTestProvider } from '~/context/useDoingTest';

const ReviewExamDetail = (props: any) => {
	return (
		<DoingTestProvider>
			<DoneTestProvider>
				<PackageResultDetail />
			</DoneTestProvider>
		</DoingTestProvider>
	);
};
ReviewExamDetail.layout = LayoutBase;
export default ReviewExamDetail;
