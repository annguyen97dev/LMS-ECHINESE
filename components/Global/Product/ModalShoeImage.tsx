import { UploadOutlined } from '@ant-design/icons';
import { Button, Modal, Spin, Tooltip, Upload } from 'antd';
import React, { useState, useEffect } from 'react';
import { Eye, Trash } from 'react-feather';
import { productApi } from '~/apiBase/product/product';
import { useWrap } from '~/context/wrap';

const ModalShowImage = (props) => {
	const { ImageList, productID, onFetchData } = props;
	const [isLoading, setIsLoading] = useState(false);
	const [isVisible, setIsVisible] = useState(false);
	const [initImageArray, setInitImageArray] = useState(ImageList);
	const [addImageArray, setAddImageArray] = useState([]);
	const { showNoti } = useWrap();

	useEffect(() => {
		setInitImageArray(ImageList);
	}, [ImageList]);

	const handleDeleteImage = (ID) => {
		setInitImageArray((preState) => {
			let tempArr = [...preState];
			tempArr.forEach((item) => {
				if (item.ID === ID) {
					item.Enable = false;
				}
			});

			return tempArr;
		});
	};

	const handleChangeImage = async (ID, info) => {
		if (info.file.status === 'uploading') {
			setIsLoading(true);
			return;
		}
		if (info.file.status === 'done') {
			setIsLoading(true);
			try {
				let res = await productApi.uploadImage(info.file.originFileObj);
				if ((res.status = 200)) {
					let tempArr = [...initImageArray];
					tempArr.forEach((item) => {
						if (item.ID == ID) {
							item.Link = res.data.data;
						}
					});
					setInitImageArray(tempArr);
					showNoti('success', 'Đổi ảnh thành công!');
				}
				if (res.status == 204) {
				}
			} catch (err) {
				showNoti('danger', err.message);
			} finally {
				setIsLoading(false);
			}
		}
	};

	const handleSubmitImage = async () => {
		console.log({ ImageOfProducts: initImageArray });
		setIsLoading(true);
		try {
			let res = await productApi.update({ ID: productID, ImageOfProducts: initImageArray });
			if ((res.status = 200)) {
				showNoti('success', 'Sửa ảnh thành công!');
				onFetchData();
				setIsVisible(false);
				setAddImageArray([]);
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
				<Tooltip title="Sửa ảnh sản phẩm">
					<Eye />
				</Tooltip>
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
								{item.Enable && (
									<div className="product__image">
										<div className="" key={index} style={{ width: '100%', height: '100%' }}>
											<img src={item.Link} alt="product image" style={{ width: '100%', height: '100%' }} />
										</div>
										<div className="product__image-overlay ">
											<div className="d-flex justify-content-center align-items-center h-100">
												<Upload
													showUploadList={false}
													maxCount={1}
													onChange={(file) => handleChangeImage(item.ID, file)}
												>
													<button className="btn btn-icon edit mr-2">{<UploadOutlined />}</button>
												</Upload>
												<button className="btn btn-icon ml-2" onClick={() => handleDeleteImage(item.ID)}>
													<Trash />
												</button>
											</div>
										</div>
									</div>
								)}
							</div>
						);
					})}{' '}
				</div>
				<div className="row mt-4">
					<div className="col-12">
						<button className="btn btn-primary w-100" disabled={isLoading} onClick={handleSubmitImage}>
							{isLoading ? <Spin /> : 'Lưu'}
						</button>
					</div>
				</div>
			</Modal>
		</>
	);
};

export default ModalShowImage;
