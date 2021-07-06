import React, { useEffect, useState } from "react";
import { Drawer, Form, Select, Input, Radio } from "antd";
import TinyBox from "~/components/Elements/TinyBox";
import { Edit } from "react-feather";

const FormSingle = () => {
  const [value, setValue] = React.useState(1);

  const onChange = (e) => {
    console.log("radio checked", e.target.value);
    setValue(e.target.value);
  };

  return (
    <div>
      <Form layout="vertical">
        <div className="row">
          <div className="col-md-12 col-12">
            <Form.Item label="Nhập câu hỏi">
              <TinyBox />
            </Form.Item>
          </div>
          <div className="col-12">
            <div className="wrap-form-question">
              <Radio.Group className="w-100" onChange={onChange} value={value}>
                <div className="row">
                  <div className="col-md-6 col-12">
                    <div className="box-group">
                      <Radio className="d-block" value={1}>
                        <span className="tick">A.</span>
                        <Input
                          type="text"
                          className="input-answer style-input"
                        />
                      </Radio>
                      <Radio className="d-block" value={2}>
                        <span className="tick">B.</span>
                        <Input
                          type="text"
                          className="input-answer style-input"
                        />
                      </Radio>
                    </div>
                  </div>
                  <div className="col-md-6 col-12">
                    <div className="box-group">
                      <Radio className="d-block" value={3}>
                        <span className="tick">C.</span>
                        <Input
                          type="text"
                          className="input-answer style-input"
                        />
                      </Radio>
                      <Radio className="d-block" value={4}>
                        <span className="tick">D.</span>
                        <Input
                          type="text"
                          className="input-answer style-input"
                        />
                      </Radio>
                    </div>
                  </div>
                </div>
              </Radio.Group>
            </div>
          </div>
          <div className="col-md-12">
            <Form.Item className="mb-0 text-right">
              <button
                className="btn btn-primary"
                style={{ marginRight: "10px" }}
              >
                Sửa ngay
              </button>
            </Form.Item>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default FormSingle;
