import { PlusOutlined } from '@ant-design/icons';
import { Modal, Spin, Tooltip, Upload } from 'antd';
import React, { useState, useEffect } from 'react';
import { Plus } from 'react-feather';
import { productApi } from '~/apiBase/product/product';
import { useWrap } from '~/context/wrap';

// export interface IModalAddImageProps {
// 	productID: number;
// 	onFetchData: Function;
//     ImageList: Array<T>;
// }

export default function ModalAddImage(props) {
	const { showNoti } = useWrap();
	const { productID, ImageList, onFetchData } = props;
	const [isLoading, setIsLoading] = useState(false);
	const [isVisible, setIsVisible] = useState(false);
	const [previewVisible, setPreviewVisible] = useState(false);
	const [previewTitle, setPreviewTitle] = useState('');
	const [previewImage, setPreviewImage] = useState('');
	const [fileList, setFileList] = useState([]);
	const [imageAddList, setImageAddList] = useState([]);

	const uploadButton = (
		<div>
			<PlusOutlined />
			<div style={{ marginTop: 8 }}></div>
		</div>
	);

	function getBase64(file) {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => resolve(reader.result);
			reader.onerror = (error) => reject(error);
		});
	}

	const handleChange = async (info) => {
		setFileList(info.fileList);
		setIsLoading(true);
		try {
			let nextPost = 0;
			const resArr = await Promise.all(
				info.fileList.reduce((newArr, file, idx) => {
					if (file.originFileObj) {
						newArr.push(productApi.uploadImage(file.originFileObj));
					} else {
						nextPost += 1;
						newArr;
					}
					return newArr;
				}, [])
			);
			const result = resArr.map((r: any, index: number) => {
				return {
					Link: r.data.data,
					isAvatar: ImageList.length === 0 ? (index === 0 ? true : false) : false,
					ID: 0
				};
			});
			console.log(result);
			setImageAddList(result);
			return result;
		} catch (error) {
			console.log('onUploadFile', error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleAddImage = async () => {
		console.log(imageAddList);
		setIsLoading(true);
		try {
			let res = await productApi.update({ ID: productID, ImageOfProducts: imageAddList });
			if ((res.status = 200)) {
				showNoti('success', 'Thêm ảnh thành công!');
				onFetchData();
				setIsVisible(false);
				setFileList([]);
			}
		} catch (err) {
			showNoti('danger', err.message);
		} finally {
			setIsLoading(false);
		}
	};

	const handlePreview = async (file) => {
		if (!file.url && !file.preview) {
			file.preview = await getBase64(file.originFileObj);
		}

		setIsVisible(false);
		setPreviewVisible(true);
		setPreviewImage(file.url || file.preview);
		setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
	};

	return (
		<>
			<button
				className="btn btn-icon edit"
				onClick={() => {
					setIsVisible(true);
					console.log(ImageList);
				}}
			>
				<Tooltip title="Thêm ảnh sản phẩm">
					<Plus />
				</Tooltip>
			</button>
			<Modal
				visible={previewVisible}
				title={previewTitle}
				footer={null}
				onCancel={() => {
					setIsVisible(true);
					setPreviewVisible(false);
				}}
			>
				<img alt="example" style={{ width: '100%' }} src={previewImage} />
			</Modal>
			<Modal
				title={'Ảnh sản phẩm'}
				visible={isVisible}
				centered
				onCancel={() => {
					setIsVisible(false);
				}}
				footer={false}
			>
				<div className="row">
					<div className="col-12">
						<Upload listType="picture-card" fileList={fileList} onPreview={handlePreview} onChange={handleChange}>
							{uploadButton}
						</Upload>
					</div>
				</div>
				<div className="row mt-4">
					<div className="col-12">
						<button className="btn btn-primary w-100" disabled={isLoading} onClick={handleAddImage}>
							{isLoading ? <Spin /> : 'Lưu'}
						</button>
					</div>
				</div>
			</Modal>
		</>
	);
}
