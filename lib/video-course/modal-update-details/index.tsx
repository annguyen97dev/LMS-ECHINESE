import React, { useState } from 'react';
import { Modal, Form, Spin, Upload } from 'antd';
import { useWrap } from '~/context/wrap';
import EditorSimple from '~/components/Elements/EditorSimple';
import { VideoCourseDetailApi } from '~/apiBase/video-course-details';
import 'antd/dist/antd.css';

const initDetails = {
	VideoCourseName: '',
	Slogan: '',
	Requirements: '',
	Description: '',
	ResultsAchieved: '',
	CourseForObject: '',
	TotalRating: 0,
	RatingNumber: 0,
	TotalStudent: 0,
	CreatedBy: ''
};

const ModalUpdateDetail = React.memo((props: any) => {
	const { programID, isModalVisible, setIsModalVisible } = props;
	const [form] = Form.useForm();
	const { showNoti } = useWrap();

	const [loading, setLoading] = useState(true);
	const [details, setDetails] = useState(initDetails);
	const [updateLoading, setUpdateLoading] = useState(false);

	// Init data
	React.useEffect(() => {
		if (details !== initDetails) {
			setDescription(details?.Description || '');
			setCourseForObject(details?.CourseForObject || '');
			setRequirements(details?.Requirements || '');
			setResultsAchieved(details?.ResultsAchieved || '');
			setSlogan(details?.Slogan || '');
			setLoading(false);
		}
	}, [details]);

	// IS VISIBLE MODAL
	React.useEffect(() => {
		if (isModalVisible) {
			if (programID) {
				getCourseDetails(programID);
			}
		}
	}, [isModalVisible]);

	// CALL API DETAILS
	const getCourseDetails = async (param) => {
		try {
			const res = await VideoCourseDetailApi.getDetails(param);
			res.status == 200 && setDetails(res.data.data);
		} catch (error) {
			console.log(error);
		}
	};

	const [slogan, setSlogan] = useState('');
	const [requirements, setRequirements] = useState('');
	const [description, setDescription] = useState('');
	const [resultsAchieved, setResultsAchieved] = useState('');
	const [courseForObject, setCourseForObject] = useState('');

	// HANDLE UPDATE
	const updateDetails = async () => {
		setUpdateLoading(true);
		let temp = {
			VideoCourseID: programID,
			Slogan: slogan,
			Requirements: requirements,
			Description: description,
			ResultsAchieved: resultsAchieved,
			CourseForObject: courseForObject
		};
		try {
			const res = await VideoCourseDetailApi.update(temp);
			res.status == 200 && (setIsModalVisible(true), showNoti('success', 'Thành công'));
		} catch (error) {
		} finally {
			setUpdateLoading(false);
		}
	};

	// RENDER
	return (
		<>
			<Modal
				title="Cập nhật thông tin chi tiết"
				visible={isModalVisible}
				onCancel={() => setIsModalVisible(false)}
				footer={null}
				style={{ zIndex: 99999 }}
			>
				<div className="container-fluid custom-scroll-bar">
					<Form form={form} layout="vertical" onFinish={() => {}}>
						<div className="row vc-e-d">
							{loading ? (
								<div style={{ display: 'flex', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
									<Spin size="large" />
								</div>
							) : (
								<>
									<div className="col-md-12 col-12">
										<Form.Item name="Slogan" label="Slogan">
											<EditorSimple defaultValue={slogan} handleChange={(e) => setSlogan(e)} isTranslate={false} />
										</Form.Item>
									</div>
									<div className="col-md-12 col-12">
										<Form.Item name="Requirements" label="Điều kiện học">
											<EditorSimple
												defaultValue={requirements}
												handleChange={(e) => setRequirements(e)}
												isTranslate={false}
											/>
										</Form.Item>
									</div>
									<div className="col-md-12 col-12">
										<Form.Item name="CourseForObject" label="Đối tượng học">
											<EditorSimple
												defaultValue={courseForObject}
												handleChange={(e) => setCourseForObject(e)}
												isTranslate={false}
											/>
										</Form.Item>
									</div>
									<div className="col-md-12 col-12">
										<Form.Item name="ResultsAchieved" label="Nội dung khóa học">
											<EditorSimple
												defaultValue={resultsAchieved}
												handleChange={(e) => setResultsAchieved(e)}
												isTranslate={false}
											/>
										</Form.Item>
									</div>
									<div className="col-md-12 col-12">
										<Form.Item name="Description" label="Miêu tả">
											<EditorSimple
												defaultValue={description}
												handleChange={(e) => setDescription(e)}
												isTranslate={false}
											/>
										</Form.Item>
									</div>
								</>
							)}
						</div>
						<div className="col-12 m-0 p-0" style={{ justifyContent: 'flex-end', display: 'flex' }}>
							<button onClick={() => setIsModalVisible(false)} className="btn btn-warning mr-3">
								Huỷ
							</button>

							<button
								onClick={() => {
									updateDetails();
								}}
								className="btn btn-primary"
							>
								Lưu
								{updateLoading && <Spin className="loading-base" />}
							</button>
						</div>
					</Form>
				</div>
			</Modal>
		</>
	);
});

export default ModalUpdateDetail;
