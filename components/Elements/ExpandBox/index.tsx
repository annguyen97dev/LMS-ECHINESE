import { Card } from "antd";
import React from "react";
import ReactHtmlParser from 'react-html-parser';

export default function ExpandBox() {
  return (
    <div className="feedback-detail-text">
      <table className="tb-expand">
        <tr>
          <th>Trung tâm</th>
          <th>Ghi chú</th>
          <th>Cam kết</th>
          <th>Giá tiền</th>
          <th>Đã đóng</th>
          <th>Giảm giá</th>
          <th>Nhập ngày</th>
        </tr>
        <tr>
          <td>ZIM – 35 Võ Oanh</td>
          <td>[Ghi chú chuyển lớp]</td>
          <td>Cam kết được 8đ</td>
          <td>19.500.000</td>
          <td>19.500.000</td>
          <td>0</td>
          <td>30/03/2021</td>
        </tr>
      </table>
    </div>
  );
}

export function ExpandBoxService(props) {
  // console.log(props.dataRow);
  return (
    <div className="feedback-detail-text">
      <table className="tb-expand">
        <thead>
          <tr>
            <th>Lý do hoàn tiền</th>
            <th>Khóa học</th>
            <th>Phương thức thanh toán</th>
            <th>Ngày đặt</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{props.dataRow?.Reason == "" ? "Không có lý do" : props.dataRow?.Reason}</td>
            <td>
              <div className="list-coursename">
              {
                props.dataRow?.RefundsDetail && props.dataRow?.RefundsDetail.map((item, index) => (
                  <span className="item-coursename" key={index}>{item.CourseName}</span>
                ))
              }
              </div>
            </td>
            <td>{props.dataRow?.PaymentMethodsName}</td>
            <td>{props.dataRow?.CreatedOn}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export function ExpandBoxWarning(props) {
  return (
    <div className="feedback-detail-text">
      {/* <p>{props.dataRow.WarningNote != null ? props.dataRow.WarningNote : "Không có nội dung"}</p>  */}
      <table className="tb-expand">
        <tr>
          <th>Ghi chú</th>
          <th>Cam kết</th>
          <th>Cảnh báo</th>
        </tr>
        <tr>
          <td>{props.dataRow.Note != null ? props.dataRow.Note : "Không có nội dung"}</td>
          <td>{props.dataRow.Commitment != null ? props.dataRow.Commitment : "Không có nội dung"}</td>
          <td>
            {props.dataRow.WarningNote != null ? props.dataRow.WarningNote : "Không có nội dung"}
          </td>
        </tr>
      </table>
    </div>
  );
}

export function ExpandBoxPost() {
  return (
    <div className="feedback-detail-text">
      <>
        <Card>
          Thư giới thiệu là một phần quan trọng trong yêu cầu tuyển sinh của
          nhiều trường đại học trên thế giới, cho dù bạn đi học đại học hay thạc
          sĩ. Song song với bài luận cá nhân, thư giới thiệu góp phần cung cấp
          cái nhìn toàn diện về năng lực và tiềm năng của chúng ta. Và tất nhiên
          để cạnh tranh được với những thí sinh khác, chúng ta cần khác biệt,
          nổi trội so với phần đông. Anh đã từng viết rất nhiều thư giới thiệu
          cho học sinh, kể cả học sinh cấp 3, đại học hay thậm chí là người đi
          làm. Anh hiểu được cách các bạn đang hiểu nhầm mục đích của thư giới
          thiệu và phản ánh sự hiểu nhầm đó vào nội dung của thư. Anh cũng hiểu
          một thư giới thiệu xuất sắc cần phải đảm bảo những yếu tố như thế nào.
          Nên hôm nay anh sẽ đưa ra 3 tiêu chí giúp mọi người lên ý tưởng cho
          một (hoặc) nhiều bức thư giới thiệu mà thực sự sẽ để lại ấn tượng cho
          người đọc nhé.
        </Card>
      </>
    </div>
  );
}
