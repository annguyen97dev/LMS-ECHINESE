import React, { FC, useEffect, useState } from "react";
import "antd/dist/antd.css";
import { List, Button, Checkbox } from "antd";
import { DownloadOutlined } from "@ant-design/icons";

type props = {
  item: {
    id;
    Content: "";
    MinuteVideo: "";
    listVideo: [];
    link: "";
    Description: "";
  };
  onPress: any;
};

let playing: string = "";

const RenderItemSub: FC<props> = ({ item, onPress }) => {
  const handleClick = () => {
    playing = item.id;
    onPress(item);
  };

  return (
    <a
      className="pt-3 pb-3 wrap-sub-item"
      style={{
        background: playing == item.id ? "#d1d7dc" : "#fff",
      }}
    >
      <Checkbox onClick={handleClick} className="mr-3" onChange={() => {}} />
      <div className="video-space-between">
        <p onClick={handleClick} className="none-selection">
          {item.Content}
        </p>
        <div className="pr-4 pl-0 mr-0 row wrap-download">
          <div onClick={handleClick} className="btn-download">
            <i className="fas mr-2 fa-play-circle"></i>
            <span className="date none-selection">{item.MinuteVideo}</span>
          </div>
          <Button
            className="btn-download"
            icon={<DownloadOutlined />}
            size="small"
          >
            Tải xuống
          </Button>
        </div>
      </div>
    </a>
  );
};

export const RenderItem: FC<props> = ({ item, onPress }) => {
  const [isShow, setShow] = useState(false);

  const handleClick = () => {
    setShow(!isShow);
  };

  return (
    <div className="wrap-render-item">
      <div
        className="pl-5 pt-3 pb-3 row wrap-render-item-2"
        onClick={handleClick}
      >
        <div className="">
          <p className="none-selection">
            {item.Content} - {item.Description}
          </p>
          <span className="date none-selection">
            {item.MinuteVideo !== null && item.MinuteVideo !== undefined
              ? item.MinuteVideo + " phút"
              : "Thời gian: không rõ"}
          </span>
        </div>

        {isShow ? (
          <div>
            <i className="far fa-chevron-up"></i>
          </div>
        ) : (
          <div>
            <i className="far fa-chevron-down"></i>
          </div>
        )}
      </div>

      {isShow && (
        <List
          itemLayout="horizontal"
          dataSource={item.listVideo}
          renderItem={(item) => (
            <RenderItemSub
              onPress={(p) => {
                onPress(p);
              }}
              item={item}
            />
          )}
        />
      )}
    </div>
  );
};
