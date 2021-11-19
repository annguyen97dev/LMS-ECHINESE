import moment from 'moment';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { branchApi } from '~/apiBase';
import { courseStudentPriceApi } from '~/apiBase/customer/student/course-student-price';
import PowerTable from '~/components/PowerTable';
import { useWrap } from '~/context/wrap';
import { fmSelectArr } from '~/utils/functions';
import CourseOfStudentPriceForm from '../Customer/Finance/CourseOfStudentPrice/CourseStudentPriceForm';

const RegCoursePayment = (props: any) => {
	const [isLoading, setIsLoading] = useState({
		type: 'GET_ALL',
		status: false
	});
	const { userID } = props;
	const [paymentInfo, setPaymentInfo] = useState([]);
	const { showNoti } = useWrap();
	const [optionBranchList, setOptionBranchList] = useState<IOptionCommon[]>([]);
	const paymentMethodOptionList = [
		{
			label: 'Tiền mặt',
			value: 1
		},
		{
			label: 'Chuyển khoản',
			value: 2
		}
	];

	const getDataJob = () => {
		setIsLoading({
			type: 'GET_ALL',
			status: true
		});
		(async () => {
			try {
				let res = await courseStudentPriceApi.getAll({
					UserInformationID: userID
				});
				res.status == 200 && setPaymentInfo(res.data.data);
				if (res.status == 204) {
					showNoti('danger', 'Không tìm thấy dữ liệu!');
					setPaymentInfo([]);
				}
			} catch (error) {
				showNoti('danger', error.message);
			} finally {
				setIsLoading({
					type: 'GET_ALL',
					status: false
				});
			}
		})();
	};

	const fetchBranchList = async () => {
		try {
			const res = await branchApi.getAll({ pageSize: 99999, pageIndex: 1 });
			if (res.status === 200) {
				const fmOptionBranch = fmSelectArr(res.data.data, 'BranchName', 'ID');
				setOptionBranchList(fmOptionBranch);
			}
		} catch (error) {
			showNoti('danger', error.message);
		}
	};
	useEffect(() => {
		fetchBranchList();
	}, []);

	const onUpdateCourseOfStudentPrice = (ID: number) => {
		return async (data: {
			FullNameUnicode: string;
			MoneyInDebt: string;
			Paid: string;
			PaymentMethodsID: number;
			PayBranchID: number;
			PayDate: string;
		}) => {
			try {
				setIsLoading({
					type: 'ADD_DATA',
					status: true
				});
				const { FullNameUnicode, PaymentMethodsID, PayBranchID, Paid, PayDate } = data;
				const newData = {
					ID,
					FullNameUnicode,
					PaymentMethodsID,
					PayBranchID,
					Paid: parseInt(Paid.replace(/\D/g, '')),
					PayDate: moment(PayDate).format('YYYY/MM/DD')
				};
				const res = await courseStudentPriceApi.update(newData);
				if (res.status === 200) {
					showNoti('success', res.data.message);
					getDataJob();
					return true;
				}
			} catch (error) {
				showNoti('danger', error.message);
			} finally {
				setIsLoading({
					type: 'ADD_DATA',
					status: false
				});
			}
		};
	};
	const columns = [
		{
			title: 'Khóa học',
			dataIndex: 'Course',
			render: (Course: ICourse[]) => (
				<>
					{Course.map((item) => (
						<Link
							key={item.ID}
							href={{
								pathname: '/course/course-list/course-list-detail/[slug]',
								query: { slug: item.ID }
							}}
						>
							<a title={item.CourseName} className="finance-course-name font-weight-black d-block">
								{item.CourseName}
							</a>
						</Link>
					))}
				</>
			)
		},
		{
			title: 'Trung tâm',
			dataIndex: 'PayBranchName',
			render: (text) => <p className="font-weight-black">{text}</p>
		},
		{
			title: 'Tổng thanh toán',
			dataIndex: 'Price',
			render: (price) => <p className="font-weight-primary">{Intl.NumberFormat('en-US').format(price)}</p>
		},
		{
			title: 'Giảm giá',
			dataIndex: 'Reduced',
			render: (price) => <p className="font-weight-primary">{Intl.NumberFormat('en-US').format(price)}</p>
		},
		{
			title: 'Đã thanh toán',
			dataIndex: 'Paid',
			render: (price) => <p className="font-weight-primary">{Intl.NumberFormat('en-US').format(price)}</p>
		},
		{
			title: 'Số tiền còn lại',
			dataIndex: 'MoneyInDebt',
			render: (price) => <p className="font-weight-primary">{Intl.NumberFormat('en-US').format(price)}</p>
		},
		{
			title: 'Hình thức',
			dataIndex: 'PaymentMethodsName'
		},
		{
			title: 'Ngày hẹn trả',
			dataIndex: 'PayDate',
			render: (date) => (date ? moment(date).format('DD/MM/YYYY') : '')
		},
		{
			render: (data, record: any) => (
				<div onClick={(e) => e.stopPropagation()}>
					{!record.DonePaid && (
						<CourseOfStudentPriceForm
							isPayTuition={true}
							isLoading={isLoading}
							isUpdate={true}
							updateObj={record}
							optionBranchList={optionBranchList}
							paymentMethodOptionList={paymentMethodOptionList}
							handleSubmit={onUpdateCourseOfStudentPrice(record.ID)}
						/>
					)}
				</div>
			)
		}
	];

	useEffect(() => {
		getDataJob();
	}, [userID]);

	return <PowerTable Extra="Thông tin thanh toán" columns={columns} noScroll dataSource={paymentInfo} />;
};
export default RegCoursePayment;
