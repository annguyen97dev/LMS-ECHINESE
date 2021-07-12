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

  const { rowData, branchId, isLoading, _onSubmit, getBranchDetail } = props;

  useEffect(() => {
    console.log("afjkalfjlakfjlafjklawjiowuoiajklawfjklawj",branchId);
  }, []);

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
    let res = _onSubmit(data);

    res.then(function (rs: any) {
      rs && rs.status == 200 && setIsModalVisible(false), form.resetFields();
    });
  });

  // ON CHANGE SELECT
  const onChangeSelect = (name) => (value) => {
    console.log("Name ", name);
    name == "AreaID" &&
      (form.setFieldsValue({ DistrictID: "" }), getDistrictByArea(value));
    setValue(name, value);
  };

  // Action khi mở modal sẽ run api area, và check coi tồn tại branchID hay ko
  useEffect(() => {
    if (isModalVisible) {
      getAllArea();
      if (branchId) {
        let res = getBranchDetail(branchId);

        res.then(function (rs: any) {
          rs && rs.status == 200 && setDataDetail(rs.data.data);
        });
      }
    }
  }, [isModalVisible]);

  // Sau khi lấy dc data chi tiết thì setValue cho nó
  useEffect(() => {
    if (dataDetail) {
      getDistrictByArea(dataDetail.AreaID);
      Object.keys(dataDetail).forEach(function (key) {
        setValue(key, dataDetail[key]);
      });
    }
  }, [dataDetail]);

  return (
    <>
      {branchId ? (
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
      ) : (
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
                <Form.Item name="BrandCode" label="Mã trung tâm">
                  <Input
                    placeholder=""
                    className="style-input"
                    defaultValue={rowData?.BranchCode}
                    onChange={(e) => setValue("BranchCode", e.target.value)}
                    allowClear={true}
                  />
                </Form.Item>
              </div>
            </div>

            <div className="row">
              <div className="col-12">
                <Form.Item name="BranchName" label="Tên trung tâm">
                  <Input
                    placeholder=""
                    className="style-input"
                    defaultValue={rowData?.BranchName}
                    onChange={(e) => setValue("BranchName", e.target.value)}
                    allowClear={true}
                  />
                </Form.Item>
              </div>
            </div>

            <div className="row">
              <div className="col-12">
                <Form.Item name="Phone" label="Phone">
                  <Input
                    placeholder=""
                    className="style-input"
                    defaultValue={rowData?.Phone}
                    onChange={(e) => setValue("Phone", e.target.value)}
                    allowClear={true}
                  />
                </Form.Item>
              </div>
            </div>

            <div className="row">
              <div className="col-12">
                <Form.Item name="Address" label="Địa chỉ">
                  <Input
                    placeholder=""
                    className="style-input"
                    defaultValue={rowData?.Address}
                    onChange={(e) => setValue("Address", e.target.value)}
                    allowClear={true}
                  />
                </Form.Item>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 col-12">
                <Form.Item name="AreaID" label="Vùng">
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
                </Form.Item>
              </div>

              <div className="col-md-6 col-12">
                <Form.Item name="DistrictID" label="Quận">
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
