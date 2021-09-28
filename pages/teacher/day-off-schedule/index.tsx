import React from "react";
import LayoutBase from "~/components/LayoutBase";
import TitlePage from "~/components/TitlePage";
import { Card } from "antd";
import { Checkbox, DatePicker } from "antd";
import { Check } from "react-feather";

const DayOffSchedule = () => {
  function onChange(e) {
    console.log(`checked = ${e.target.checked}`);
  }

  function onChangeDate(date, dateString) {
    console.log(date, dateString);
  }

  return (
    <div className="day-off-schedule">
      <TitlePage title="Lịch nghỉ" />
      <Card
        title={
          <div>
            <DatePicker className="style-input" onChange={onChangeDate} />
          </div>
        }
      >
        <table className="table-dayoff">
          <thead>
            <tr>
              <th>Ca</th>
              <th>Thứ hai</th>
              <th>Thứ ba</th>
              <th>Thứ tư</th>
              <th>Thứ năm</th>
              <th>Thứ sáu</th>
              <th>Thứ bảy</th>
              <th>Chủ nhật</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>07:00 - 08:00</td>
              <td>
                <Checkbox onChange={onChange} />
              </td>
              <td>
                <Checkbox onChange={onChange} />
              </td>
              <td>
                <Checkbox onChange={onChange} />
              </td>
              <td>
                <Checkbox onChange={onChange} />
              </td>
              <td>
                <Checkbox onChange={onChange} />
              </td>
              <td>
                <Checkbox onChange={onChange} />
              </td>
              <td>
                <Checkbox onChange={onChange} />
              </td>
            </tr>
          </tbody>
        </table>
        <div className="note-info mt-5">
          <h6 className="mb-4">Thông tin thêm</h6>
          <div className="note-info__item">
            <div className="box grey"></div>
            <div className="text">
              <p>Được đăng ký</p>
            </div>
          </div>
          <div className="note-info__item">
            <div className="box white"></div>
            <div className="text">
              <p>Không được đăng ký(Có giờ nằm trong lịch dạy)</p>
            </div>
          </div>
          <div className="note-info__item">
            <div className="box red"></div>
            <div className="text">
              <p>Đã có lịch dạy</p>
            </div>
          </div>
          <div className="note-info__item">
            <div className="box blue">
              <Check />
            </div>
            <div className="text">
              <p>Đã đăng ký nghỉ</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

DayOffSchedule.layout = LayoutBase;
export default DayOffSchedule;
