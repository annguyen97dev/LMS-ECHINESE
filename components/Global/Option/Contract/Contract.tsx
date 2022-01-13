import { Card, Popover, Spin, Tooltip } from 'antd';
import { ifError } from 'assert';
import React, { useEffect, useState } from 'react';
import { contractApi } from '~/apiBase/options/contract';
import EditorBase from '~/components/Elements/EditorBase';
import TitlePage from '~/components/TitlePage';
import { useWrap } from '~/context/wrap';

const Contract = () => {
	const [contract, setContract] = useState(null);
	const [contractContent, setContractContent] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const { showNoti } = useWrap();

	const codeEditorList = [
		{ label: '{hinhthucthanhtoan}', desc: 'Hình thức thanh toán' },
		{ label: '{hovaten}', desc: ' Họ và tên' },
		{ label: '{sodienthoai}', desc: ' Số điện thoại' },
		{ label: '{email}', desc: 'Email khách hàng' },
		{ label: '{cmnd}', desc: ' CMND' },
		{ label: '{ngaycap}', desc: ' Ngày cấp' },
		{ label: '{noicap}', desc: ' Nơi cấp' },
		{ label: '{diachi}', desc: ' địa chỉ' },
		{ label: '{lydo}', desc: ' lý do xuất phiếu' },
		{ label: '{dachi}', desc: ' số tiền chi ra' },
		{ label: '{dathu}', desc: ' số tiền thu vào' },
		{ label: '{nguoinhanphieu}', desc: ' người nhận phiếu ký tên' },
		{ label: '{nhanvienxuat}', desc: ' nhân viên xuất phiếu ký tên' }
	];

	const fetchContract = async () => {
		setIsLoading(true);
		try {
			let res = await contractApi.getAll({});
			if (res.status === 200) {
				if (typeof res.data.data === 'object' && res.data.data !== null) {
					setContract(res.data.data);
				}
			} else if (res.status === 204) {
				showNoti('danger', 'Không tìm thấy');
			}
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchContract();
	}, []);

	const changeContractContent = (value) => {
		setContractContent(value);
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
				ContractContent: contractContent
			});
			if (res.status === 200) {
				showNoti('success', res.data.message);
			}
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setContractContent('');
			setIsLoading(false);
		}
	};

	return (
		<div className="row">
			<TitlePage title="Contract Detail" />
			<div className="col-12">
				<Card
					className={`${isLoading ? 'custom-loading' : ''}`}
					style={{ position: 'relative' }}
					extra={
						<Popover
							placement="bottomRight"
							content={
								<div className="invoice-editor-list">
									{codeEditorList.map((c, idx) => (
										<Tooltip title="Nhấn để sao chép" placement="left" className="invoice-editor-item">
											<p
												key={idx}
												onClick={() => {
													navigator.clipboard.writeText(c.label);
												}}
											>
												<span>{c.label}:</span>
												{`${c.desc}`}
											</p>
										</Tooltip>
									))}
								</div>
							}
						>
							<a className="btn-code-editor" style={{ position: 'relative' }} type="primary">
								Mã hướng dẫn
							</a>
						</Popover>
					}
				>
					<EditorBase content={contract?.ContractContent} handleChangeDataEditor={changeContractContent} />
					<div className="pt-3 d-flex justify-content-center">
						<div style={{ paddingRight: 5 }}>
							<button type="submit" className="btn btn-primary" disabled={isLoading} onClick={updateContract}>
								Xác nhận
								{isLoading && <Spin className="loading-base" />}
							</button>
						</div>
					</div>
					<Spin className="custom-loading-icon" size="large" />
				</Card>
			</div>
		</div>
	);
};

export default Contract;
