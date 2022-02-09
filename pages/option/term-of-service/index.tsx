import React, { Fragment, useEffect, useState } from 'react';
import { Card, Button, Spin } from 'antd';
import EditorBase from '~/components/Elements/EditorBase';
import TitlePage from '~/components/TitlePage';
import LayoutBase from '~/components/LayoutBase';

import { rulesApi } from '~/apiBase';
import { useWrap } from '~/context/wrap';

const TermOfService = () => {
	const [data, setData] = useState(null);
	const [dataContent, setDataContent] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const { showNoti } = useWrap();

	const fetchContract = async () => {
		try {
			let res = await rulesApi.getAll({});

			if (res.status === 200) {
				if (typeof res.data.data === 'object') {
					setData(res.data.data);
				}
			} else if (res.status === 204) {
				showNoti('danger', 'Không tìm thấy');
			}
		} catch (error) {
			showNoti('danger', error.message);
		}
	};
	const changeContractContent = (value) => {
		setDataContent(value);
	};
	const updateData = async () => {
		if (!dataContent) {
			showNoti('danger', 'Bạn chưa sửa đổi');
			return;
		}
		setIsLoading(true);
		try {
			let res = await rulesApi.update({
				...data,
				RulesContent: dataContent
			});
			showNoti('success', res.data.message);
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setDataContent('');
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchContract();
	}, []);

	return (
		<div className="row">
			<div className="col-12">
				<TitlePage title="Điều khoản" />
				<Card>
					<EditorBase handleChangeDataEditor={changeContractContent} content={data?.RulesContent} />
					<div className="row pt-3">
						<div className="col-12 d-flex justify-content-center">
							<div style={{ paddingRight: 5 }}>
								<Button type="primary" size="large" onClick={updateData}>
									Xác nhận
									{isLoading && <Spin className="loading-base" />}
								</Button>
							</div>
						</div>
					</div>
				</Card>
			</div>
		</div>
	);
};
TermOfService.layout = LayoutBase;
export default TermOfService;
