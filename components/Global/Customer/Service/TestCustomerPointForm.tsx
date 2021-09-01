import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Input, Select, Spin, Tooltip } from "antd";
import { Info, RotateCcw } from "react-feather";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import InputTextField from "~/components/FormControl/InputTextField";
import DateField from "~/components/FormControl/DateField";
import SelectField from "~/components/FormControl/SelectField";
import TextAreaField from "~/components/FormControl/TextAreaField";
import { useWrap } from "~/context/wrap";
import { id } from "date-fns/locale";
import TimePickerField from "~/components/FormControl/TimePickerField";
import InputMoneyField from "~/components/FormControl/InputMoneyField";

let returnSchema = {};
let schema = null;

const TestCustomerPointForm = (props) => {
  const { TextArea } = Input;
  const { Option } = Select;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const {
    isLoading,
    rowID,
    _onSubmit,
    getIndex,
    index,
    rowData,
    listData,
    teacherList,
  } = props;

  const { showNoti } = useWrap();

  // -----  HANDLE ALL IN FORM -------------
  const defaultValuesInit = {
    ExamAppointmentID: null,
    ListeningPoint: null,
    SpeakingPoint: null,
    ReadingPoint: null,
    WritingPoint: null,
    VocabPoint: null,
    MaxTuitionOfStudent: null,
    Note: null,
    TeacherID: null,
  };

  (function returnSchemaFunc() {
    returnSchema = { ...defaultValuesInit };
    Object.keys(returnSchema).forEach(function (key) {
      switch (key) {
        default:
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
  const onSubmit = (data: any) => {
    console.log("Data Submit 1: ", data);
    data.MaxTuitionOfStudent = parseFloat(
      data.MaxTuitionOfStudent.replace(/,/g, "")
    );
    console.log("Data Submit 2: ", data);
    let res = _onSubmit(data);

    res.then(function (rs: any) {
      rs &&
        rs.status == 200 &&
        (setIsModalVisible(false), form.reset(defaultValuesInit));
    });
  };

  useEffect(() => {
    if (isModalVisible) {
      if (rowData) {
        if (rowData.MaxTuitionOfStudent) {
          let money = rowData.MaxTuitionOfStudent.toString();
          rowData.MaxTuitionOfStudent = parseInt(
            money.replace(/\,/g, ""),
            10
          ).toLocaleString();
        }

        form.reset(rowData);
        form.setValue("ExamAppointmentID", rowID);
      }
    }
  }, [isModalVisible]);

  return (
    <>
      <Tooltip title="Cập nhật">
        <button
          className="btn btn-icon edit"
          onClick={() => {
            setIsModalVisible(true);
            getIndex(index);
          }}
        >
          <RotateCcw />
        </button>
      </Tooltip>

      <Modal
        title="Bảng điểm test"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <div className="wrap-form">
          <Form layout="vertical" onFinish={form.handleSubmit(onSubmit)}>
            {/*  */}
            <div className="row">
              <div className="col-md-6 col-12">
                <InputTextField
                  form={form}
                  name="ListeningPoint"
                  label="Listening"
                />
              </div>
              <div className="col-md-6 col-12">
                <InputTextField
                  form={form}
                  name="SpeakingPoint"
                  label="Speaking"
                />
              </div>
            </div>
            {/*  */}
            <div className="row">
              <div className="col-md-6 col-12">
                <InputTextField
                  form={form}
                  name="ReadingPoint"
                  label="Reading"
                />
              </div>
              <div className="col-md-6 col-12">
                <InputTextField
                  form={form}
                  name="WritingPoint"
                  label="Writing"
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 col-12">
                <InputTextField
                  form={form}
                  name="VocabPoint"
                  label="Vocabulary"
                />
              </div>
              <div className="col-md-6 col-12">
                <InputMoneyField
                  form={form}
                  name="MaxTuitionOfStudent"
                  label="Học phí tối đa"
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-12 col-12">
                <SelectField
                  form={form}
                  name="TeacherID"
                  label="Giáo viên"
                  optionList={teacherList}
                />
              </div>
            </div>
            {/*  */}
            <div className="row">
              <div className="col-12">
                <TextAreaField
                  rows={3}
                  form={form}
                  name="Note"
                  label="Ghi chú"
                />
              </div>
            </div>
            {/*  */}
            <div className="row mt-3">
              <div className="col-12">
                <button type="submit" className="btn btn-primary w-100">
                  Lưu
                  {isLoading?.type == "ADD_DATA" && isLoading?.status && (
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
};

export default TestCustomerPointForm;
