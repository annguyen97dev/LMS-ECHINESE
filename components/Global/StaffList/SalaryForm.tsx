import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import { Form, Divider, Spin, Modal, Tooltip } from "antd";

import { useForm } from "react-hook-form";
import * as yup from "yup";
import InputTextField from "~/components/FormControl/InputTextField";
import DateField from "~/components/FormControl/DateField";
import SelectField from "~/components/FormControl/SelectField";
import TextAreaField from "~/components/FormControl/TextAreaField";
import { staffSalaryApi } from "~/apiBase";
import { useWrap } from "~/context/wrap";
import { data } from "~/lib/option/dataOption2";
import AvatarBase from "~/components/Elements/AvatarBase.tsx";
import {
  UserOutlined,
  DeploymentUnitOutlined,
  WhatsAppOutlined,
  MailOutlined,
  AimOutlined,
} from "@ant-design/icons";

import { Eye } from "react-feather";
import InputMoneyField from "~/components/FormControl/InputMoneyField";

let returnSchemaSalary = {};
let schemaSalary = null;

interface listData {
  Area: Array<Object>;
  DistrictID: Array<Object>;
  WardID: Array<Object>;
  Role: Array<Object>;
  Branch: Array<Object>;
  Purposes: Array<Object>;
  SourceInformation: Array<Object>;
  Parent: Array<Object>;
  Counselors: Array<Object>;
}

const optionGender = [
  {
    value: 0,
    title: "Nữ",
  },
  {
    value: 1,
    title: "Nam",
  },
  {
    value: 0,
    title: "Khác",
  },
];

let statusAdd = "add-staff";

const SalaryForm = (props) => {
  const {
    dataStaff,

    rowID,
    getIndex,
    index,
    onSubmitSalary,
    submitSalary,
    changeVisible,
  } = props;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { showNoti } = useWrap();
  const [isLoading, setIsLoading] = useState({
    type: "",
    status: false,
  });
  const showModal = () => {
    setIsModalVisible(true);
    rowID && getIndex(index);
  };

  // FORM SALARY
  const valueSalary = {
    Salary: null,
    UserInformationID: null,
    Style: null, //1 lương theo tháng , 2 lương theo giờ
    FullNameUnicode: null,
  };

  (function returnSchemaSalaryFunc() {
    returnSchemaSalary = { ...valueSalary };
    Object.keys(returnSchemaSalary).forEach(function (key) {
      returnSchemaSalary[key] = yup.mixed().required("Bạn không được để trống");
    });

    schemaSalary = yup.object().shape(returnSchemaSalary);
  })();

  const formSalary = useForm({
    defaultValues: valueSalary,
    resolver: yupResolver(schemaSalary),
  });

  const onSubmitFormSalary = async (data: any) => {
    console.log("Submit salary: ", data);
    let cloneDataSubmit = {
      Salary: data.Salary,
      UserInformationID: data.UserInformationID,
      Style: data.Style, //1 lương theo tháng , 2 lương theo giờ
    };

    setIsLoading({
      type: "ADD_DATA",
      status: true,
    });
    let res = null;
    try {
      res = await staffSalaryApi.add(cloneDataSubmit);
      if (res.status == 200) {
        showNoti("success", "Thành công");
        changeVisible();
      }
    } catch (error) {
      showNoti("danger", error.message);
    } finally {
      setIsLoading({
        type: "ADD_DATA",
        status: false,
      });
    }

    // let res = onSubmitSalary(cloneDataSubmit);

    // res.then(function (rs: any) {
    //   if (rs) {
    //     if (rs.status == 200) {
    //       setIsModalVisible(false);
    //       statusAdd = "add-staff";
    //     }
    //   }
    // });
  };

  //   useEffect(() => {
  //     if (submitSalary) {
  //       formSalary.handleSubmit(onSubmitFormSalary);
  //     }
  //   }, [submitSalary]);

  useEffect(() => {
    if (dataStaff) {
      formSalary.reset({
        UserInformationID: dataStaff.UserInformationID,
        FullNameUnicode: dataStaff.FullNameUnicode,
      });
    }
  }, [dataStaff]);

  return (
    <>
      <div className="box-form form-salary">
        <Form
          layout="vertical"
          onFinish={formSalary.handleSubmit(onSubmitFormSalary)}
        >
          <div className="row">
            <div className="col-12">
              <InputTextField
                form={formSalary}
                name="FullNameUnicode"
                label="Nhân viên"
                disabled={true}
              />
            </div>
            <div className="col-12">
              <SelectField
                form={formSalary}
                name="Style"
                label="Nguồn khách"
                optionList={[
                  {
                    title: "Tính lương theo tháng",
                    value: 1,
                  },
                  {
                    title: "Tính lương theo giờ",
                    value: 2,
                  },
                ]}
              />
            </div>
            <div className="col-12">
              <InputMoneyField
                form={formSalary}
                name="Salary"
                label="Mức lương"
              />
            </div>
          </div>

          <div className="row">
            <div className="col-12 d-flex justify-content-center">
              <div style={{ paddingRight: 5 }}>
                <button type="submit" className="btn btn-primary w-100">
                  Thêm lương
                  {isLoading.type == "ADD_DATA" && isLoading.status && (
                    <Spin className="loading-base" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </Form>
      </div>
    </>
  );
};

export default SalaryForm;
