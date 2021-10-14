import React, { FC } from "react";
import "antd/dist/antd.css";
import { Descriptions } from "antd";

type props = {
  params: { name: ""; description: "" };
};

const title = "Thông tin khóa học";

export const VideoInfomation: FC<props> = ({ params }) => {
  return (
    <div className="wrap-infomation">
      <Descriptions className="ml-3 " column={1} title={title} bordered>
        <Descriptions.Item label="Tên khóa học">
          {params.name}
        </Descriptions.Item>
        <Descriptions.Item label="Giới thiệu">
          {params.description}
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
};
