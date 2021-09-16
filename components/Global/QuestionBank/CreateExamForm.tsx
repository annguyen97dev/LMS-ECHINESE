import React, { useEffect, useState } from "react";
import { Drawer, Form, Select, Spin } from "antd";
import Editor from "~/components/Elements/Editor";
import { Edit } from "react-feather";
import { examTopicApi, programApi, subjectApi } from "~/apiBase";
import { useWrap } from "~/context/wrap";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import InputTextField from "~/components/FormControl/InputTextField";
import DateField from "~/components/FormControl/DateField";
import SelectField from "~/components/FormControl/SelectField";
import TextAreaField from "~/components/FormControl/TextAreaField";
import { string } from "yup/lib/locale";

let returnSchema = {};
let schema = null;

// type defaultValuesInit = {
//   Name: string;
//   Code: string; //mã đề thi
//   Description: string;
//   Type: number; //1-Trắc nghiệm 2-Tự luận
//   SubjectID: number;
//   Time: number; //Thời gian làm bài
// };

type dataOject = {
  title: string;
  value: number;
};

const CreateExamForm = (props) => {
  const { onFetchData, dataItem } = props;
  const { showNoti } = useWrap();
  const [visible, setVisible] = useState(false);
  const [value, setValue] = React.useState(1);
  const [openAns, setOpenAns] = useState(false);
  const [dataProgram, setDataProgram] = useState<dataOject[]>([]);
  const [dataSubject, setDataSubject] = useState<dataOject[]>([]);
  const [loadingSelect, setLoadingSelect] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const showDrawer = () => {
    setVisible(true);
  };
  const onClose = () => {
    setVisible(false);
  };

  const { Option } = Select;

  // GET DATA PROGRAM
  const getDataProgram = async () => {
    try {
      let res = await programApi.getAll({ pageIndex: 1, pageSize: 999999 });
      if (res.status == 200) {
        let newData = res.data.data.map((item) => ({
          title: item.ProgramName,
          value: item.ID,
        }));
        setDataProgram(newData);
      }

      res.status == 204 && showNoti("danger", "Chương trình không có dữ liệu");
    } catch (error) {
      showNoti("danger", error.message);
    } finally {
    }
  };

  // HANDLE CHANGE - SELECT PROGRAM
  const handleChange_selectProgram = (value) => {
    setDataSubject([]);
    getDataSubject(value);
    form.setValue("SubjectID", null);
  };

  // GET DATA SUBJECT
  const getDataSubject = async (id) => {
    setLoadingSelect(true);
    try {
      let res = await subjectApi.getAll({
        pageIndex: 1,
        pageSize: 999999,
        ProgramID: id,
      });
      if (res.status == 200) {
        let newData = res.data.data.map((item) => ({
          title: item.SubjectName,
          value: item.ID,
        }));
        setDataSubject(newData);
      }

      res.status == 204 && showNoti("danger", "Môn học không có dữ liệu");
    } catch (error) {
      showNoti("danger", error.message);
    } finally {
      setLoadingSelect(false);
    }
  };

  // -----  HANDLE ALL IN FORM -------------
  const defaultValuesInit = {
    Name: null,
    Code: null, //mã đề thi
    Description: null,
    Type: null, //1-Trắc nghiệm 2-Tự luận
    SubjectID: null,
    Time: null, //Thời gian làm bài
  };

  (function returnSchemaFunc() {
    returnSchema = { ...defaultValuesInit };
    Object.keys(returnSchema).forEach(function (key) {
      switch (key) {
        default:
          // returnSchema[key] = yup.mixed().required("Bạn không được để trống");
          return;
          break;
      }
    });

    schema = yup.object().shape(returnSchema);
  })();

  const form = useForm({
    defaultValues: defaultValuesInit,
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: any) => {
    console.log("Data submit: ", data);
    setIsLoading(true);
    let res = null;
    try {
      if (dataItem?.ID) {
        res = await examTopicApi.update(data);
      } else {
        res = await examTopicApi.add(data);
      }

      if (res.status == 200) {
        showNoti("success", "Tạo đề thi thành công!");
        setVisible(false);
        onFetchData();
        form.reset(defaultValuesInit);
      }
    } catch (error) {
      showNoti("danger", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (visible) {
      getDataProgram();
      if (dataItem) {
        getDataSubject(dataItem.ProgramID);
        form.reset(dataItem);
      }
    }
  }, [visible]);

  return (
    <>
      {dataItem?.ID ? (
        <button className="btn btn-icon edit" onClick={showDrawer}>
          <Edit />
        </button>
      ) : (
        <button className="btn btn-success" onClick={showDrawer}>
          Tạo đề thi
        </button>
      )}

      <Drawer
        title={props.isEdit ? "Form sửa đề thi" : "Form tạo đề thi"}
        placement="right"
        closable={false}
        onClose={onClose}
        visible={visible}
        width={700}
      >
        <Form layout="vertical" onFinish={form.handleSubmit(onSubmit)}>
          <div className="row">
            <div className="col-md-6 col-12">
              <InputTextField form={form} name="Name" label="Tên đề thi" />
            </div>
            <div className="col-md-6 col-12">
              <InputTextField form={form} name="Code" label="Mã đề thi" />
            </div>
            <div className="col-md-6 col-12">
              <SelectField
                disabled={dataItem?.ID && true}
                form={form}
                name="ProgramID"
                label="Chương trình"
                onChangeSelect={(value) => handleChange_selectProgram(value)}
                optionList={dataProgram}
              />
            </div>
            <div className="col-md-6 col-12">
              <SelectField
                disabled={dataItem?.ID && true}
                form={form}
                name="SubjectID"
                label="Môn học"
                isLoading={loadingSelect}
                optionList={dataSubject}
              />
            </div>
            <div className="col-md-6 col-12">
              <InputTextField form={form} name="Time" label="Thời gian" />
            </div>
            <div className="col-md-6 col-12">
              <SelectField
                disabled={dataItem?.ID && true}
                form={form}
                name="Type"
                label="Dạng đề thi"
                optionList={[
                  {
                    value: 1,
                    title: "Trắc nghiệm",
                  },
                  {
                    value: 2,
                    title: "Tự luận",
                  },
                ]}
              />
            </div>
            <div className="col-12">
              <TextAreaField
                name="Description"
                label="Hướng dẫn làm bài"
                form={form}
              />
            </div>
            <div className="col-12">
              <div className="text-center">
                <button className="btn btn-light mr-2" onClick={onClose}>
                  Đóng
                </button>
                <button className="btn btn-primary" type="submit">
                  Lưu
                  {isLoading && <Spin className="loading-base" />}
                </button>
              </div>
            </div>
          </div>
        </Form>
      </Drawer>
    </>
  );
};

export default CreateExamForm;
