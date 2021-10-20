import { Divider } from "antd";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { courseOfStudentPriceApi } from "~/apiBase";
import { useWrap } from "~/context/wrap";
import { numberWithCommas } from "~/utils/functions";
import PaymentTable from "./PaymentTable";
import RefundsTable from "./RefundsTable";
InfoPaymentCard.propTypes = {
  studentID: PropTypes.number,
};
InfoPaymentCard.defaultProps = {
  studentID: 0,
};
function InfoPaymentCard(props) {
  const { studentID } = props;
  const { showNoti, pageSize } = useWrap();
  const [totalDebt, setTotalDebt] = useState<number>(0);

  const getCourseOfStudentPriceAll = async () => {
    try {
      const res = await courseOfStudentPriceApi.getAll({
        pageSize: pageSize,
        pageIndex: 1,
        UserInformationID: studentID,
      });
      if (res.status === 200) {
        const rs = res.data.data.reduce((total, course) => {
          total += course.MoneyInDebt;
          return total;
        }, 0);
        setTotalDebt(rs);
      } else if (res.status === 204) {
      }
    } catch (error) {
      showNoti("danger", error.message);
    }
  };

  useEffect(() => {
    getCourseOfStudentPriceAll();
  }, []);

  return (
    <div className="container-fluid">
      <div className="pt-3 mb-3">
        <h5>Học phí còn nợ: {numberWithCommas(totalDebt)} VNĐ</h5>
      </div>
      <PaymentTable studentID={studentID} />
      <Divider />
      <RefundsTable studentID={studentID} />
    </div>
  );
}
export default InfoPaymentCard;
