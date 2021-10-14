import React, { FC, useState } from "react";
import "antd/dist/antd.css";
import { List, Avatar, Form, Button, Input } from "antd";

const { TextArea } = Input;

const fakeData = [
  {
    id: "01",
    name: "React-Hook-Form",
    content: "Mình hi vọng sẽ giúp các bạn sửa được lỗi :3",
    date: "13/10/2021",
  },
  {
    id: "02",
    name: "React-Hook-Form 2",
    content: "Mình hi vọng sẽ giúp các bạn sửa được lỗi :3 2",
    date: "13/10/2021",
  },
  {
    id: "03",
    name: "React-Hook-Form 3",
    content: "Mình hi vọng sẽ giúp các bạn sửa được lỗi 3",
    date: "13/10/2021",
  },
  {
    id: "04",
    name: "React-Hook-Form 4",
    content: "Mình hi vọng sẽ giúp các bạn sửa được lỗi 4",
    date: "13/10/2021",
  },
];

type props = {
  params: { name: ""; description: "" };
};

const Editor = ({ onChange, onSubmit, submitting, value }) => (
  <>
    <Form.Item>
      <TextArea rows={4} onChange={onChange} value={value} />
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

const RenderItem = ({ item }: { item: any }) => {
  return (
    <div className="row ml-3 wrap-render-item-quest">
      <Avatar className="avatar" src={fakeImage} />
      <div className="ml-3">
        <p>{item.name}</p>
        <p className="content">{item.content}</p>
        <span className="date">{item.date}</span>
      </div>
    </div>
  );
};

const fakeImage = "https://avatars.githubusercontent.com/u/73950683?v=4";

export const VideoQuestion: FC<props> = ({ params }) => {
  const [comment, setComment] = useState("");

  return (
    <div className="wrap-question pr-3">
      <div className="wrap-question__container">
        <span className="ml-3 wrap-question__title">
          Tất cả câu hỏi ({fakeData.length})
        </span>
        <List
          itemLayout="horizontal"
          dataSource={fakeData}
          pagination={{
            pageSize: 3,
          }}
          renderItem={(item) => (
            <List.Item className="wrap-render-item-quest" key={item.id}>
              <RenderItem item={item} />
            </List.Item>
          )}
        />
        <div className="ml-3 mt-4">
          <Editor
            onChange={(t) => {
              setComment(t.target.value);
            }}
            onSubmit={() => {
              // submit
            }}
            submitting={false}
            value={comment}
          />
        </div>
      </div>
    </div>
  );
};
