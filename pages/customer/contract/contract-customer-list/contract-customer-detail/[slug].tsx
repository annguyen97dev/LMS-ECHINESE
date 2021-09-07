import {Button, Card, Spin} from 'antd';
import {useRouter} from 'next/router';
import {useEffect, useState} from 'react';
import {contractCustomerListApi} from '~/apiBase';
import EditorBase from '~/components/Elements/EditorBase';
import LayoutBase from '~/components/LayoutBase';
import TitlePage from '~/components/TitlePage';
import {useWrap} from '~/context/wrap';

const ContractCustomerDetail = () => {
	const router = useRouter();
	const slug = router.query.slug;
	const {showNoti} = useWrap();
	const [isLoading, setIsLoading] = useState({
		type: '',
		status: false,
	});
	const [dataContract, setDataContract] = useState<any>({});
	const [contractContent, setContractContent] = useState('');

	const getContractDetail = async () => {
		setIsLoading({
			type: 'GET_BYID',
			status: true,
		});
		try {
			let res = await contractCustomerListApi.getDetail(Number(slug));
			res.status === 200 && setDataContract(res.data.data);
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading({
				type: 'GET_BYID',
				status: false,
			});
		}
	};

	useEffect(() => {
		getContractDetail();
	}, []);

	const changeContractContent = (value) => {
		setContractContent(value);
	};
	const updateContract = async () => {
		if (!contractContent) {
			showNoti('danger', 'Bạn chưa sửa đổi');
			return;
		}
		setIsLoading({
			type: 'UPDATE',
			status: true,
		});
		try {
			let res = await contractCustomerListApi.update({
				...dataContract,
				ContractContent: contractContent,
			});
			res.status === 200 && showNoti('success', res.data.message);
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setContractContent('');
			setIsLoading({
				type: 'UPDATE',
				status: false,
			});
		}
	};

	return (
		<div className="row">
			<TitlePage title="Chi tiết hợp đồng" />
			<div className="col-12">
				<Card
					title={dataContract?.CourseName}
					className={`${isLoading.status ? 'custom-loading' : ''}`}
					style={{position: 'relative'}}
				>
					<EditorBase
						content={dataContract?.ContractContent}
						handleChangeDataEditor={changeContractContent}
					/>
					<div className="pt-3">
						<div className="col-12 d-flex justify-content-center">
							<div style={{paddingRight: 5}}>
								<Button type="primary" size="large" onClick={updateContract}>
									Xác nhận
									{isLoading.status && <Spin className="loading-base" />}
								</Button>
							</div>
						</div>
					</div>
					<Spin className="custom-loading-icon" size="large" />
				</Card>
			</div>
		</div>
	);
};
ContractCustomerDetail.layout = LayoutBase;
export default ContractCustomerDetail;
