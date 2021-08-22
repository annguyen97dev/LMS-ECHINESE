//@ts-nocheck
import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Tooltip,
  Select,
  Spin,
  Divider,
  Skeleton,
  InputNumber,
  Switch,
} from "antd";
import { CreditCard, Move, RotateCcw } from "react-feather";
import { useWrap } from "~/context/wrap";
import { useForm } from "react-hook-form";
import {
  branchApi,
  courseApi,
  courseStudentApi,
  serviceApi,
  studentChangeCourseApi,
} from "~/apiBase";
import { courseStudentPriceApi } from "~/apiBase/customer/student/course-student-price";
import { courseRegistrationApi } from "~/apiBase/customer/student/course-registration";

const CourseRegForm = React.memo((props: any) => {
  const { Option } = Select;
  const { TextArea } = Input;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { infoId, reloadData, infoDetail, currentPage } = props;
  const [form] = Form.useForm();
  const { showNoti } = useWrap();
  const [loading, setLoading] = useState(false);
  const { setValue } = useForm();
  // const [courseStudentPrice, setCourseStudentPrice] = useState(null);
  const [isLoading, setIsLoading] = useState({
    type: "",
    status: false,
  });
  const [isLoadingCourseDetail, setIsLoadingCourseDetail] = useState(false);

  const [courseAfter, setCourseAfter] = useState<ICourse[]>();
  const [courseAfterId, setCourseAfterId] = useState();
  const [courseAfterDetail, setCourseAfterDetail] = useState<ICourseDetail>();
  const [isContract, setIsContract] = useState(false);
  // const [requestMoney, setRequestMoney] = useState();

  // const fetchDataPrice = () => {
  //   setIsLoading(true);
  //   (async () => {
  //     try {
  //       const _courseStudentPrice = await courseStudentPriceApi.getAll({
  //         UserInformationID: infoDetail.UserInformationID,
  //       });
  //       _courseStudentPrice.status == 200 &&
  //         setCourseStudentPrice(_courseStudentPrice.data.data);
  //     } catch (err) {
  //       showNoti("danger", err.message);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   })();
  // };

  const fetchDataCourseAfter = () => {
    setIsLoading(true);
    (async () => {
      try {
        const _courseAfter = await courseApi.getAll({
          pageIndex: 1,
          pageSize: 99999,
        });
        _courseAfter.status == 200 && setCourseAfter(_courseAfter.data.data);
      } catch (err) {
        showNoti("danger", err.message);
      } finally {
        setIsLoading(false);
      }
    })();
  };

  function handleChangeCourseAfter(idCourseAfter: number) {
    setCourseAfterId(idCourseAfter);
  }

  const fetchDataCourseAfterDetail = () => {
    setIsLoadingCourseDetail(true);
    (async () => {
      try {
        const _courseAfterDetail = await courseApi.getById(courseAfterId);
        _courseAfterDetail.status == 200 &&
          setCourseAfterDetail(_courseAfterDetail.data.data);
      } catch (err) {
        showNoti("danger", err.message);
      } finally {
        setIsLoadingCourseDetail(false);
      }
    })();
  };

  const onSubmit = async (data: any) => {
    setLoading(true);
    if (infoId) {
      try {
        let res = await courseRegistrationApi.intoCourse({
          ...data,
          ListCourseRegistration: [infoDetail.ID],
          isContract: isContract,
        });
        reloadData(currentPage);
        afterSubmit(res?.data.message);
      } catch (error) {
        showNoti("danger", error.message);
        setLoading(false);
      }
    }
  };

  const afterSubmit = (mes) => {
    showNoti("success", mes);
    setLoading(false);
    setIsModalVisible(false);
  };

  useEffect(() => {
    if (isModalVisible) {
      fetchDataCourseAfter();
    }
  }, [isModalVisible]);

  useEffect(() => {
    if (isModalVisible == true) {
      fetchDataCourseAfterDetail();
    }
  }, [courseAfterId]);

  return (
    <>
      <button
        className="btn btn-icon edit"
        onClick={() => {
          setIsModalVisible(true);
        }}
      >
        <Tooltip title="Chuyển học viên vào khóa học">
          <Move />
        </Tooltip>
      </button>
      <Modal
        title="Chuyển học viên vào khóa học"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <div className="container-fluid">
          <Form form={form} layout="vertical" onFinish={onSubmit}>
            <Spin spinning={isLoading}>
              <div className="row">
                <div className="col-8">
                  <Form.Item
                    // name="FullNameUnicode"
                    label="Học viên"
                  >
                    <Input
                      className="style-input"
                      readOnly={true}
                      value={infoDetail.FullNameUnicode}
                    />
                  </Form.Item>
                </div>
                <div className="col-4">
                  <Form.Item name="isContract" label="Hợp đồng">
                    <Switch onChange={() => setIsContract(!isContract)} />
                  </Form.Item>
                </div>
              </div>

              {courseAfter != null && (
                <div className="row">
                  <div className="col-12">
                    <Form.Item name="CourseID" label="Khóa học chuyển đến">
                      <Select
                        style={{ width: "100%" }}
                        className="style-input"
                        onChange={handleChangeCourseAfter}
                        placeholder="Chọn khóa học"
                      >
                        {courseAfter?.map((item, index) => (
                          <Option key={index} value={item.ID}>
                            {item.CourseName}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </div>
                </div>
              )}

              <Spin spinning={isLoadingCourseDetail}>
                <div className="row">
                  <div className="col-12">
                    <Form.Item label="Giá khóa học">
                      <Input
                        className="style-input w-100"
                        readOnly={true}
                        value={
                          courseAfterDetail != null
                            ? Intl.NumberFormat("ja-JP").format(
                                courseAfterDetail.Price
                              )
                            : ""
                        }
                      />
                    </Form.Item>
                  </div>
                </div>
              </Spin>
            </Spin>

            {/*  */}
            <div className="row ">
              <div className="col-12">
                <button type="submit" className="btn btn-primary w-100">
                  Lưu
                  {loading == true && <Spin className="loading-base" />}
                </button>
              </div>
            </div>
          </Form>
        </div>
      </Modal>
    </>
  );
});

export default CourseRegForm;
