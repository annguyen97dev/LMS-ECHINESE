import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import {
  Card,
  Form,
  Select,
  Input,
  Divider,
  Button,
  Upload,
  Spin,
  message,
} from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import TitlePage from "~/components/TitlePage";
import LayoutBase from "~/components/LayoutBase";
import ImgCrop from "antd-img-crop";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import InputTextField from "~/components/FormControl/InputTextField";
import DateField from "~/components/FormControl/DateField";
import SelectField from "~/components/FormControl/SelectField";
import TextAreaField from "~/components/FormControl/TextAreaField";
import {
  studentApi,
  areaApi,
  districtApi,
  wardApi,
  jobApi,
  puroseApi,
  branchApi,
  sourceInfomationApi,
  parentsApi,
} from "~/apiBase";
import { useWrap } from "~/context/wrap";
import StudentForm from "~/components/Global/Customer/Student/StudentForm";

const StudentAppointmentCreate = () => {
  return (
    <div>
      <div className="row">
        <div className="col-12 text-center">
          <TitlePage title="Lịch hẹn" />
        </div>
      </div>
      <StudentForm />
    </div>
  );
};
StudentAppointmentCreate.layout = LayoutBase;
export default StudentAppointmentCreate;
