import {Editor} from '@tinymce/tinymce-react';
import {Button, Card, Spin} from 'antd';
import React, {useEffect, useState} from 'react';
import { contractApi } from '~/apiBase/options/contract';
import TitlePage from '~/components/TitlePage';
import {useWrap} from '~/context/wrap';

const Contract = () => {
	const [contract, setContract] = useState(null);
	const [contractContent, setContractContent] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const {showNoti} = useWrap();

	const fetchContract = async () => {
		try {
			let res = await contractApi.getAll({});

			if (res.status === 200) {
				if (typeof res.data.data === 'object') {
					setContract(res.data.data);
				}
			} else if (res.status === 204) {
				showNoti('danger', 'Không tìm thấy');
			}
		} catch (error) {
			showNoti('danger', error.message);
		}
	};
	useEffect(() => {
		fetchContract();
	}, []);
	const changeContractContent = (e) => {
		setContractContent(e.target.getContent());
	};
	const updateContract = async () => {
		if (!contractContent) {
			showNoti('danger', 'Bạn chưa sưa đổi');
			return;
		}
		setIsLoading(true);
		try {
			let res = await contractApi.update({
				...contract,
				ContractContent: contractContent,
			});
			showNoti('success', res.data.message);
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setContractContent('');
			setIsLoading(false);
		}
	};
	return (
		<div className="row">
			<div className="col-12">
				<TitlePage title="Contract Detail" />
			</div>
			<Card>
				<div className="col-12">
					<Editor
						apiKey="la1igo0sfogafdrl7wrj7w9j1mghl7txxke654lgzvkt86im"
						initialValue={contract?.ContractContent}
						init={{
							height: 700,
							branding: false,
							plugins: 'link image code',
							toolbar:
								'undo redo | bold italic | alignleft aligncenter alignright | code',
						}}
						onChange={changeContractContent}
					/>
				</div>
				<div className="row pt-3">
					<div className="col-12 d-flex justify-content-center">
						<div style={{paddingRight: 5}}>
							<Button type="primary" size="large" onClick={updateContract}>
								Xác nhận
								{isLoading && <Spin className="loading-base" />}
							</Button>
						</div>
					</div>
				</div>
			</Card>
		</div>
	);
};

export default Contract;
