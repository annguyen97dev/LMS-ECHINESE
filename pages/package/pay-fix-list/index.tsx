import React, { useEffect, useState } from 'react';
import PayFixList from '~/components/Global/Package/PayFixExam/PayFixList';
import LayoutBase from '~/components/LayoutBase';

const PayFixListPage = () => {
	return (
		<>
			<PayFixList />
		</>
	);
};

PayFixListPage.layout = LayoutBase;
export default PayFixListPage;
