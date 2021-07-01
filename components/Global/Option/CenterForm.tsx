import React, { FC, useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Button,
  message,
  Spin,
  Select,
  Tooltip,
  Skeleton,
} from "antd";
import { FormProvider, useForm } from "react-hook-form";
import { branchApi, areaApi, districtApi } from "~/apiBase";

import { useWrap } from "~/context/wrap";
import SelectFilterBox from "~/components/Elements/SelectFilterBox";
import { RotateCcw } from "react-feather";

// type CenterFormProps = IFormBaseProps & {
//   Id?: number;
// };

const CenterForm = React.memo((props: any) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { isLoading } = props;
  const { showNoti } = useWrap();
  const [dataArea, setDataArea] = useState<IArea[]>();
  const {
    reset,
    register,
    handleSubmit,
    control,
    setValue,
    formState: { isSubmitting, errors, isSubmitted },
  } = useForm();
  const { Option } = Select;

  const [dataDistrict, setDataDistrict] = useState<IDistrict[]>([]);

  //GET DATA AREA
  const getAllArea = () => {
    (async () => {
      try {
        const res = await areaApi.getAll();
        res.status == 200 && setDataArea(res.data.createAcc);
      } catch (err) {
        showNoti("danger", err);
      }
    })();
  };

  // Get DATA DISTRICT
  const getAllDistrict = (AreaID: number) => {
    (async () => {
      try {
        const res = await districtApi.getAll(AreaID);
        res.status == 200 && setDataDistrict(res.data.createAcc);
      } catch (err) {
        showNoti("danger", err.message);
      }
    })();
  };

  // SUBMI FORM
  const onSubmit = handleSubmit((data: any) => {
    let res = props._onSubmit(data);

    res.then(function (rs: any) {
      rs
        ? rs.status == 200 && setIsModalVisible(false)
        : showNoti("danger", "Server lỗi");
    });
  });

  useEffect(() => {
    if (props.rowData) {
      Object.keys(props.rowData).forEach(function (key) {
        setValue(key, props.rowData[key]);
      });

      // setValue("BranchCode", props.rowData.BranchCode);
      // setValue("BranchName", props.rowData.BranchName);
      // setValue("Phone", props.rowData.Phone);
      // setValue("Address", props.rowData.Address);
      // setValue("AreaID", props.rowData.AreaID);
      // setValue("DistrictID", props.rowData.DistrictID);
    }
  }, [props.rowData]);

  // FUNCTION SELECT
  const onChangeSelect = (name) => (value) => {
    name == "AreaID" && getAllDistrict(value);
    getAllDistrict(value);
    setValue(name, value);
  };

  useEffect(() => {
    isModalVisible && getAllArea();
  }, [isModalVisible]);

  useEffect(() => {
    setValue("Enable", true);
  }, []);

  return (
    <>
      {props.showIcon && (
        <button
          className="btn btn-icon edit"
          onClick={() => {
            setIsModalVisible(true), props.getBranchDetail(props.branchId);
          }}
        >
          <Tooltip title="Cập nhật">
            <RotateCcw />
          </Tooltip>
        </button>
      )}
      {props.showAdd && (
        <button
          className="btn btn-warning add-new"
          onClick={() => {
            setIsModalVisible(true);
          }}
        >
          Thêm mới
        </button>
      )}

      <Modal
        title="Tạo trung tâm"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <div className="container-fluid">
          <Form layout="vertical">
            <div className="row">
              <div className="col-12">
                <Form.Item label="Mã trung tâm">
                  {isLoading.type == "GET_WITH_ID" && isLoading.status ? (
                    <Skeleton
                      active
                      paragraph={{ rows: 0 }}
                      title={{ width: "100%" }}
                    />
                  ) : (
                    <Input
                      {...register("BranchCode")}
                      placeholder=""
                      className="style-input"
                      defaultValue={props.rowData?.BranchCode}
                      onChange={(e) => setValue("BranchCode", e.target.value)}
                    />
                  )}
                </Form.Item>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <Form.Item label="Tên trung tâm">
                  {isLoading.type == "GET_WITH_ID" && isLoading.status ? (
                    <Skeleton
                      active
                      paragraph={{ rows: 0 }}
                      title={{ width: "100%" }}
                    />
                  ) : (
                    <Input
                      {...register("BranchName")}
                      placeholder=""
                      className="style-input"
                      defaultValue={props.rowData?.BranchName}
                      onChange={(e) => setValue("BranchName", e.target.value)}
                    />
                  )}
                </Form.Item>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <Form.Item label="Số điện thoại">
                  {isLoading.type == "GET_WITH_ID" && isLoading.status ? (
                    <Skeleton
                      active
                      paragraph={{ rows: 0 }}
                      title={{ width: "100%" }}
                    />
                  ) : (
                    <Input
                      {...register("Phone")}
                      placeholder=""
                      className="style-input"
                      defaultValue={props.rowData?.Phone}
                      onChange={(e) => setValue("Phone", e.target.value)}
                    />
                  )}
                </Form.Item>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <Form.Item label="Địa chỉ">
                  {isLoading.type == "GET_WITH_ID" && isLoading.status ? (
                    <Skeleton
                      active
                      paragraph={{ rows: 0 }}
                      title={{ width: "100%" }}
                    />
                  ) : (
                    <Input
                      {...register("Address")}
                      placeholder=""
                      className="style-input"
                      defaultValue={props.rowData?.Address}
                      onChange={(e) => setValue("Address", e.target.value)}
                    />
                  )}
                </Form.Item>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <Form.Item label="Vùng">
                  {isLoading.type == "GET_WITH_ID" && isLoading.status ? (
                    <Skeleton
                      active
                      paragraph={{ rows: 0 }}
                      title={{ width: "100%" }}
                    />
                  ) : (
                    <Select
                      style={{ width: "100%" }}
                      className="style-input"
                      showSearch
                      placeholder="Select..."
                      optionFilterProp="children"
                      onChange={onChangeSelect("AreaID")}
                      defaultValue={props.rowData?.AreaID}
                    >
                      {dataArea?.map((item) => (
                        <Option value={item.AreaID}>{item.AreaName}</Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </div>
            </div>

            <div className="row">
              <div className="col-12">
                <Form.Item label="Quận">
                  {isLoading.type == "GET_WITH_ID" && isLoading.status ? (
                    <Skeleton
                      active
                      paragraph={{ rows: 0 }}
                      title={{ width: "100%" }}
                    />
                  ) : (
                    <Select
                      style={{ width: "100%" }}
                      className="style-input"
                      showSearch
                      placeholder="Select..."
                      optionFilterProp="children"
                      onChange={onChangeSelect("DistrictID")}
                    >
                      {dataDistrict?.length > 0 ? (
                        dataDistrict?.map((item) => (
                          <Option value={item.ID}>{item.DistrictName}</Option>
                        ))
                      ) : (
                        <Option value={5}>Không có data</Option>
                      )}
                    </Select>
                  )}
                </Form.Item>
              </div>
            </div>
            <div className="col-12">
              <Button
                className="w-100"
                type="primary"
                size="large"
                onClick={handleSubmit(onSubmit)}
              >
                LƯU
                {isLoading.type == "ADD_DATA" && isLoading.status && (
                  <Spin className="loading-base" />
                )}
              </Button>
            </div>
          </Form>
        </div>
      </Modal>
    </>
  );
});

export default CenterForm;
