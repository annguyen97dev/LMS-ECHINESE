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
  const [dataArea, setDataArea] = useState<IArea[]>(null);
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

  const [loadingSelect, setLoadingSelect] = useState(false);
  const [dataDetail, setDataDetail] = useState<IBranch>();

  const { rowData, branchId } = props;
  const [form] = Form.useForm();

  //GET DATA AREA
  const getAllArea = () => {
    (async () => {
      try {
        const res = await areaApi.getAll(true);
        res.status == 200 && setDataArea(res.data.data);
      } catch (err) {
        showNoti("danger", err);
      }
    })();
  };

  // Get DATA DISTRICT
  const getDistrictByArea = (AreaID: number) => {
    setLoadingSelect(true);

    setDataDistrict([]);
    (async () => {
      try {
        const res = await districtApi.getByArea(AreaID);
        res.status == 200 && setDataDistrict(res.data.data);
      } catch (err) {
        showNoti("danger", err.message);
      } finally {
        setLoadingSelect(false);
      }
    })();
  };

  // SUBMI FORM
  const onSubmit = handleSubmit((data: any, e) => {
    let res = props._onSubmit(data);

    res.then(function (rs: any) {
      rs && rs.status == 200 && setIsModalVisible(false), form.resetFields();
      reset({
        defaultValues: {
          BranchCode: "",
        },
      });
    });
  });

  // ON CHANGE SELECT
  const onChangeSelect = (name) => (value) => {
    console.log("Name ", name);

    name == "AreaID" &&
      (form.setFieldsValue({ DistrictID: "" }), getDistrictByArea(value));

    setValue(name, value);
  };

  useEffect(() => {
    // isModalVisible && getAllArea();

    if (isModalVisible) {
      getAllArea();
      if (branchId) {
        let res = props.getBranchDetail(branchId);

        res.then(function (rs: any) {
          rs && rs.status == 200 && setDataDetail(rs.data.data);
        });
      }
    }
  }, [isModalVisible]);

  useEffect(() => {
    if (dataDetail) {
      getDistrictByArea(dataDetail.AreaID);
      Object.keys(dataDetail).forEach(function (key) {
        setValue(key, dataDetail[key]);
      });
    }
  }, [dataDetail]);

  useEffect(() => {
    setValue("Enable", true);
  }, []);

  return (
    <>
      {props.showIcon && (
        <button
          className="btn btn-icon edit"
          onClick={() => {
            setIsModalVisible(true);
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
          <Form form={form} layout="vertical" onFinish={onSubmit}>
            <div className="row">
              <div className="col-12">
                <Form.Item name="BranchCode" label="Mã trung tâm">
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
                      defaultValue={rowData?.BranchCode}
                      onChange={(e) => setValue("BranchCode", e.target.value)}
                      allowClear={true}
                    />
                  )}
                </Form.Item>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <Form.Item name="BranchName" label="Tên trung tâm">
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
                      defaultValue={rowData?.BranchName}
                      onChange={(e) => setValue("BranchName", e.target.value)}
                      allowClear={true}
                    />
                  )}
                </Form.Item>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <Form.Item name="Phone" label="Số điện thoại">
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
                      defaultValue={rowData?.Phone}
                      onChange={(e) => setValue("Phone", e.target.value)}
                      allowClear={true}
                    />
                  )}
                </Form.Item>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <Form.Item name="Address" label="Địa chỉ">
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
                      defaultValue={rowData?.Address}
                      onChange={(e) => setValue("Address", e.target.value)}
                      allowClear={true}
                    />
                  )}
                </Form.Item>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 col-12">
                <Form.Item name="AreaID" label="Vùng">
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
                      optionFilterProp="children"
                      onChange={onChangeSelect("AreaID")}
                      defaultValue={rowData?.AreaID}
                    >
                      {dataArea?.map((item) => (
                        <Option value={item.AreaID}>{item.AreaName}</Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </div>

              <div className="col-md-6 col-12">
                <Form.Item name="DistrictID" label="Quận">
                  {isLoading.type == "GET_WITH_ID" && isLoading.status ? (
                    <Skeleton
                      active
                      paragraph={{ rows: 0 }}
                      title={{ width: "100%" }}
                    />
                  ) : (
                    <Select
                      loading={loadingSelect}
                      style={{ width: "100%" }}
                      className="style-input"
                      showSearch
                      optionFilterProp="children"
                      onChange={onChangeSelect("DistrictID")}
                      defaultValue={rowData?.DistrictID}
                    >
                      {dataDistrict?.length > 0 ? (
                        dataDistrict?.map((item) => (
                          <Option value={item.ID}>{item.DistrictName}</Option>
                        ))
                      ) : (
                        <Option value={5}>...</Option>
                      )}
                    </Select>
                  )}
                </Form.Item>
              </div>
            </div>

            <div className="col-12">
              <button type="submit" className="btn btn-primary w-100">
                Lưu
                {isLoading.type == "ADD_DATA" && isLoading.status && (
                  <Spin className="loading-base" />
                )}
              </button>
            </div>
          </Form>
        </div>
      </Modal>
    </>
  );
});

export default CenterForm;
