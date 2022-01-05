import { UploadOutlined } from '@ant-design/icons';
import { Modal, Upload } from 'antd';
import React, { useState, useEffect } from 'react';
import { Eye, Trash } from 'react-feather';
import { productApi } from '~/apiBase/product/product';
import { useWrap } from '~/context/wrap';

const ModalShowImage = (props) => {
	const { ImageList } = props;
	const [isLoading, setIsLoading] = useState(false);
	const [isVisible, setIsVisible] = useState(false);
	const [initImageArray, setInitImageArray] = useState(ImageList);
	const { showNoti } = useWrap();

	const handleDeleteImage = (ID) => {
		setInitImageArray((preState) => {
			let tempObj = (preState.filter((item) => item.ID === ID)['Enable'] = false);
			console.log(tempObj);
			return preState.filter((item) => item.ID !== ID);
		});
	};

	const handleSubmitImage = async () => {
		setIsLoading(true);
		try {
			let res = await productApi.update(initImageArray);
			if ((res.status = 200)) {
				showNoti('success', 'Sửa ảnh thành công!');
			}
		} catch (err) {
			showNoti('danger', err.message);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<>
			<button
				type="button"
				className="btn btn-icon"
				onClick={() => {
					setIsVisible(true);
				}}
			>
				<Eye />
			</button>

			<Modal
				title={'Ảnh sản phẩm'}
				visible={isVisible}
				centered
				onCancel={() => {
					setIsVisible(false);
					setInitImageArray(ImageList);
				}}
				footer={false}
			>
				<div className="row">
					{initImageArray?.map((item, index) => {
						return (
							<div className="col-6 mb-2">
								<div className="product__image">
									<div className="" key={index} style={{ width: '100%', height: '100%' }}>
										<img src={item.Link} alt="product image" style={{ width: '100%', height: '100%' }} />
									</div>
									<div className="product__image-overlay ">
										<div className="d-flex justify-content-center align-items-center h-100">
											<Upload {...props}>
												<button className="btn btn-icon edit mr-2">{<UploadOutlined />}</button>
											</Upload>
											<button className="btn btn-icon ml-2" onClick={() => handleDeleteImage(item.ID)}>
												<Trash />
											</button>
										</div>
									</div>
								</div>
							</div>
						);
					})}
				</div>
				<div className="row mt-4">
					<div className="col-12">
						<button className="btn btn-primary w-100" onClick={handleSubmitImage}>
							Lưu
						</button>
					</div>
				</div>
			</Modal>
		</>
	);
};

export default ModalShowImage;
