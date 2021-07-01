import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import events from "../../../lib/create-course/events";
import "react-big-calendar/lib/css/react-big-calendar.css";
import TitlePage from "~/components/TitlePage";
import FormCreateCourse from "~/components/Global/CreateCourse/FormCreateCourse";
import InfoCourse from "~/components/Global/CreateCourse/InfoCourse";
import {
  Card,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Drawer,
  Collapse,
  Checkbox,
} from "antd";
import LayoutBase from "~/components/LayoutBase";
type LayoutType = Parameters<typeof Form>[0]["layout"];
const localizer = momentLocalizer(moment);

// Setup the localizer by providing the moment (or globalize) Object
// to the correct localizer.

// ------------ MAIN COMPONENT ------------------
const CreateCourse = (props: { props: any }) => {
  const { Option } = Select;

  // Collapse
  const { Panel } = Collapse;
  function callback(key) {
    console.log(key);
  }

  function onSearch(val) {
    console.log("search:", val);
  }
  const text = `
   A dog is a type of domesticated animal.
   Known for its loyalty and faithfulness,
   it can be found as a welcome guest in many households across the world.
 `;

  const onChange_CheckBox = (e) => {
    console.log(`checked = ${e.target.checked}`);
  };

  return (
    <div>
      <TitlePage title="Tạo khóa học" />

      <div className="row">
        <div className="col-md-8 col-12">
          <Card
            title="Xếp lịch học"
            extra={
              <div className="btn-page-course">
                <FormCreateCourse />
                <InfoCourse />
              </div>
            }
          >
            <div className="wrap-calendar">
              <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500 }}
              />
            </div>
          </Card>
        </div>
        <div className="col-md-4 col-12">
          <div className="wrap-card-info-course">
            <Card title="Thông tin khóa học" className="space-top-card">
              <div className="info-course">
                <Collapse onChange={callback}>
                  <Panel
                    header={
                      <div className="info-course-item">
                        <Checkbox
                          onChange={onChange_CheckBox}
                          value="item1"
                        ></Checkbox>
                        <p className="title">
                          Ngày học <span>1</span>
                        </p>
                        <ul className="info-course-list">
                          <li>Tiết 7: Môn học test</li>
                          <li>Tiết 8: Môn học test</li>
                        </ul>
                      </div>
                    }
                    key="1"
                  >
                    <div className="info-course-select">
                      <div className="row">
                        <div className="col-6">
                          <Select
                            className="style-input"
                            size="large"
                            showSearch
                            style={{ width: "100%" }}
                            placeholder="Chọn phòng"
                            optionFilterProp="children"
                            onSearch={onSearch}
                            filterOption={(input, option) =>
                              option.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            }
                          >
                            <Option value="jack">Lớp A</Option>
                            <Option value="lucy">Lớp B</Option>
                            <Option value="tom">Lớp C</Option>
                          </Select>
                        </div>

                        <div className="col-6">
                          <Select
                            className="style-input"
                            size="large"
                            showSearch
                            style={{ width: "100%" }}
                            placeholder="Chọn ca"
                            optionFilterProp="children"
                            onSearch={onSearch}
                            filterOption={(input, option) =>
                              option.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            }
                          >
                            <Option value="jack">Ca 1</Option>
                            <Option value="lucy">Ca 2</Option>
                            <Option value="tom">Ca 3</Option>
                          </Select>
                        </div>
                        <div className="col-12 mt-2">
                          <Select
                            className="style-input"
                            size="large"
                            showSearch
                            style={{ width: "100%" }}
                            placeholder="Chọn giáo viên"
                            optionFilterProp="children"
                            onSearch={onSearch}
                            filterOption={(input, option) =>
                              option.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            }
                          >
                            <Option value="jack">Nguyễn An</Option>
                            <Option value="lucy">Nguyễn Phi Hùng</Option>
                            <Option value="tom">Trương Thức</Option>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </Panel>
                  <Panel
                    header={
                      <div className="info-course-item">
                        <Checkbox
                          onChange={onChange_CheckBox}
                          value="item2"
                        ></Checkbox>
                        <p className="title">
                          Ngày học <span>1</span>
                        </p>
                        <ul className="info-course-list">
                          <li>Tiết 7: Môn học test</li>
                          <li>Tiết 8: Môn học test</li>
                        </ul>
                      </div>
                    }
                    key="2"
                  >
                    <div className="info-course-select">
                      <div className="row">
                        <div className="col-6">
                          <Select
                            className="style-input"
                            size="large"
                            showSearch
                            style={{ width: "100%" }}
                            placeholder="Chọn phòng"
                            optionFilterProp="children"
                            onSearch={onSearch}
                            filterOption={(input, option) =>
                              option.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            }
                          >
                            <Option value="jack">Lớp A</Option>
                            <Option value="lucy">Lớp B</Option>
                            <Option value="tom">Lớp C</Option>
                          </Select>
                        </div>

                        <div className="col-6">
                          <Select
                            className="style-input"
                            size="large"
                            showSearch
                            style={{ width: "100%" }}
                            placeholder="Chọn ca"
                            optionFilterProp="children"
                            onSearch={onSearch}
                            filterOption={(input, option) =>
                              option.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            }
                          >
                            <Option value="jack">Ca 1</Option>
                            <Option value="lucy">Ca 2</Option>
                            <Option value="tom">Ca 3</Option>
                          </Select>
                        </div>
                        <div className="col-12 mt-2">
                          <Select
                            className="style-input"
                            size="large"
                            showSearch
                            style={{ width: "100%" }}
                            placeholder="Chọn giáo viên"
                            optionFilterProp="children"
                            onSearch={onSearch}
                            filterOption={(input, option) =>
                              option.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            }
                          >
                            <Option value="jack">Nguyễn An</Option>
                            <Option value="lucy">Nguyễn Phi Hùng</Option>
                            <Option value="tom">Trương Thức</Option>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </Panel>
                  <Panel
                    header={
                      <div className="info-course-item">
                        <Checkbox
                          onChange={onChange_CheckBox}
                          value="item3"
                        ></Checkbox>
                        <p className="title">
                          Ngày học <span>1</span>
                        </p>
                        <ul className="info-course-list">
                          <li>Tiết 7: Môn học test</li>
                          <li>Tiết 8: Môn học test</li>
                        </ul>
                      </div>
                    }
                    key="3"
                  >
                    <div className="info-course-select">
                      <div className="row">
                        <div className="col-6">
                          <Select
                            className="style-input"
                            size="large"
                            showSearch
                            style={{ width: "100%" }}
                            placeholder="Chọn phòng"
                            optionFilterProp="children"
                            onSearch={onSearch}
                            filterOption={(input, option) =>
                              option.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            }
                          >
                            <Option value="jack">Lớp A</Option>
                            <Option value="lucy">Lớp B</Option>
                            <Option value="tom">Lớp C</Option>
                          </Select>
                        </div>

                        <div className="col-6">
                          <Select
                            className="style-input"
                            size="large"
                            showSearch
                            style={{ width: "100%" }}
                            placeholder="Chọn ca"
                            optionFilterProp="children"
                            onSearch={onSearch}
                            filterOption={(input, option) =>
                              option.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            }
                          >
                            <Option value="jack">Ca 1</Option>
                            <Option value="lucy">Ca 2</Option>
                            <Option value="tom">Ca 3</Option>
                          </Select>
                        </div>
                        <div className="col-12 mt-2">
                          <Select
                            className="style-input"
                            size="large"
                            showSearch
                            style={{ width: "100%" }}
                            placeholder="Chọn giáo viên"
                            optionFilterProp="children"
                            onSearch={onSearch}
                            filterOption={(input, option) =>
                              option.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            }
                          >
                            <Option value="jack">Nguyễn An</Option>
                            <Option value="lucy">Nguyễn Phi Hùng</Option>
                            <Option value="tom">Trương Thức</Option>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </Panel>
                  <Panel
                    header={
                      <div className="info-course-item">
                        <Checkbox
                          onChange={onChange_CheckBox}
                          value="item4"
                        ></Checkbox>
                        <p className="title">
                          Ngày học <span>1</span>
                        </p>
                        <ul className="info-course-list">
                          <li>Tiết 7: Môn học test</li>
                          <li>Tiết 8: Môn học test</li>
                        </ul>
                      </div>
                    }
                    key="4"
                  >
                    <div className="info-course-select">
                      <div className="row">
                        <div className="col-6">
                          <Select
                            className="style-input"
                            size="large"
                            showSearch
                            style={{ width: "100%" }}
                            placeholder="Chọn phòng"
                            optionFilterProp="children"
                            onSearch={onSearch}
                            filterOption={(input, option) =>
                              option.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            }
                          >
                            <Option value="jack">Lớp A</Option>
                            <Option value="lucy">Lớp B</Option>
                            <Option value="tom">Lớp C</Option>
                          </Select>
                        </div>

                        <div className="col-6">
                          <Select
                            className="style-input"
                            size="large"
                            showSearch
                            style={{ width: "100%" }}
                            placeholder="Chọn ca"
                            optionFilterProp="children"
                            onSearch={onSearch}
                            filterOption={(input, option) =>
                              option.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            }
                          >
                            <Option value="jack">Ca 1</Option>
                            <Option value="lucy">Ca 2</Option>
                            <Option value="tom">Ca 3</Option>
                          </Select>
                        </div>
                        <div className="col-12 mt-2">
                          <Select
                            className="style-input"
                            size="large"
                            showSearch
                            style={{ width: "100%" }}
                            placeholder="Chọn giáo viên"
                            optionFilterProp="children"
                            onSearch={onSearch}
                            filterOption={(input, option) =>
                              option.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            }
                          >
                            <Option value="jack">Nguyễn An</Option>
                            <Option value="lucy">Nguyễn Phi Hùng</Option>
                            <Option value="tom">Trương Thức</Option>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </Panel>
                  <Panel
                    header={
                      <div className="info-course-item">
                        <Checkbox
                          onChange={onChange_CheckBox}
                          value="item5"
                        ></Checkbox>
                        <p className="title">
                          Ngày học <span>1</span>
                        </p>
                        <ul className="info-course-list">
                          <li>Tiết 7: Môn học test</li>
                          <li>Tiết 8: Môn học test</li>
                        </ul>
                      </div>
                    }
                    key="5"
                  >
                    <div className="info-course-select">
                      <div className="row">
                        <div className="col-6">
                          <Select
                            className="style-input"
                            size="large"
                            showSearch
                            style={{ width: "100%" }}
                            placeholder="Chọn phòng"
                            optionFilterProp="children"
                            onSearch={onSearch}
                            filterOption={(input, option) =>
                              option.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            }
                          >
                            <Option value="jack">Lớp A</Option>
                            <Option value="lucy">Lớp B</Option>
                            <Option value="tom">Lớp C</Option>
                          </Select>
                        </div>

                        <div className="col-6">
                          <Select
                            className="style-input"
                            size="large"
                            showSearch
                            style={{ width: "100%" }}
                            placeholder="Chọn ca"
                            optionFilterProp="children"
                            onSearch={onSearch}
                            filterOption={(input, option) =>
                              option.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            }
                          >
                            <Option value="jack">Ca 1</Option>
                            <Option value="lucy">Ca 2</Option>
                            <Option value="tom">Ca 3</Option>
                          </Select>
                        </div>
                        <div className="col-12 mt-2">
                          <Select
                            className="style-input"
                            size="large"
                            showSearch
                            style={{ width: "100%" }}
                            placeholder="Chọn giáo viên"
                            optionFilterProp="children"
                            onSearch={onSearch}
                            filterOption={(input, option) =>
                              option.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            }
                          >
                            <Option value="jack">Nguyễn An</Option>
                            <Option value="lucy">Nguyễn Phi Hùng</Option>
                            <Option value="tom">Trương Thức</Option>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </Panel>
                </Collapse>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

CreateCourse.layout = LayoutBase;
export default CreateCourse;
