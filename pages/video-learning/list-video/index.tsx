import React, { FC, useState } from "react";
import "antd/dist/antd.css";
import { List } from "antd";
import { RenderItem } from "./render-item";
import { spawn } from "child_process";

type props = {
  params: { name: ""; time: ""; listVideo: []; link: ""; videos: [] };
  onPress: any;
};
export const VideoList: FC<props> = ({ params, onPress }) => {
  return (
    <div className="wrap-video-list">
      <div className="wrap-video-list__container">
        <div className="wrap-video-list__title-2 video-shadow">
          <span className="ml-4 pl-1 none-selection">Nội dung khóa học</span>
        </div>
        <List
          itemLayout="horizontal"
          dataSource={params.videos}
          className="wrap-list-container"
          renderItem={(item) => (
            <RenderItem
              onPress={(p) => {
                onPress(p);
              }}
              item={item}
            />
          )}
        />
      </div>
    </div>
  );
};
