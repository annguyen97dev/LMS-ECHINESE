import React from "react";
import { Card, Button } from "antd";
import { Editor } from "@tinymce/tinymce-react";
import TitlePage from "~/components/TitlePage";
import LayoutBase from "~/components/LayoutBase";
const Contract = () => {
  const onChange = (e) => {
    console.log(e.target.getContent());
  };

  return (
    <div className="row">
      <div className="col-12">
        <TitlePage title="Contract Detail" />
      </div>
      <Card>
        <div className="col-12">
          <Editor
            apiKey="la1igo0sfogafdrl7wrj7w9j1mghl7txxke654lgzvkt86im"
            initialValue="
          THỎA THUẬN CAM KẾT ĐẦU RA

          Số:  …  – ZIM/TTCKĐR/
          
          Căn cứ Bộ luật Dân sự số 91/2015/QH13 ngày 24/11/2015 và các văn bản pháp luật liên quan;
          
          Căn cứ nhu cầu và khả năng của các bên;
          
          Hôm nay {trung-tam} , Ngày {ngay} Tháng {thang} Năm {nam} . tại Trung tâm Anh ngữ ZIM, số nhà …………….., Phường ….……., Quận ……..….., Thành phố ……..….
          
          Chúng tôi gồm có:
          
          CÔNG TY CỔ PHẦN EDUVATOR (Gọi tắt là bên A – đơn vị quản lý Trung tâm Anh Ngữ ZIM)
          
          Địa chỉ: Số nhà 65 Yên Lãng, Phường Trung Liệt, Quận Đống Đa, Thành phố Hà Nội
          
          Mã số thuế: 0107346642
          
          Đại diện: Ông  TRỊNH XUÂN DƯƠNG
          
          Quốc tịch:  Việt Nam
          Chức vụ: Giám Đốc        
          Một bên là ông/bà:                                       
          
          (Gọi tắt là bên B – Đại điện cho học viên)
          
          Sinh năm:                   
          Quốc tịch:
          Số CMND:
          Ngày cấp:       
          Nơi cấp:
          Đại diện cho học viên: {hoc-vien}Sinh năm:     {nam-sinh}              
          Quốc tịch: {quoc-tich}
          Số CMND:{so-chung-minh}
          Ngày cấp:        {ngay-cap}
          Nơi cấp:{noi-cap}
          
          Điện thoại: {so-dien-thoai}
          Email: {email}
          
          Hai bên cùng ký kết thoả thuận cam kết đầu ra với các điều khoản như sau:
          
          ĐIỀU 1: MỤC ĐÍCH, THỜI GIAN VÀ CÔNG VIỆC CAM KẾT
          
          Bên A cung cấp khoá học cho Bên B trong thời gian .. tháng kể từ ngày…, tại Trung tâm Anh Ngữ ZIM – Số nhà …………, Phường …………., Quận …………., Thành phố…………. Cụ thể như sau:
          
          1.   Khóa học: {ten-truong-trinh-hoc}
          
          2.   Tổng số giờ học chính thức: {so-gio-hoc}
          
          3. Học phí: {hoc-phi}
          
          4.   Điểm kiểm tra đầu vào: {diem-dau-vao}
          
          5.   Cam kết kết quả đầu ra: {diem-dau-ra}
          
          ĐIỀU 2: QUYỀN LỢI VÀ NGHĨA VỤ CỦA BÊN B
          
           I.    Quyền lợi
          
          1.   Được Bên A cung cấp giáo trình khóa học phiên bản cập nhật mới nhất đảm bảo Bên B được tiếp cận với nguồn học liệu phù hợp với trình độ, năng lực và mục tiêu học tập của Bên B.
          
          2.   Được thông báo tham gia các hoạt động học tập ngoại khóa do Bên A tổ chức bao gồm: thi thử, hội thảo và các chương trình khác do ZIM tổ chức.
          
          3.   Được đổi lớp học tối đa hai (02) lần trong quá trình học. Cụ thể:
          
          3.1.Trường hợp tất cả học viên trong lớp học Bên B theo học thống nhất đổi lịch, Bên A sẽ đổi lịch học của lớp.
          
          3.2.Trường hợp chỉ có Bên B thay đổi lịch, Bên A sẽ đổi lớp tương đương  trình độ của Bên B.
          
          4.   Trong thời hạn mười bốn (14) ngày kể từ khi lớp học khai giảng, Bên B được yêu cầu đổi giáo viên tối đa hai (02) lần. Bên B được học thử với giáo viên để đánh giá mức độ phù hợp trước khi kí cam kết quyết định đổi giáo viên. Sau mười bốn (14) ngày Bên A sẽ không tiếp nhận xử lý yêu cầu thay đổi giảng viên của Bên B.
          
          5.   Được đổi chi nhánh đào tạo một (01) lần trong toàn bộ quá trình theo học tại Bên A. Bên A sẽ quyết định sắp xếp lịch học tại cơ sở mới trên cơ sở nguyện vọng của bên B.
          
          6.   Được chuyển nhượng khóa học cho người học mới sau tối đa ba (03) buổi học. Chỉ được chuyển nhượng một (01) lần và không chuyển nhượng cho học viên đang theo học Bên A.
          
          7.   Được nhận phương án hỗ trợ của Bên A khi và chỉ khi sau khi kết thúc các khóa học, Bên B đã đi thi nhưng kết quả thi (được thông báo chính thức bởi đơn vị tổ chức thi IELTS tại Việt Nam) không đạt điểm đầu ra như hai bên đã thỏa thuận, đồng thời Bên B đáp ứng đầy đủ các yêu cầu ở Khoản 2 Điều 2 và thực hiện Điểm 7.1, Khoản 1, Điều 2 của thỏa thuận. Cụ thể như sau:
          
          7.1.Bên B phải thực hiện bài kiểm tra đánh giá lại kiến thức khóa học do Bên A tổ chức. Dựa trên kết quả bài đánh giá lại, Bên B tham gia lại khóa học mới phù hợp do Bên A sắp xếp. Bên A không thu thêm phí đào tạo lại.
          
          7.2.Cam kết cơ bản: Trong trường hợp Bên B vi phạm yêu cầu trong Khoản 2, Điều 2 và thực hiện Điểm 7.1, Khoản 1, Điều 2,  Bên A hỗ trợ 100% lệ phí thi lại IELTS một lần (01) tại đơn vị tổ chức thi chính thức tại Việt Nam do bên A chỉ định. Thời gian thi lại dựa trên thỏa thuận thống nhất của hai (02) Bên.
          
          7.3.Cam kết toàn diện: Trong trường hợp Bên B không vi phạm các yêu cầu trong Khoản 2, Điều 2 và thực hiện Điểm 7.1, Khoản 1, Điều 2, Bên A sẽ tài trợ 100% tối đa ba (03) lần phí thi lại IELTS tại đơn vị tổ chức thi chính thức tại Việt Nam do bên A chỉ định. Thời gian thi lại dựa trên thỏa thuận thống nhất của hai (02) Bên.
          
          II.    Nghĩa vụ
          
          1.   Không nghỉ quá 10% tổng số giờ học chính thức (theo lịch học đã thống nhất với Bên A và dựa trên kết quả điểm danh của Bên A).
          
          2.   Hoàn thành 100% bài tập về nhà của lớp học và tham gia đầy đủ bài kiểm tra trong khóa do Bên A tổ chức.
          
          3.   Đạt yêu cầu tối thiểu (không quá 80%) số điểm của bài kiểm tra cuối khóa học.
          
          4.   Chấp hành đầy đủ nội quy và quy định học tập của Bên A.
          
          5.   Không bôi nhọ, làm xấu hình ảnh và uy tín của Bên A.
          
          6.   Thanh toán phí đào tạo đầy đủ và đúng hạn cho Bên A.
          
          ĐIỀU 3: NGHĨA VỤ VÀ QUYỀN HẠN CỦA BÊN A
          
           I.    Nghĩa vụ và trách nhiệm
          
          1.   Đảm bảo đủ điều kiện về cơ sở vật chất, cung cấp đầy đủ trang thiết bị cần thiết và nguồn học liệu đã được nêu ở Điểm 1, Khoản 1, Điều 2 để phục vụ mục đích học tập của Bên B.
          
          2.   Sắp xếp lớp học đúng trình độ và mục tiêu học tập cho Bên B.
          
          3.   Bố trí giảng viên đúng trình độ chuyên môn, năng lực sư phạm như đã thống nhất với Bên B để giảng dạy đạt hiệu quả và phù hợp mục tiêu đặt ra của Bên B.
          
          4.   Xử lý các vấn đề của Bên B liên quan đến chương trình học tại Bên A trong quá trình theo học.
          
          5.   Xử lý các thủ tục chuyển nhượng khóa học của Bên B trong trường hợp bên B chuyển nhượng khoá học theo Điểm 6, Khoản 1, Điều 2.
          
          II.    Quyền hạn
          
          1.   Được Bên B thanh toán phí dịch vụ đào tạo đầy đủ và đúng lịch.
          
          2.   Trong trường hợp Bên B có hành vi vi phạm pháp luật theo quy định hiện hành, Bên A sẽ dừng cung cấp dịch vụ đào tạo, đơn phương chấm dứt thoả thuận trước thời hạn mà không phải bồi thường bất kỳ chi phí nào cho Bên B và yêu cầu các cơ quan chức năng xử lý theo thẩm quyền đối với Bên B.
          
          3.   Thực hiện các biện pháp xử lý theo quy định của nội quy Bên A và quy định của pháp luật, nếu Bên B có hành vi trái với quy định của lớp học nói riêng và nội quy của Bên A.
          
          4.   Dựa trên kết quả học tập của Bên B và mong muốn của Bên B, để đảm bảo chất lượng đào tạo, Bên A có quyền sắp xếp chương trình học lại (miễn phí và bắt buộc) cho bên B hoặc đào tạo thêm chương trình học khác (có phí và không bắt buộc) nếu Bên B không đáp ứng các yêu cầu ở Khoản 2, Điều 2.
          
          5.   Có quyền đơn phương chấm dứt Thỏa thuận này nếu Bên B vi phạm bất kỳ nghĩa vụ nào theo quy định tại Thỏa thuận này mà không phải bồi thường bất kỳ chi phí nào cho Bên B.
          
          6.   Không thanh toán chi phí đào tạo trong mọi trường hợp chấm dứt Thỏa thuận này.
          
          ĐIỀU 4: BẢO LƯU KHÓA HỌC, HOÀN TIỀN
          
          1.   Trong trường hợp Bên B muốn bảo lưu khóa học hoặc gián đoạn việc học (nghỉ học) từ hai (02) tuần trở lên, Bên A sẽ cấp Biên bản xác nhận bảo lưu cho Bên B.
          
          2.   Bên B được bảo lưu một (01) lần duy nhất trong suốt thời gian học tại Bên A. Thời hạn bảo lưu tối đa ba (03) tháng.
          
          3.   Sau khi kết thúc bảo lưu, Bên B nhập học lại phải mang theo Biên bản xác nhận bảo lưu khóa học.
          
          4.   Học viên được Bên A đánh giá lại chi tiết trình độ và phải theo lịch học do Bên A sắp xếp.
          
          5.   Đối với trường hợp hoàn học phí, Bên A hoàn tiền 100% học phí của phần nội dung khóa học mà Bên B chưa học trong thời gian tối đa ba mươi (30) ngày. Việc hoàn học phí phải được sự đồng ý của người đại diện bên B.
          
          ĐIỀU 5: HIỆU LỰC CỦA CAM KẾT
          
          1.   Thỏa thuận này có hiệu lực kể từ ngày ký.
          
          2.   Thoả thuận này sẽ hết hiệu lực sau hai (02) tháng kể từ khi Bên B chính thức kết thúc tất cả chương trình học do Bên A cung cấp. Sau hai (02) tháng, nếu Bên B thi không đạt đầu ra và Bên B tuân thủ đúng đầy đủ quy định tại Thỏa thuận này, Bên A cam kết đào tạo lại và không tài trợ phí thi lại.
          
          ĐIỀU 6: ĐIỀU KHOẢN BẤT KHẢ KHÁNG
          
          1.   Nếu một trong hai bên ký kết bị ngăn cản trong việc thực hiện thoả thuận vì gặp trường hợp bất khả kháng, như chiến tranh, cháy, nổ, dịch bệnh, lũ lụt, bão, động đất… hay các sự kiện khác (ốm đau, tai nạn…)  thời gian thực hiện thoả thuận được kéo dài tương đương với thời gian chịu tác động của các trường hợp trên. Bên gặp bất khả kháng thông báo cho bên kia trong thời hạn sớm nhất sau khi xảy ra trường hợp bất khả kháng.
          
          2.   Nếu tác động của bất khả kháng tiếp tục kéo dài hơn một trăm hai mươi ngày (120) liên tục, cả hai bên sẽ giải quyết thực hiện tiếp thoả thuận thông qua thương lượng sớm nhất có thể.
          
          ĐIỀU 7: ĐIỀU KHOẢN GIẢI QUYẾT TRANH CHẤP
          
          1.   Bất kỳ tranh chấp nào giữa hai bên liên quan đến thoả thuận này bao gồm hình thức, thực hiện, vi phạm, hiệu lực hay bất kỳ nội dung của thoả thuận sẽ được giải quyết trước hết bằng thương lượng, đàm phán trên tinh thần thiện chí. Trong trường hợp, một bên không muốn hoặc các bên không thể giải quyết tranh chấp bằng biện pháp thương lượng, hoà giải trong thời hạn ba mươi (30) ngày kể từ ngày phát sinh tranh chấp, các bên đồng ý đưa tranh chấp ra giải quyết tại Toà án nhân dân có thẩm quyền tại Hà Nội.
          
          2.   Thỏa thuận này áp dụng và được điều chỉnh bởi pháp luật Việt Nam.
          
          3.   Các bên cam kết, trong suốt thời hạn Thỏa thuận có hiệu lực, mỗi Bên phải luôn bảo mật bất kỳ thông tin nào liên quan đến Thỏa thuận này.
          
          4.   Việc bất kỳ quy định nào của Thỏa thuận không có hiệu lực sẽ không ảnh hưởng tới hiệu lực của bất kỳ quy định nào khác trong Thỏa thuận.
          
          5.   Thoả thuận này được lập thành hai (02) bản như nhau, mỗi bên giữ một (01) bản và có giá trị pháp lý như nhau.
          
          
          
          
          Đại diện bên B                Đại điện bên A"
            init={{
              height: 700,
              branding: false,
              plugins: "link image code",
              toolbar:
                "undo redo | bold italic | alignleft aligncenter alignright | code",
            }}
            onChange={onChange}
          />
        </div>
        <div className="row pt-3">
          <div className="col-12 d-flex justify-content-center">
            <div style={{ paddingRight: 5 }}>
              <Button type="primary" size="large">
                Xác nhận
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
Contract.layout = LayoutBase;
export default Contract;
