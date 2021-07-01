import { Card, Divider } from "antd";
import React from "react";
import { data } from "~/lib/invoice/data";

const InvoiceForm = () => {
  return (
    <div className="container-fluid d-flex justify-content-center w-50">
      <Card title={<h4>Phiếu thu {data.code}</h4>} className="card-invoice">
        {/*  */}
        <div className="row">
          <div className="col-6">
            <p className="text-title">HÓA ĐƠN TỪ</p>
            <p className="text-base">{data.company}</p>
            <div className="content space-y-10 text-report">
              <p>MST: {data.MST}</p>
              <p>Địa chỉ: {data.address}</p>
              <p>Chi nhánh: {data.center}</p>
            </div>
          </div>
          <div className="col-6 d-flex justify-content-end">
            <img
              src="/images/qr-code.png"
              style={{ width: 125, height: 125 }}
            />
          </div>
        </div>
        {/*  */}
        {/*  */}
        {/*  */}

        <div className="row">
          <div className="col-6">
            <p className="text-title">HÓA ĐƠN ĐẾN</p>
            <p className="text-base">{data.rpCreator}</p>
            <div className="content space-y-10 text-report">
              <p>Địa chỉ: {data.provincial}</p>
              <p>Số điện thoại: {data.tel} </p>
              <p>CMND: {data.idCard} </p>
              <p>Nơi cấp: {data.provincial}</p>
              <p>Ngày cấp: {data.regDate}</p>
              <p>Ghi chú: {data.note}</p>
            </div>
          </div>
          <div className="col-6 d-flex justify-content-end">
            <div>
              <p className="text-title">THÔNG TIN HÓA ĐƠN</p>
              <div className="content space-y-10 text-report">
                <p>Hóa đơn số: {data.code}</p>
                <p>Ngày thanh toán: {data.payDay} </p>
                <p>Hình thức thanh toán: {data.payType} </p>
              </div>
            </div>
          </div>
        </div>
        {/*  */}
        {/*  */}
        {/*  */}
        <div className="row pb-4">
          <p className="text-title d-flex justify-content-center">
            CHI TIẾT HÓA ĐƠN
          </p>
          <table className="table-invoice">
            <tr>
              <th>Loại</th>
              <th className="tb-left">Số tiền</th>
            </tr>

            {data.invoiceDetail.map((iv) => {
              return (
                <>
                  <tr>
                    <td>{iv.ivName}</td>
                    <td className="tb-left">{iv.money}</td>
                  </tr>
                </>
              );
            })}
          </table>
        </div>
        {/*  */}
        {/*  */}
        {/*  */}
        <div className="row pb-4">
          <div className="col-6">
            <p className="text-title">LƯU Ý</p>
            <ul className="list-invoice">
              <li>Học viên hoàn thành học phí trước khi tham gia khóa học.</li>
              <li>
                Ngày khai giảng dự kiến là ngày sớm nhất lớp học có thể bắt đầu,
                thời gian khai giảng có thể lùi không quá 2 tuần để đảm bảo tiến
                độ lớp học
              </li>
              <li>
                Phí đặt cọc để giữ chỗ học viên, phí này sẽ không được hoàn lại
                trong mọi trường hợp.
              </li>
              <li>
                Trước ngày khai giảng, trung tâm sẽ thông báo đầy đủ thông tin
                chi tiết lịch học và giờ học cho học viên qua điện thoại và tin
                nhắn, học viên vui lòng kiểm tra và xác nhận thông tin.
              </li>
              <li>
                Đối với mỗi khó học, học viên được bảo lưu một lần duy nhất.
                Thời hạn bảo lưu tối đa là 3 tháng.
              </li>
              <li>
                Khóa học được cam kết đầu ra dựa theo chính sách hoạt động của
                ZIM, học viên xem chi tiết tại: https://zim.vn/quy-che-hoat-dong
              </li>
            </ul>
          </div>
          <div className="col-6">
            <p className="text-title">THANH TOÁN</p>
            <table className="table-payment">
              <tr>
                <td className="tb-right">Ưu đãi</td>
                <td className="tb-left">1,050,000</td>
              </tr>
              <tr>
                <td className="tb-right">Đã thu</td>
                <td className="tb-left">1,050,000</td>
              </tr>
              <tr>
                <td className="tb-right">Còn lại</td>
                <td className="tb-left">0,0</td>
              </tr>
              <hr />
              <tr>
                <th className="tb-right">Tổng số tiền</th>
                <th className="tb-left">2,050,000</th>
              </tr>
            </table>
          </div>
        </div>
        {/*  */}
        {/*  */}
        {/*  */}
        <div className="row">
          <div className="col-6 signature">
            <p className="text-base">Người nộp tiền</p>
            <p>(Ký và ghi và rõ họ tên)</p>
          </div>
          <div className="col-6 signature">
            <p className="text-base">Người nộp tiền</p>
            <p>(Ký và ghi và rõ họ tên)</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default InvoiceForm;
