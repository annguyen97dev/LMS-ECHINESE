import { Card } from "antd";
import React, { useState } from "react";
import { Form, Input, Button, Radio } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import LayoutBase from "~/components/LayoutBase";
type RequiredMark = boolean | "optional";

export default function Forms() {
  const [form] = Form.useForm();
  const [requiredMark, setRequiredMarkType] =
    useState<RequiredMark>("optional");

  const onRequiredTypeChange = ({
    requiredMarkValue,
  }: {
    requiredMarkValue: RequiredMark;
  }) => {
    setRequiredMarkType(requiredMarkValue);
  };

  return (
    <>
      <div className="row">
        <div className="col-6">
          <Card title="Input Style">
            <form>
              <div className="form-group">
                <input
                  type="text"
                  className="form-control input-default "
                  placeholder="input-default"
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  className="form-control input-rounded"
                  placeholder="input-rounded"
                />
              </div>
            </form>
          </Card>
        </div>

        <div className="col-6">
          <Card title="Textarea">
            <form>
              <div className="form-group">
                <textarea
                  className="form-control"
                  rows={4}
                  id="comment"
                ></textarea>
              </div>
            </form>
          </Card>
        </div>
      </div>
      <div className="space-between"></div>
      <div className="row">
        <div className="col-6">
          <Card title="Input ant desgin">
            <Form
              form={form}
              layout="vertical"
              initialValues={{ requiredMarkValue: requiredMark }}
              onValuesChange={onRequiredTypeChange}
              requiredMark={requiredMark}
            >
              <Form.Item label="Required Mark" name="requiredMarkValue">
                <Radio.Group>
                  <Radio.Button value="optional">Optional</Radio.Button>
                  <Radio.Button value>Required</Radio.Button>
                  <Radio.Button value={false}>Hidden</Radio.Button>
                </Radio.Group>
              </Form.Item>
              <Form.Item
                label="Field A"
                required
                tooltip="This is a required field"
              >
                <Input placeholder="input placeholder" />
              </Form.Item>
              <Form.Item
                label="Field B"
                tooltip={{
                  title: "Tooltip with customize icon",
                  icon: <InfoCircleOutlined />,
                }}
              >
                <Input placeholder="input placeholder" />
              </Form.Item>
              <Form.Item>
                <Button type="primary">Submit</Button>
              </Form.Item>
            </Form>
          </Card>
        </div>
      </div>
    </>
  );
}

Forms.layout = LayoutBase;
