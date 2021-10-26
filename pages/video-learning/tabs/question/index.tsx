import React, { FC, useState } from "react";
import "antd/dist/antd.css";
import { List, Avatar, Form, Button, Input } from "antd";
import { VideoCourseInteraction } from "~/apiBase/video-learning";

const { TextArea } = Input;

type props = {
  params: any[];
  addNew: any;
};

const Editor = ({ onChange, onSubmit, submitting, value }) => (
  <>
    <Form.Item>
      <TextArea
        placeholder="Nội dung"
        rows={4}
        onChange={onChange}
        value={value}
      />
    </Form.Item>
    <Form.Item>
      <Button
        htmlType="submit"
        loading={submitting}
        onClick={onSubmit}
        type="primary"
      >
        Thêm câu hỏi
      </Button>
    </Form.Item>
  </>
);

const getDateString = (date) => {
  const newDate = new Date(date);

  return (
    newDate.getHours() +
    ":" +
    newDate.getMinutes() +
    " " +
    getNumber(newDate.getDate()) +
    "-" +
    getNumber(newDate.getMonth() + 1) +
    "-" +
    getNumber(newDate.getFullYear())
  );
};

const getNumber = (num) => {
  return num > 9 ? num : "0" + num;
};

const RenderItem = ({ item }: { item: any }) => {
  return (
    <div className="ml-3 wrap-render-item-quest">
      <Avatar className="avatar custom-avt" src={item.AuthorAvatar} />
      <div className="ml-3 comment">
        <p className="title">{item.Title}</p>
        <p className="content">{item.TextContent}</p>
        <span className="date">
          <span className="name">{item.AuthorName}</span> {" - "}
          {getDateString(item.CreatedDate)}
        </span>
      </div>
    </div>
  );
};

export const VideoQuestion: FC<props> = ({ params, addNew }) => {
  const [comment, setComment] = useState("");
  const [title, setTile] = useState("");

  return (
    <div className="wrap-question pr-3">
      <div className="wrap-question__container">
        <span className="ml-3 wrap-question__title">
          Tất cả câu hỏi ({params.length})
        </span>
        <List
          className="mt-3"
          itemLayout="horizontal"
          dataSource={params}
          pagination={{
            pageSize: 10,
          }}
          renderItem={(item) => <RenderItem item={item} />}
        />
        <div className="ml-3 mt-4">
          <Input
            value={title}
            onChange={(t) => {
              setTile(t.target.value);
            }}
            className="mb-3"
            placeholder="Tiêu đề"
          />

          <Editor
            onChange={(t) => {
              setComment(t.target.value);
            }}
            onSubmit={() => {
              addNew({ comment: comment, title: title });
              setComment("");
              setTile("");
            }}
            submitting={false}
            value={comment}
          />
        </div>
      </div>
    </div>
  );
};
