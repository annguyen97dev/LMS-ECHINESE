import React, { useEffect, useState, forwardRef } from 'react';

import { Modal, Form, Input, Select, Card, Spin, InputNumber, Button, DatePicker } from 'antd';
import { branchApi, courseApi, discountApi } from '~/apiBase';
import { examServiceApi } from '~/apiBase/options/examServices';
import { useWrap } from '~/context/wrap';
import { useForm } from 'react-hook-form';
import { PaymentMethod } from '~/lib/payment-method/payment-method';
import { studentExamServicesApi } from '~/apiBase/customer/student/student-exam-services';

const RegCourse = React.memo((props: any) => {
	const { TextArea } = Input;
	const { Option } = Select;
	const { userInformation } = useWrap();
	const [branch, setBranch] = useState<IBranch[]>();
	const [course, setCourse] = useState<ICourse[]>();
	const [loadingCourse, setLoadingCourse] = useState(false);
	const [discount, setDiscount] = useState<IDiscount[]>();
	const { showNoti } = useWrap();
	const [form] = Form.useForm();
	const { setValue } = useForm();
	const [totalPrice, setTotalPrice] = useState(0);
	const [debt, setDebt] = useState(0);
	const [discountPrice, setDiscountPrice] = useState(0);
	const [paid, setPaid] = useState(0);
	const [discountStyle, setDiscountStyle] = useState(1);
	const [branchID, setBranchID] = useState(0);

	const fetchDataSelectList = () => {
		(async () => {
			try {
				const _branch = await branchApi.getAll({
					pageIndex: 1,
					pageSize: 99999,
					Enable: true
				});
				_branch.status == 200 && setBranch(_branch.data.data);
			} catch (err) {
				showNoti('danger', err.message);
			}
		})();
	};

	const fetchDataCourse = () => {
		setLoadingCourse(true);
		(async () => {
			try {
				const _course = await courseApi.getAll({
					pageIndex: 1,
					pageSize: 99999,
					isEnd: false,
					BranchID: branchID
				});
				_course.status == 200 && setCourse(_course.data.data);
				if (_course.status == 204) {
					showNoti('warning', 'Trung tâm đang chọn hiện chưa có khóa học!!');
					setCourse(null);
				}
			} catch (err) {
				showNoti('danger', err.message);
			} finally {
				setLoadingCourse(false);
			}
		})();
	};

	const fetchDataDiscount = () => {
		(async () => {
			try {
				const _discount = await discountApi.getAll({
					pageIndex: 1,
					pageSize: 99999,
					Status: 2,
					Style: discountStyle
				});
				_discount.status == 200 && setDiscount(_discount.data.data);
			} catch (err) {
				showNoti('danger', err.message);
			}
		})();
	};

	useEffect(() => {
		fetchDataSelectList();
	}, []);

	useEffect(() => {
		fetchDataDiscount();
	}, [discountStyle]);

	useEffect(() => {
		fetchDataCourse();
	}, [branchID, props.isFetchDataCourses]);

	const handleChangeCourse = (value) => {
		let _totalStudents = [];
		for (let i = 0; i < course.length; i++) {
			for (let j = 0; j < value.length; j++) {
				if (course[i].ID == value[j]) {
					_totalStudents.push({
						students: course[i].TotalStudents,
						maxStudent: course[i].MaximumStudent,
						courseName: course[i].CourseName
					});
				}
			}
		}
		let _courseOverStudents = _totalStudents.filter((item) => item.students >= item.maxStudent);
		props.setCourseOverStudent(_courseOverStudents);
		props.setCourseOverStudentClone(_courseOverStudents);

		if (value.length > 1) {
			setDiscountStyle(2);
		} else {
			setDiscountStyle(1);
		}
		let _price = [];
		for (let i = 0; i < course.length; i++) {
			for (let j = 0; j < value.length; j++) {
				if (course[i].ID == value[j]) {
					_price.push(course[i].Price);
				}
			}
		}
		function sumArray(arr) {
			let sum = 0;
			arr.forEach(function (value) {
				sum += value;
			});

			return sum;
		}
		setTotalPrice(sumArray(_price));
	};

	const handleMoneyLeft = (value) => {
		setPaid(value);
	};

	const handleDiscount = (value) => {
		let _dc = [];
		if (value) {
			for (let i = 0; i < discount.length; i++) {
				if (discount[i].DiscountCode == value) {
					_dc.push(discount[i]);
				}
			}

			if (_dc[0].DiscountType == 1) {
				setDiscountPrice(_dc[0].Discount);
			}

			if (_dc[0].DiscountType == 2) {
				if (_dc[0].MaxDiscountPrice < (totalPrice * _dc[0].Discount) / 100) {
					showNoti('warning', `Số tiền được giảm tối đa là ${Intl.NumberFormat('ja-JP').format(_dc[0].MaxDiscountPrice)} VNĐ`);
					setDiscountPrice(_dc[0].MaxDiscountPrice);
				} else {
					setDiscountPrice((totalPrice * _dc[0].Discount) / 100);
				}
			}
		} else {
			setDiscountPrice(null);
		}
	};

	useEffect(() => {
		setDebt(totalPrice - (paid + discountPrice));
	}, [totalPrice, paid, discountPrice]);

	const returnNameCourse = (data) => {
		let name = data.CourseName;
		let percent = data.DonePercent.toString() + '% ';
		name = percent + name;
		return name;
	};

	return (
		<Card title="Đăng ký khóa học">
			<div className="row">
				<div className="col-12">
					<Form.Item
						name="BranchID"
						label="Trung tâm"
						rules={[
							{
								required: true,
								message: 'Vui lòng điền đủ thông tin!'
							}
						]}
					>
						<Select
							className="style-input"
							showSearch
							optionFilterProp="children"
							allowClear={true}
							onChange={(value: any) => {
								setBranchID(value);
							}}
						>
							{branch?.map((item, index) => (
								<Option key={index} value={item.ID}>
									{item.BranchName}
								</Option>
							))}
						</Select>
					</Form.Item>
				</div>
			</div>
			<Spin spinning={loadingCourse}>
				<div className="row">
					<div className="col-12">
						<Form.Item
							name="Course"
							label="Khóa học"
							rules={[
								{
									required: true,
									message: 'Vui lòng điền đủ thông tin!'
								}
							]}
						>
							<Select
								mode="multiple"
								showSearch
								optionFilterProp="children"
								className="style-input"
								onChange={(value) => handleChangeCourse(value)}
							>
								{course?.map((item, index) => (
									<Option key={index} value={item.ID}>
										{/* {item.DonePercent
                      ? item.DonePercent % -item.CourseName
                      : item.CourseName} */}
										{returnNameCourse(item)}
									</Option>
								))}
							</Select>
						</Form.Item>
					</div>
				</div>
			</Spin>

			<div className="row">
				{userInformation.RoleID !== 2 && userInformation.RoleID !== 6 ? (
					<>
						<div className="col-md-6 col-12">
							<Form.Item label="Tổng giá tiền">
								<Input
									value={totalPrice ? Intl.NumberFormat('ja-JP').format(totalPrice) : 0}
									className="style-input"
									readOnly={true}
								/>
							</Form.Item>
						</div>
						<div className="col-md-6 col-12">
							<Form.Item
								name="PaymentMethodsID"
								label="Hình thức thanh toán"
								rules={[
									{
										required: true,
										message: 'Vui lòng điền đủ thông tin!'
									}
								]}
							>
								<Select className="style-input" allowClear={true}>
									{PaymentMethod?.map((item, index) => (
										<Option key={index} value={item.id}>
											{item.Name}
										</Option>
									))}
								</Select>
							</Form.Item>
						</div>
					</>
				) : (
					<div className="col-md-12 col-12">
						<Form.Item label="Tổng giá tiền">
							<Input
								value={totalPrice ? Intl.NumberFormat('ja-JP').format(totalPrice) : 0}
								className="style-input"
								readOnly={true}
							/>
						</Form.Item>
					</div>
				)}
			</div>

			<div className="row">
				<div className="col-md-6 col-12">
					<Form.Item name="DiscountCode" label="Mã giảm giá">
						<Select
							allowClear={true}
							className="style-input"
							showSearch
							optionFilterProp="children"
							onChange={(value) => handleDiscount(value)}
						>
							{discount?.map((item, index) => (
								<Option key={index} value={item.DiscountCode}>
									{item.DiscountCode}
								</Option>
							))}
						</Select>
					</Form.Item>
				</div>
				<div className="col-md-6 col-12">
					<Form.Item label="Số tiền được giảm">
						<Input value={Intl.NumberFormat('ja-JP').format(discountPrice)} className="style-input" readOnly={true} />
					</Form.Item>
				</div>
			</div>

			{userInformation.RoleID !== 2 && userInformation.RoleID !== 6 && (
				<div className="row">
					<div className="col-md-6 col-12">
						<Form.Item name="Paid" label="Thanh toán" rules={[{ required: true, message: 'Bạn không được để trống' }]}>
							<InputNumber
								placeholder="Số tiền thanh toán"
								className="ant-input style-input w-100"
								formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
								parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
								onChange={(value) => {
									setValue('Paid', value);
									handleMoneyLeft(value);
								}}
							/>
						</Form.Item>
					</div>
					<div className="col-md-6 col-12">
						<Form.Item label="Số tiền còn lại">
							<Input value={Intl.NumberFormat('ja-JP').format(debt)} className="style-input" readOnly={true} />
						</Form.Item>
					</div>
				</div>
			)}

			{userInformation.RoleID !== 2 && userInformation.RoleID !== 6 && (
				<div className="row">
					<div className="col-md-6 col-12">
						<Form.Item
							name="PayBranchID"
							label="Trung tâm thanh toán"
							rules={[
								{
									required: true,
									message: 'Vui lòng điền đủ thông tin!'
								}
							]}
						>
							<Select className="style-input" showSearch optionFilterProp="children" allowClear={true}>
								{branch?.map((item, index) => (
									<Option key={index} value={item.ID}>
										{item.BranchName}
									</Option>
								))}
							</Select>
						</Form.Item>
					</div>
					<div className="col-md-6 col-12">
						<Form.Item name="PayDate" label="Ngày hẹn trả" rules={[{ required: true, message: 'Vui lòng điền đủ thông tin!' }]}>
							<DatePicker allowClear={true} className="style-input" onChange={(e) => setValue('PayDate', e)} />
						</Form.Item>
					</div>
				</div>
			)}

			<div className="row">
				<div className="col-12">
					<Form.Item name="Commitment" label="Cam kết">
						<TextArea onChange={(e) => setValue('Commitment', e.target.value)} allowClear={true} />
					</Form.Item>
				</div>
			</div>

			<div className="row">
				<div className="col-12">
					<Form.Item name="Note" label="Ghi chú">
						<TextArea onChange={(e) => setValue('Note', e.target.value)} allowClear={true} />
					</Form.Item>
				</div>
			</div>

			<div className="row">
				<div className="col-12 text-center text-left-mobile">
					<button type="submit" className="btn btn-primary">
						Xác nhận
						{props.loading == true && <Spin className="loading-base" />}
					</button>
				</div>
			</div>
		</Card>
	);
});

export default RegCourse;
