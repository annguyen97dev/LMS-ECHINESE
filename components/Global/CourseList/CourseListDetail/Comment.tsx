import React from "react";
import { Timeline, Card } from "antd";
import { Clock, Folder } from "react-feather";
import { Editor } from "@tinymce/tinymce-react";

const Comment = () => {
  return (
    <div className="container-fluid">
      <Card title="Comment">
        <div>
          <Editor
            apiKey="la1igo0sfogafdrl7wrj7w9j1mghl7txxke654lgzvkt86im"
            init={{
              height: 340,
              branding: false,
              plugins: "link image code",
              toolbar:
                "undo redo | bold italic | alignleft aligncenter alignright | code",
            }}
          />
        </div>

        <div
          style={{ padding: "10px 0px 10px 0px" }}
          className="d-flex justify-content-end"
        >
          <button className="btn btn-warning">
            <Folder size={15} />
            <span className="tab-title">Submit</span>
          </button>
        </div>
        <div>
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
        </div>
      </Card>
    </div>
  );
};
export default Comment;
