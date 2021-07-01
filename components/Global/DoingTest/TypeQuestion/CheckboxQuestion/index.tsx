import React from "react";
import { EditOutlined } from "@ant-design/icons";
import { Checkbox } from "antd";

const CheckboxQuestion = () => {
  function onChange(checkedValues) {
    console.log("checked = ", checkedValues);
  }

  return (
    <div className="wrap-checkbox-question">
      <div className="box-question">
        <div className="box-question-title">
          <h5 className="number-question">Question 21 - 22</h5>
          <p className="des-question">Choose two letters, A-E.</p>
          <p className="title-question">
            <EditOutlined />
            What are the TWO reasons why Vanessa doesn’t want to stay in the
            campus?
          </p>
        </div>
        <div className="box-question-content">
          <Checkbox.Group onChange={onChange}>
            <div className="question-item">
              <Checkbox value="val-1">A. the food is not good</Checkbox>
            </div>
            <div className="question-item">
              <Checkbox value="val-2">B. she has too many room mates</Checkbox>
            </div>
            <div className="question-item">
              <Checkbox value="val-3">C. it’s too expensive</Checkbox>
            </div>
            <div className="question-item">
              <Checkbox value="val-4">D. the room is too small</Checkbox>
            </div>
            <div className="question-item">
              {" "}
              <Checkbox value="val-5">
                E. its restriction regarding accessible hours
              </Checkbox>
            </div>
          </Checkbox.Group>
        </div>
      </div>

      <div className="box-question">
        <div className="box-question-title">
          <h5 className="number-question">Question 21 - 22</h5>
          <p className="des-question">Choose two letters, A-E.</p>
          <p className="title-question">
            <EditOutlined />
            What are the TWO reasons why Vanessa doesn’t want to stay in the
            campus?
          </p>
        </div>
        <div className="box-question-content">
          <Checkbox.Group onChange={onChange}>
            <div className="question-item">
              <Checkbox value="val-1">A. the food is not good</Checkbox>
            </div>
            <div className="question-item">
              <Checkbox value="val-2">B. she has too many room mates</Checkbox>
            </div>
            <div className="question-item">
              <Checkbox value="val-3">C. it’s too expensive</Checkbox>
            </div>
            <div className="question-item">
              <Checkbox value="val-4">D. the room is too small</Checkbox>
            </div>
            <div className="question-item">
              {" "}
              <Checkbox value="val-5">
                E. its restriction regarding accessible hours
              </Checkbox>
            </div>
          </Checkbox.Group>
        </div>
      </div>

      <div className="box-question">
        <div className="box-question-title">
          <h5 className="number-question">Question 21 - 22</h5>
          <p className="des-question">Choose two letters, A-E.</p>
          <p className="title-question">
            <EditOutlined />
            What are the TWO reasons why Vanessa doesn’t want to stay in the
            campus?
          </p>
        </div>
        <div className="box-question-content">
          <Checkbox.Group onChange={onChange}>
            <div className="question-item">
              <Checkbox value="val-1">A. the food is not good</Checkbox>
            </div>
            <div className="question-item">
              <Checkbox value="val-2">B. she has too many room mates</Checkbox>
            </div>
            <div className="question-item">
              <Checkbox value="val-3">C. it’s too expensive</Checkbox>
            </div>
            <div className="question-item">
              <Checkbox value="val-4">D. the room is too small</Checkbox>
            </div>
            <div className="question-item">
              {" "}
              <Checkbox value="val-5">
                E. its restriction regarding accessible hours
              </Checkbox>
            </div>
          </Checkbox.Group>
        </div>
      </div>
    </div>
  );
};

export default CheckboxQuestion;
