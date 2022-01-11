import React, { useEffect, useState } from 'react';
import { Button, Drawer, Form, Select, Spin, Tooltip, Upload } from 'antd';
import { Edit } from 'react-feather';
import { examTopicApi, programApi, curriculumApi, newsFeedApi } from '~/apiBase';
import { useWrap } from '~/context/wrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import InputTextField from '~/components/FormControl/InputTextField';
import SelectField from '~/components/FormControl/SelectField';
import TextAreaField from '~/components/FormControl/TextAreaField';
import { UploadOutlined, UpOutlined } from '@ant-design/icons';

let returnSchema = {};
let schema = null;

// type defaultValuesInit = {
//   Name: string;
//   Code: string; //mã đề thi
//   Description: string;
//   Type: number; //1-Trắc nghiệm 2-Tự luận
//   CurriculumID: number;
//   Time: number; //Thời gian làm bài
// };

type dataOject = {
	title: string;
	value: number;
};

const CreateExamForm = (props) => {
	const { onFetchData, dataItem } = props;
	const { showNoti } = useWrap();
	const [visible, setVisible] = useState(false);
	const [dataProgram, setDataProgram] = useState<dataOject[]>([]);
	const [dataCurriculum, setDataCurriculum] = useState<dataOject[]>([]);
	const [loadingCurriculum, setLoadingCurriculum] = useState(false);
	const [loadingProgram, setLoadingProgram] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [isTest, setIsTest] = useState(false);
	const [audioSelected, setAudioSelected] = useState({ name: '' });
	const [linkLile, setLinkFile] = useState('');
	const [loading, setLoading] = useState(false);

	const showDrawer = () => {
		setVisible(true);
	};
	const onClose = () => {
		setVisible(false);
	};

	const { Option } = Select;

	// GET DATA PROGRAM
	const getDataProgram = async () => {
		setLoadingProgram(true);
		try {
			let res = await programApi.getAll({ pageIndex: 1, pageSize: 999999 });
			if (res.status == 200) {
				let newData = res.data.data.map((item) => ({
					title: item.ProgramName,
					value: item.ID
				}));
				setDataProgram(newData);
			}

			res.status == 204 && showNoti('danger', 'Chương trình không có dữ liệu');
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setLoadingProgram(false);
		}
	};

	// HANDLE CHANGE - SELECT PROGRAM
	const handleChange_selectProgram = (value) => {
		setDataCurriculum([]);
		getDataCurriculum(value);
		form.setValue('CurriculumID', null);
	};

	// HANLE CHANGE - SELECT TYPE EXAM
	const handleChange_type = (value) => {
		if (value === 1) {
			setIsTest(true);
		} else {
			setIsTest(false);
		}
	};

	// GET DATA Curriculum
	const getDataCurriculum = async (id) => {
		setLoadingCurriculum(true);
		try {
			let res = await curriculumApi.getAll({
				pageIndex: 1,
				pageSize: 999999,
				ProgramID: id
			});
			if (res.status == 200) {
				let newData = res.data.data.map((item) => ({
					title: item.CurriculumName,
					value: item.ID
				}));
				setDataCurriculum(newData);
			}

			res.status == 204 && showNoti('danger', 'Giáo trình không có dữ liệu');
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setLoadingCurriculum(false);
		}
	};

	// -----  HANDLE ALL IN FORM -------------
	const defaultValuesInit = {
		Name: null,
		Code: null, //mã đề thi
		Description: null,
		Type: null, //1-Trắc nghiệm 2-Tự luận
		ProgramID: null,
		CurriculumID: null,
		Time: null //Thời gian làm bài
	};

	(function returnSchemaFunc() {
		returnSchema = { ...defaultValuesInit };
		Object.keys(returnSchema).forEach(function (key) {
			switch (key) {
				case 'Type':
					returnSchema[key] = yup.mixed().required('Bạn không được để trống');
					break;
				case 'Name':
					returnSchema[key] = yup.mixed().required('Bạn không được để trống');
					break;
				case 'Time':
					returnSchema[key] = yup.mixed().required('Bạn không được để trống');
					break;
				case 'ProgramID':
					if (!isTest) {
						returnSchema[key] = yup.mixed().required('Bạn không được để trống');
					}
					break;
				case 'CurriculumID':
					if (!isTest) {
						returnSchema[key] = yup.mixed().required('Bạn không được để trống');
					}
					break;
				case 'Code':
					returnSchema[key] = yup.mixed().required('Bạn không được để trống');
					break;
				default:
					// returnSchema[key] = yup.mixed().required("Bạn không được để trống");
					return;
					break;
			}
		});

		schema = yup.object().shape(returnSchema);
	})();

	const form = useForm({
		defaultValues: defaultValuesInit,
		resolver: yupResolver(schema)
	});

	const onSubmit = async (data: any) => {
		if (data.Type == 1) {
			data.CurriculumID = 0;
		}
		setIsLoading(true);
		let res = null;
		try {
			if (dataItem?.ID) {
				res = await examTopicApi.update({ ...data, Audio: linkLile });
			} else {
				res = await examTopicApi.add({ ...data, Audio: linkLile });
			}

			if (res.status == 200) {
				!dataItem?.ID ? showNoti('success', 'Tạo đề thi thành công!') : showNoti('success', 'Cập nhật thành công!');
				setVisible(false);
				onFetchData();
				form.reset(defaultValuesInit);
			}
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		console.log('Data item: ', dataItem);
		if (visible) {
			if (dataItem) {
				dataItem.Type !== 1 && (getDataProgram(), getDataCurriculum(dataItem.ProgramID));
				form.reset(dataItem);
				if (dataItem.Type == 1) {
					form.setValue('CurriculumID', null);
					form.setValue('ProgramID', null);
				}
			} else {
				getDataProgram();
			}
		}
	}, [visible]);

	// Upload file audio
	const handleUploadFile = async (info) => {
		console.log('SELECTED: ', info.file);

		setAudioSelected(info.file);
		uploadFile(info.file);
	};

	// Call api upload image
	const uploadFile = async (file) => {
		setLoading(true);
		try {
			let res = await newsFeedApi.uploadFile(file.originFileObj);
			if (res.status == 200 || res.status == 204) {
				setLinkFile(res.data.data);
			}
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (dataItem !== undefined) {
			setLinkFile(dataItem.Audio);
			setAudioSelected({ name: dataItem.Audio });
		}
	}, []);

	return (
		<>
			{dataItem?.ID ? (
				<button className="btn btn-icon edit" onClick={showDrawer}>
					<Edit />
				</button>
			) : (
				<button className="btn btn-success" onClick={showDrawer}>
					Tạo đề thi
				</button>
			)}

			<Drawer
				title={props.isEdit ? 'Form sửa đề thi' : 'Form tạo đề thi'}
				placement="right"
				closable={false}
				onClose={onClose}
				visible={visible}
				width={700}
				footer={
					<div className="text-center">
						<button className="btn btn-light mr-2" onClick={onClose}>
							Đóng
						</button>
						<button className="btn btn-primary" onClick={form.handleSubmit(onSubmit)}>
							Lưu
							{isLoading && <Spin className="loading-base" />}
						</button>
					</div>
				}
			>
				<Form layout="vertical" onFinish={form.handleSubmit(onSubmit)}>
					<div className="row">
						<div className="col-md-6 col-12">
							<SelectField
								disabled={dataItem?.ID && true}
								form={form}
								name="Type"
								label="Dạng đề thi"
								onChangeSelect={(value) => handleChange_type(value)}
								isRequired={true}
								optionList={[
									{
										value: 1,
										title: 'Đề hẹn test'
									},
									{
										value: 2,
										title: 'Đề bán'
									},
									{
										value: 3,
										title: 'Đề kiểm tra'
									}
								]}
							/>
						</div>
						<div className="col-md-6 col-12">
							<InputTextField form={form} name="Name" label="Tên đề thi" isRequired={true} />
						</div>
						<div className="col-md-6 col-12">
							<InputTextField form={form} name="Code" label="Mã đề thi" isRequired={true} />
						</div>
						<div className="col-md-6 col-12">
							<SelectField
								disabled={isTest ? true : dataItem?.ID ? true : false}
								form={form}
								name="ProgramID"
								label="Chương trình"
								onChangeSelect={(value) => handleChange_selectProgram(value)}
								isLoading={loadingProgram}
								optionList={dataProgram}
								isRequired={!isTest ? true : false}
							/>
						</div>
						<div className="col-md-6 col-12">
							<SelectField
								disabled={isTest ? true : dataItem?.ID ? true : false}
								form={form}
								name="CurriculumID"
								label="Giáo trình"
								isLoading={loadingCurriculum}
								optionList={dataCurriculum}
								isRequired={!isTest ? true : false}
							/>
						</div>

						<div className="col-md-6 col-12">
							<InputTextField form={form} name="Time" label="Thời gian làm bài" isRequired={true} />
						</div>

						<div className="col-md-6 col-12">
							<Form.Item name="Audio" label="Âm thanh">
								<Upload
									style={{ width: 800 }}
									className="vc-e-upload"
									onChange={(e) => {
										e.event !== undefined && handleUploadFile(e);
									}}
									showUploadList={false}
								>
									<Button
										className="vc-e-upload"
										icon={
											loading ? (
												<Spin style={{ marginRight: 10, marginBottom: -3 }} size="small" />
											) : (
												<UploadOutlined style={{ marginTop: -2 }} />
											)
										}
									>
										Bấm để tải audio
									</Button>
								</Upload>
							</Form.Item>
						</div>

						{audioSelected.name !== '' && (
							<div className="col-md-6 col-12" style={{ display: 'flex', flexDirection: 'column' }}>
								<div style={{ fontWeight: 500 }}>File đã chọn</div>
								<div style={{ display: 'flex', flex: 1, alignItems: 'center', width: '100%' }}>
									<div
										style={{
											display: 'flex',
											flexDirection: 'row',
											alignItems: 'center',
											width: '100%'
										}}
									>
										<Tooltip title={audioSelected.name}>
											<div className="in-1-line" style={{ marginTop: -15, maxWidth: '90%' }}>
												{/* <i className="far fa-file-audio mr-2" /> */}
												{audioSelected.name}
											</div>
										</Tooltip>

										<Tooltip title="Xoá file">
											<i
												onClick={() => {
													setAudioSelected({ name: '' });
													setLinkFile('');
												}}
												className="far fa-trash-alt btn-delete-audio"
											/>
										</Tooltip>
									</div>
								</div>
							</div>
						)}

						<div className="col-12">
							<TextAreaField name="Description" label="Hướng dẫn làm bài" form={form} />
						</div>
						<div className="col-12 d-none">
							<div className="text-center">
								{/* <button className="btn btn-light mr-2" onClick={onClose}>
                  Đóng
                </button> */}
								<button className="btn btn-primary" type="submit">
									Lưu
									{isLoading && <Spin className="loading-base" />}
								</button>
							</div>
						</div>
					</div>
				</Form>
			</Drawer>
		</>
	);
};

export default CreateExamForm;
