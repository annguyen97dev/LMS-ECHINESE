import React from 'react';
import LayoutBase from '~/components/LayoutBase';
import { DoneTestProvider } from '~/context/useDoneTest';
import { DoingTestProvider } from '~/context/useDoingTest';
import ServiceTestTeacherDetail from '~/components/Global/Customer/Service/Teacher/ServiceTestTeacherDetail';

const ServiceTestTeacherDetailPage = (props: any) => {
	return (
		<DoingTestProvider>
			<DoneTestProvider>
				<ServiceTestTeacherDetail />
			</DoneTestProvider>
		</DoingTestProvider>
	);
};
ServiceTestTeacherDetailPage.layout = LayoutBase;
export default ServiceTestTeacherDetailPage;
