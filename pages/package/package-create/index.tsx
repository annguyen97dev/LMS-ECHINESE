import {
	AudioOutlined,
	CustomerServiceOutlined,
	FileTextOutlined,
	FormOutlined,
} from '@ant-design/icons';
import {Card, Input, Radio, Upload} from 'antd';
import ImgCrop from 'antd-img-crop';
import {useRouter} from 'next/router';
import React, {useState} from 'react';
import Editor from '~/components/Elements/Editor';
import TitlePage from '~/components/Elements/TitlePage';
import LayoutBase from '~/components/LayoutBase';

const PackageCreate = () => {
	const [fileList, setFileList] = useState([]);
	const [isType, setIsType] = useState();
	const router = useRouter();
	const onChange = ({fileList: newFileList}) => {
		setFileList(newFileList);
	};
	const onPreview = async (file) => {
		let src = file.url;
		if (!src) {
			src = await new Promise((resolve) => {
				const reader = new FileReader();
				reader.readAsDataURL(file.originFileObj);
				reader.onload = () => resolve(reader.result);
			});
		}
		const image = new Image();
		image.src = src;
		const imgWindow = window.open(src);
		imgWindow.document.write(image.outerHTML);
	};
	const chooseType = (box) => {
		setIsType(box);
	};
	return (
		<>
			<div className="package-create">
				<TitlePage title="Tạo bộ đề mới" />
				<Card title="Set Up" className="package-create-card">
					<div className="row">
						<div className="col-md-3 col-sm-6 col-12">
							<div
								onClick={() => chooseType('listening')}
								className={`${
									isType == 'listening' ? 'choose' : ''
								} box-type-package`}
								style={{
									background: 'url("/images/listening.jpg")',
									backgroundRepeat: 'no-repeat',
									backgroundSize: 'cover',
								}}
							>
								<div className="box-detail">
									<CustomerServiceOutlined />
									<p>Listening </p>
								</div>
							</div>
						</div>
						<div className="col-md-3 col-sm-6 col-12">
							<div
								onClick={() => chooseType('reading')}
								className={`${
									isType == 'reading' ? 'choose' : ''
								} box-type-package`}
								style={{
									background: 'url("/images/reading.jpg")',
									backgroundRepeat: 'no-repeat',
									backgroundSize: 'cover',
								}}
							>
								<div className="box-detail">
									<FileTextOutlined />
									<p>Reading</p>
								</div>
							</div>
						</div>
						<div className="col-md-3 col-sm-6 col-12">
							<div
								onClick={() => chooseType('writting')}
								className={`${
									isType == 'writting' ? 'choose' : ''
								} box-type-package`}
								style={{
									background: 'url("/images/writting.jpg")',
									backgroundRepeat: 'no-repeat',
									backgroundSize: 'cover',
								}}
							>
								<div className="box-detail">
									<FormOutlined />
									<p>Writting</p>
								</div>
							</div>
						</div>
						<div className="col-md-3 col-sm-6 col-12">
							<div
								onClick={() => chooseType('speaking')}
								className={`${
									isType == 'speaking' ? 'choose' : ''
								} box-type-package`}
								style={{
									background: 'url("/images/speaking.jpg")',
									backgroundRepeat: 'no-repeat',
									backgroundSize: 'cover',
								}}
							>
								<div className="box-detail">
									<AudioOutlined />
									<p>Speaking</p>
								</div>
							</div>
						</div>
					</div>
					<div className="row mt-5">
						<div className="col-12">
							<form className="box-form">
								<div className="form-item">
									<label htmlFor="">Name: </label>
									<Input className="style-input" />
								</div>
								<div className="form-item">
									<label htmlFor="">Type: </label>
									<Radio.Group>
										<Radio value="a">Free</Radio>
										<Radio value="b">Premium</Radio>
									</Radio.Group>
								</div>
								<div className="form-item">
									<label htmlFor="">Thumbnail</label>
									<ImgCrop rotate>
										<Upload
											action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
											listType="picture-card"
											fileList={fileList}
											onChange={onChange}
											onPreview={onPreview}
										>
											Upload
										</Upload>
									</ImgCrop>
								</div>
								<div className="form-item">
									<label htmlFor="">Description: </label>
									{/* <Editor /> */}
								</div>
								<div className="form-item justify-content-center">
									<button className="btn btn-primary">Tạo bộ đề mới</button>
								</div>
							</form>
						</div>
					</div>
				</Card>
			</div>
		</>
	);
};

PackageCreate.layout = LayoutBase;
export default PackageCreate;
