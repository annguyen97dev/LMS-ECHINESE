import React from "react";
import { Modal, Form, Input, Button } from "antd";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const AddLesson = ({ visible, onCancel }) => {
  return (
    <Modal title="Thêm mới" visible={visible} onCancel={onCancel} footer={null}>
      <div className="container-fluid">
        <Form layout="vertical">
          <div className="row">
            <div className="col-12">
              <Form.Item label="Section name">
                <Input placeholder="Nhập ..." />
              </Form.Item>
            </div>
          </div>
          <div className="row">
            <div className="col-9">
              <Form.Item label="Tên bài học">
                <Input placeholder="Nhập tên bài học" />
              </Form.Item>
            </div>
            <div className="col-3">
              <Form.Item label="Time out">
                <Input type="number" />
              </Form.Item>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <Form.Item label="Nội dung">
                <div className="CKEditor">
                  <CKEditor
                    editor={ClassicEditor}
                    data=""
                    onInit={(editor) => {
                      console.log("Editor is ready to use!", editor);
                    }}
                    onChange={(event, editor) => {
                      const data = editor.getData();
                      console.log({ event, editor, data });
                    }}
                  />
                </div>
              </Form.Item>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <Button className="w-100" type="primary">
                Lưu
              </Button>
            </div>
          </div>
        </Form>
      </div>
    </Modal>
  );
};

export default AddLesson;
