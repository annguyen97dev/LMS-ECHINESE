import React from 'react';
import LayoutBase from '~/components/LayoutBase';
import { DoneTestProvider } from '~/context/useDoneTest';
import PackageResultDetail from '~/components/Global/Package/PackageResultDetail/PackageResultDetail';
import { DoingTestProvider } from '~/context/useDoingTest';
import ExamAppointmentResult from '~/components/Global/ExamAppointment/ExamAppointmentResult';

const ServiceTestStudentDetail = (props: any) => {
	return (
		<DoingTestProvider>
			<DoneTestProvider>
				<ExamAppointmentResult />
			</DoneTestProvider>
		</DoingTestProvider>
	);
};
ServiceTestStudentDetail.layout = LayoutBase;
export default ServiceTestStudentDetail;
