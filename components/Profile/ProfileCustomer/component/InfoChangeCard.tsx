import React from "react";
import { Timeline, Card } from "antd";
import { Clock } from "react-feather";

const InfoChangeCard = () => {
  return (
    <div className="container-fluid">
      <Card title="Lịch sử thay đổi tài khoản">
        <Timeline mode="left" style={{ paddingLeft: 5 }}>
          <Timeline.Item label="25/12/2019 14:38">
            <div>
              <h6>Kim Trí Tú</h6>
            </div>
            <div>
              <a>Tư vấn viên</a>
            </div>
            <div>Loại đào tạo: Academic</div>
          </Timeline.Item>
          <Timeline.Item
            label="25/12/2019 14:38"
            dot={<Clock style={{ fontSize: "16px" }} />}
            color="red"
          >
            <div>
              <h6>Kim Trí Tú</h6>
            </div>
            <div>
              <a>Tư vấn viên</a>
            </div>
            <div>Loại đào tạo: Academic</div>
          </Timeline.Item>
          <Timeline.Item label="25/12/2019 14:38">
            <div>
              <h6>Kim Trí Tú</h6>
            </div>
            <div>
              <a>Tư vấn viên</a>
            </div>
            <div>Loại đào tạo: Academic</div>
          </Timeline.Item>
          <Timeline.Item
            label="25/12/2019 14:38"
            dot={<Clock style={{ fontSize: "16px" }} />}
          >
            <div>
              <h6>Kim Trí Tú</h6>
            </div>
            <div>
              <a>Tư vấn viên</a>
            </div>
            <div>Mục đích học tập: Học tập</div>
          </Timeline.Item>
        </Timeline>
      </Card>
    </div>
  );
};
export default InfoChangeCard;
