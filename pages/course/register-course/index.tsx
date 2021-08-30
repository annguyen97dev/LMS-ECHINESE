import React, { Fragment, useEffect, useState } from "react";
import LayoutBase from "~/components/LayoutBase";
import { Form, Input, Select, Card, Switch, Spin } from "antd";
import { useWrap } from "~/context/wrap";
import { useForm } from "react-hook-form";
import { branchApi, programApi, studentApi, studyTimeApi } from "~/apiBase";
import moment from "moment";
import { courseRegistrationApi } from "~/apiBase/customer/student/course-registration";
import StudentExamOfServices from "~/components/Global/RegisterCourse/StudentExamOfServices";
import { studentExamServicesApi } from "~/apiBase/customer/student/student-exam-services";

const RegisterCourse = (props: any) => {
  const { Option } = Select;
  const [option, setOption] = useState(null);
  const [form] = Form.useForm();
  const { showNoti } = useWrap();
  const [loading, setLoading] = useState(false);
  const [userAll, setUserAll] = useState<IStudent[]>();
  const [userDetail, setUserDetail] = useState<IStudent>();
  const [branch, setBranch] = useState<IBranch[]>();
  const [program, setProgram] = useState<IProgram[]>();
  const [studyTime, setStudyTime] = useState<IStudyTime[]>();
  const [isLoading, setIsLoading] = useState(false);

  const fetchDataUser = () => {
    (async () => {
      try {
        const res = await studentApi.getAll({
          pageIndex: 1,
          pageSize: 99999,
        });
        //@ts-ignore
        res.status == 200 && setUserAll(res.data.data);
      } catch (err) {
        showNoti("danger", err.message);
      }
    })();
  };

  const fetchDataSelectList = () => {
    (async () => {
      try {
        const _branch = await branchApi.getAll({
          pageIndex: 1,
          pageSize: 99999,
          Enable: true,
        });
        const _program = await programApi.getAll({ selectAll: true });
        const _studyTime = await studyTimeApi.getAll({ selectAll: true });
        _branch.status == 200 && setBranch(_branch.data.data);
        _program.status == 200 && setProgram(_program.data.data);
        _studyTime.status == 200 && setStudyTime(_studyTime.data.data);
      } catch (err) {
        showNoti("danger", err.message);
      }
    })();
  };

  useEffect(() => {
    fetchDataUser();
    fetchDataSelectList();
  }, []);

  const onChange = (value) => {
    setOption(value);
  };

  const handleChangeUser = (value) => {
    setIsLoading(true);
    (async () => {
      try {
        const _detail = await studentApi.getWithID(value);
        //@ts-ignore
        _detail.status == 200 && setUserDetail(_detail.data.data);
      } catch (err) {
        showNoti("danger", err.message);
      } finally {
        setIsLoading(false);
      }
    })();
  };

  const onSubmit = async (data: any) => {
    console.log(data);
    setLoading(true);
    if (option == 1) {
      try {
        let res = await studentExamServicesApi.add({
          ...data,
          UserInformationID: userDetail.UserInformationID,
        });
        showNoti("success", res?.data.message);
        setLoading(false);
        form.resetFields();
      } catch (error) {
        showNoti("danger", error.message);
        setLoading(false);
      }
    }
    if (option == 4) {
      try {
        let res = await courseRegistrationApi.add(data);
        showNoti("success", res?.data.message);
        setLoading(false);
        form.resetFields();
      } catch (error) {
        showNoti("danger", error.message);
        setLoading(false);
      }
    }
  };

  return (
    <div className="container-fluid">
      <Form form={form} layout="vertical" onFinish={onSubmit}>
        <div className="row">
          <div className="col-6">
            <Card title="Thông tin cá nhân">
              <div className="row">
                <div className="col-md-6 col-12">
                  <Form.Item label="Loại đăng ký">
                    <Select
                      onChange={onChange}
                      className="style-input w-100"
                      placeholder="Đăng ký học"
                    >
                      <Option value={1}>Đăng ký đợt thi</Option>
                      <Option value={4}>Hẹn đăng ký</Option>
                    </Select>
                  </Form.Item>
                </div>
                <div className="col-md-6 col-12">
                  <Form.Item label="Có hơp đồng">
                    <Switch defaultChecked />
                  </Form.Item>
                </div>
              </div>
              {/*  */}
              {/*  */}
              <Spin spinning={isLoading}>
                <div className="row">
                  <div className="col-md-6 col-12">
                    <Form.Item
                      name="UserInformationID"
                      label="Email"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng điền đủ thông tin!",
                        },
                      ]}
                    >
                      <Select
                        className="style-input"
                        showSearch
                        optionFilterProp="children"
                        onChange={(value) => handleChangeUser(value)}
                      >
                        {userAll?.map((item, index) => (
                          <Option key={index} value={item.UserInformationID}>
                            {item.Email}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </div>

                  <div className="col-md-6 col-12">
                    <Form.Item label="Họ và tên">
                      <Input
                        value={userDetail ? userDetail.FullNameUnicode : ""}
                        className="style-input"
                        readOnly={true}
                      />
                    </Form.Item>
                  </div>
                </div>
                {/*  */}
                {/*  */}
                <div className="row">
                  <div className="col-md-6 col-12">
                    <Form.Item label="Ngày sinh">
                      <Input
                        readOnly={true}
                        className="style-input"
                        value={
                          userDetail
                            ? moment(userDetail.DOB).format("DD/MM/YYYY")
                            : ""
                        }
                      />
                    </Form.Item>
                  </div>
                  <div className="col-md-6 col-12">
                    <Form.Item label="SĐT">
                      <Input
                        readOnly={true}
                        value={userDetail ? userDetail.Mobile : ""}
                        className="style-input"
                      />
                    </Form.Item>
                  </div>
                </div>
                {/*  */}
                {/*  */}
                <div className="row">
                  <div className="col-md-6 col-12">
                    <Form.Item label="Tỉnh/Thành phố">
                      <Input
                        readOnly={true}
                        className="style-input"
                        value={userDetail ? userDetail.AreaName : ""}
                      />
                    </Form.Item>
                  </div>
                  <div className="col-md-6 col-12">
                    <Form.Item label="Quận/Huyện">
                      <Input
                        readOnly={true}
                        value={userDetail ? userDetail.DistrictName : ""}
                        className="style-input"
                      />
                    </Form.Item>
                  </div>
                </div>
                {/*  */}
                {/*  */}
                <div className="row">
                  <div className="col-md-6 col-12">
                    <Form.Item label="Phường xã">
                      <Input
                        readOnly={true}
                        value={userDetail ? userDetail.WardName : ""}
                        className="style-input"
                      />
                    </Form.Item>
                  </div>
                  <div className="col-md-6 col-12">
                    <Form.Item label="Địa chỉ - Mô tả">
                      <Input
                        readOnly={true}
                        value={
                          userDetail
                            ? `${userDetail.HouseNumber} ${userDetail.Address}`
                            : ""
                        }
                        className="style-input"
                      />
                    </Form.Item>
                  </div>
                </div>
                {/*  */}
                {/*  */}
                <div className="row">
                  <div className="col-md-6 col-12">
                    <Form.Item label="CMND">
                      <Input
                        readOnly={true}
                        value={userDetail ? userDetail.CMND : ""}
                        className="style-input"
                      />
                    </Form.Item>
                  </div>
                  <div className="col-md-6 col-12">
                    <Form.Item label="Nơi cấp">
                      <Input
                        readOnly={true}
                        value={userDetail ? userDetail.CMNDRegister : ""}
                        className="style-input"
                      />
                    </Form.Item>
                  </div>
                </div>
                {/*  */}
                {/*  */}
                <div className="row">
                  <div className="col-md-6 col-12">
                    <Form.Item label="Ngày cấp">
                      <Input
                        readOnly={true}
                        value={
                          userDetail
                            ? moment(userDetail.CMNDDate).format("DD/MM/YYYY")
                            : ""
                        }
                        className="style-input"
                      />
                    </Form.Item>
                  </div>
                  <div className="col-md-6 col-12">
                    <Form.Item label="Công việc">
                      <Input
                        readOnly={true}
                        className="style-input"
                        value={userDetail ? userDetail.JobName : ""}
                      />
                    </Form.Item>
                  </div>
                </div>
                {/*  */}
                {/*  */}
                <div className="row">
                  <div className="col-md-6 col-12">
                    <Form.Item label="Người nhà, liên hệ">
                      <Input
                        className="style-input"
                        readOnly={true}
                        value={userDetail ? userDetail.ParentsNameOf : ""}
                      />
                    </Form.Item>
                  </div>
                  <div className="col-md-6 col-12">
                    <Form.Item label="Tư vấn viên">
                      <Input
                        className="style-input"
                        readOnly={true}
                        //@ts-ignore
                        value={userDetail ? userDetail.CounselorsName : ""}
                      />
                    </Form.Item>
                  </div>
                </div>
                {/*  */}
                {/*  */}
                <div className="row">
                  <div className="col-md-6 col-12">
                    <Form.Item label="Nguồn khách">
                      <Input
                        readOnly={true}
                        className="style-input"
                        value={
                          userDetail ? userDetail.SourceInformationName : ""
                        }
                      />
                    </Form.Item>
                  </div>
                  <div className="col-md-6 col-12">
                    <Form.Item label="Mục đích học">
                      <Input
                        readOnly={true}
                        className="style-input"
                        value={
                          userDetail ? userDetail.AcademicPurposesName : ""
                        }
                      />
                    </Form.Item>
                  </div>
                </div>
              </Spin>

              {/*  */}
              {/*  */}

              {/*  */}
              {/*  */}
            </Card>
          </div>
          <div className="col-6">
            {option == 1 && (
              <StudentExamOfServices
                userID={userDetail ? userDetail.UserInformationID : null}
              />
            )}
            {option == 4 && (
              <Card title="Thông tin đăng kí">
                <div className="row">
                  <div className="col-12">
                    <Form.Item
                      name="BranchID"
                      label="Trung tâm mong muốn"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng điền đủ thông tin!",
                        },
                      ]}
                    >
                      <Select
                        className="style-input"
                        showSearch
                        optionFilterProp="children"
                      >
                        {branch?.map((item, index) => (
                          <Option key={index} value={item.ID}>
                            {item.BranchName}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </div>
                </div>

                <div className="row">
                  <div className="col-12">
                    <Form.Item
                      name="ProgramID"
                      label="Chương trình mong muốn"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng điền đủ thông tin!",
                        },
                      ]}
                    >
                      <Select
                        className="style-input"
                        showSearch
                        optionFilterProp="children"
                      >
                        {program?.map((item, index) => (
                          <Option key={index} value={item.ID}>
                            {item.ProgramName}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </div>
                </div>

                <div className="row">
                  <div className="col-12">
                    <Form.Item
                      name="StudyTimeID"
                      label="Ca học mong muốn"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng điền đủ thông tin!",
                        },
                      ]}
                    >
                      <Select
                        className="style-input"
                        showSearch
                        optionFilterProp="children"
                      >
                        {studyTime?.map((item, index) => (
                          <Option key={index} value={item.ID}>
                            {item.Name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </div>
                </div>

                <div className="row">
                  <div className="col-12 text-center text-left-mobile">
                    <button type="submit" className="btn btn-primary">
                      Xác nhận
                      {loading == true && <Spin className="loading-base" />}
                    </button>
                  </div>
                </div>
              </Card>
            )}
            {/* {option == 2 && <RegCourseBuy />}
            {option == 3 && <RegCoursePayment />} */}
          </div>
        </div>
      </Form>
    </div>
  );
};
RegisterCourse.layout = LayoutBase;

export default RegisterCourse;
