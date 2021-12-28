import { Modal, Spin } from 'antd';
import React, { useEffect, useState } from 'react';

const OverStudentConfirmBox = (props) => {
	const {
		visibleModalConfirm,
		setVisibleModalConfirm,
		courseOverStudent,
		setCourseOverStudent,
		courseOverStudentClone,
		onSubmit,
		dataSubmit,
		isLoading
	} = props;
	console.log(courseOverStudentClone);
	return (
		<>
			<Modal
				visible={visibleModalConfirm}
				title="Xác nhận"
				footer={null}
				onCancel={() => {
					setVisibleModalConfirm(false);
					setCourseOverStudent(courseOverStudentClone);
				}}
			>
				<div className="row">
					<div className="col-12 mb-3">
						{courseOverStudentClone.length > 0 && (
							<p className="font-weigth-primary">
								Khóa học{' '}
								{courseOverStudentClone.length > 0 && courseOverStudentClone.map((item) => item.courseName).join(' và ')} đã
								đầy
							</p>
						)}
					</div>
					<div className="col-12 mb-3">
						<h5 className="text-center">Xác nhận vẫn thêm học viên vào lớp</h5>
					</div>
					<div className="col-12">
						<button
							type="submit"
							className="btn btn-primary w-100"
							onClick={() => {
								onSubmit(dataSubmit);
							}}
							disabled={isLoading}
						>
							{isLoading ? <Spin /> : 'Xác nhận'}
						</button>
					</div>
				</div>
			</Modal>
		</>
	);
};
export default OverStudentConfirmBox;
