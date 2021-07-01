import { Card } from "antd";
import React from "react";

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

export function ExpandBoxService() {
  return (
    <div className="feedback-detail-text">
      <table className="tb-expand">
        <tr>
          <th>Ghi chú</th>
          <th>Ngày đặt</th>
          <th>Phương thức thanh toán</th>
          <th>Ngày Tạo</th>
        </tr>
        <tr>
          <td>Đăng ký thi IELTS tại BC hoặc IDP</td>
          <td>10/08/2019</td>
          <td>Thanh toán thẻ</td>
          <td>24/07/2019</td>
        </tr>
      </table>
    </div>
  );
}

export function ExpandBoxWarning() {
  return (
    <div className="feedback-detail-text">
      <table className="tb-expand">
        <tr>
          <th>Roll up</th>
          <th>Capacity</th>
          <th>Note</th>
          <th>Comment</th>
          <th>Solution</th>
        </tr>
        <tr>
          <td>Có</td>
          <td>Trung bình</td>
          <td>
            {" "}
            Làm đúng mới được khoảng 50% (12/25 câu đúng), dạng multiple choice
            part 3 làm rất chậm, thiếu từ vựng nên hầu như không hiểu
          </td>
          <td>[No comment]</td>
          <td>
            [Solution] Đối với kỹ năng nói của cô Trà, giáo viên đã nhắc nhở bạn
            làm bài tập. Nhờ cô Trà chia nhỏ bài tập thành 2 hoặc 3 ngày một lần
            và TVV sẽ liên lạc với Giang để yêu cầu bạn làm để gửi lại cô Trà
            đúng hạn. Đối với kỹ năng đọc, giáo viên đã giao thêm bài tập, trong
            tuần sẽ yêu cầu bạn lên phòng tự học hoặc đến sơm 1 tiếng trước giờ
            học để phụ đạo.{" "}
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
