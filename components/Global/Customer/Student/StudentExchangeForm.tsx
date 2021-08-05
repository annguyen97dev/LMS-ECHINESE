import React, { useEffect, useState, useMemo } from "react";
import { Modal, Form, Input, Spin, Tooltip, Skeleton } from "antd";
import { RotateCcw } from "react-feather";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import InputTextField from "~/components/FormControl/InputTextField";
import DateField from "~/components/FormControl/DateField";
import SelectField from "~/components/FormControl/SelectField";
import TextAreaField from "~/components/FormControl/TextAreaField";
import { useWrap } from "~/context/wrap";
import { number } from "yup/lib/locale";

let returnSchema = {};
let schema = null;

const StudentExchangeForm = React.memo((props: any) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { isLoading, rowID, _onSubmit, getIndex, index, rowData, listData } =
    props;

  const { showNoti } = useWrap();

  // -----  HANDLE ALL IN FORM -------------
  const defaultValuesInit = {
    UserInformationID: null,
    CounselorsID: null,
    FullNameUnicode: null,
  };

  (function returnSchemaFunc() {
    returnSchema = { ...defaultValuesInit };
    Object.keys(returnSchema).forEach(function (key) {
      switch (key) {
        case "Email":
          returnSchema[key] = yup
            .string()
            .email("Email nhập sai cú pháp")
            .required("Bạn không được để trống");
          break;

        default:
          returnSchema[key] = yup.mixed().required("Bạn không được để trống");
          break;
      }
    });

    schema = yup.object().shape(returnSchema);
  })();

  const form = useForm({
    defaultValues: defaultValuesInit,
    resolver: yupResolver(schema),
  });

  // SUBMI FORM
  const onSubmit = (data: any, e) => {
    let cloneDataSubmit = {
      UserInformationID: data.UserInformationID,
      CounselorsID: data.CounselorsID,
    };
    let res = _onSubmit(cloneDataSubmit, rowData);

    res.then(function (rs: any) {
      rs &&
        rs.status == 200 &&
        (setIsModalVisible(false), form.reset(defaultValuesInit));
    });
  };

  useEffect(() => {
    if (isModalVisible) {
      if (rowData) {
        form.reset(rowData);
      }
    }
  }, [isModalVisible]);

  return (
    <>
      {rowID ? (
        <button
          className="btn btn-icon edit"
          onClick={() => {
            setIsModalVisible(true);
            getIndex(index);
          }}
        >
          <Tooltip title="Cập nhật tư vấn viên">
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

      {/*  */}
      <Modal
        title={rowID ? "Sửa HV chuyển giao" : "Thêm HV chuyển giao"}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <div className="container-fluid">
          <Form layout="vertical" onFinish={form.handleSubmit(onSubmit)}>
            <div className="row">
              <div className="col-12">
                <InputTextField
                  disabled={true}
                  form={form}
                  name="FullNameUnicode"
                  label="Họ tên"
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-12 col-12">
                <SelectField
                  form={form}
                  name="CounselorsID"
                  label="Tư vấn viên"
                  optionList={listData.Counselors}
                />
              </div>
            </div>

            <div className="row mt-3">
              <div className="col-12">
                <button type="submit" className="btn btn-primary w-100">
                  Lưu
                  {isLoading.type == "ADD_DATA" && isLoading.status && (
                    <Spin className="loading-base" />
                  )}
                </button>
              </div>
            </div>
          </Form>
        </div>
      </Modal>
    </>
  );
});

export default StudentExchangeForm;
