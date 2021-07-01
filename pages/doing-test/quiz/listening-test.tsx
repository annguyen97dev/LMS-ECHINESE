import React, { useState } from "react";
import { Card, Slider, Switch, Pagination, Checkbox } from "antd";

import { SoundOutlined, UserOutlined } from "@ant-design/icons";

import { Volume2 } from "react-feather";
import CheckboxQuestion from "~/components/Global/DoingTest/TypeQuestion/CheckboxQuestion";

const ListeningTest = () => {
  const [state, setState] = useState({ disabled: false });

  const { disabled } = state;

  function onChange_preview(e) {
    console.log(`checked = ${e.target.checked}`);
  }

  return (
    <div className="test-wrapper">
      <Card
        className="test-card"
        title={
          <div className="test-title-info">
            <h6 className="name-type-test">Listening</h6>
            <p className="info-user">
              <UserOutlined /> <span>Nguyễn An</span>
            </p>
          </div>
        }
        extra={
          <div className="extra-table">
            <Volume2 />

            <Slider
              defaultValue={100}
              disabled={disabled}
              className="sound-edit"
            />
          </div>
        }
      >
        <div className="test-body">
          <CheckboxQuestion />
        </div>
        <div className="test-footer">
          <div className="footer-preview">
            <Checkbox onChange={onChange_preview}>Preview</Checkbox>
          </div>
          <div className="footer-pagination">
            <Pagination defaultCurrent={1} total={50} />
          </div>
          <div className="footer-submit">
            <button className="btn btn-success">Submit</button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ListeningTest;
