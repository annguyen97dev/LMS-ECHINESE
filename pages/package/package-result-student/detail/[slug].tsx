import React from 'react';
import LayoutBase from '~/components/LayoutBase';
import { DoneTestProvider } from '~/context/useDoneTest';
import PackageResultDetail from '~/components/Global/Package/PackageResultDetail/PackageResultDetail';
import { DoingTestProvider } from '~/context/useDoingTest';
import PackageResultStudentDetail from '~/components/Global/Package/PackageResultDetail/PackageResultStudentDetail';

const PackageSetDetailResult = (props: any) => {
	return (
		<DoingTestProvider>
			<DoneTestProvider>
				<PackageResultStudentDetail />
			</DoneTestProvider>
		</DoingTestProvider>
	);
};
PackageSetDetailResult.layout = LayoutBase;
export default PackageSetDetailResult;
