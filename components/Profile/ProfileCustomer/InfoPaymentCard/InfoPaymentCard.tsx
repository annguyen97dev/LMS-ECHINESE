import {Divider} from 'antd';
import PropTypes from 'prop-types';
import React, {useEffect, useState} from 'react';
import {courseOfStudentPriceApi} from '~/apiBase';
import {useWrap} from '~/context/wrap';
import {numberWithCommas} from '~/utils/functions';
import PaymentCourseTable from './PaymentCourseTable';
import PaymentExamTable from './PaymentExamTable';
import RefundsTable from './RefundsTable';
InfoPaymentCard.propTypes = {
	studentID: PropTypes.number,
};
InfoPaymentCard.defaultProps = {
	studentID: 0,
};
function InfoPaymentCard(props) {
	const {studentID} = props;
	const {showNoti} = useWrap();
	const [totalDebt, setTotalDebt] = useState<number>(0);

	const getCourseOfStudentPriceAll = async () => {
		try {
			const res = await courseOfStudentPriceApi.getAll({
				pageSize: 9999,
				pageIndex: 1,
				UserInformationID: studentID,
			});
			if (res.status === 200) {
				const rs = res.data.data.reduce((total, course) => {
					total += course.MoneyInDebt;
					return total;
				}, 0);
				setTotalDebt(rs);
			}
		} catch (error) {
			showNoti('danger', error.message);
		}
	};

	useEffect(() => {
		getCourseOfStudentPriceAll();
	}, []);

	return (
		<div>
			<div className="pt-3 mb-3">
				<h5>Học phí còn nợ: {numberWithCommas(totalDebt)} VNĐ</h5>
			</div>
			<PaymentCourseTable studentID={studentID} />
			<Divider />
			<PaymentExamTable studentID={studentID} />
			<Divider />
			<RefundsTable studentID={studentID} />
		</div>
	);
}
export default InfoPaymentCard;
