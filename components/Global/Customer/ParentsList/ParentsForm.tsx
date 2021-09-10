// import React, { Fragment, useEffect, useState } from "react";
// import {
//   Modal,
//   Form,
//   Input,
//   Tooltip,
//   Select,
//   Spin,
//   TimePicker,
//   DatePicker,
//   Divider,
// } from "antd";
// import { RotateCcw } from "react-feather";
// import { useWrap } from "~/context/wrap";
// import { useForm } from "react-hook-form";
// import {
//   areaApi,
//   branchApi,
//   districtApi,
//   parentsApi,
//   serviceApi,
//   studentApi,
// } from "~/apiBase";
// import moment from "moment";

// moment.locale("vn");

// const ParentsForm = React.memo((props: any) => {
//   const { Option } = Select;
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const { parentsID, reloadData, parentsDetail, currentPage } = props;
//   const [form] = Form.useForm();
//   const { showNoti } = useWrap();
//   const [loading, setLoading] = useState(false);
//   const { setValue } = useForm();
//   //@ts-ignore
//   const [branch, setBranch] = useState<IBranch[]>();
//   const [student, setStudent] = useState<IStudent[]>();
//   const [district, setDistrict] = useState<IDistrict[]>();
//   const [area, setArea] = useState<IArea[]>();

//   const fetchData = () => {
//     (async () => {
//       try {
//         const _branch = await branchApi.getAll({
//           pageIndex: 1,
//           pageSize: 9999,
//           Enable: true,
//         });
//         // const _student = await studentApi.getAll({ selectAll: true });
//         const _area = await areaApi.getAll({ pageIndex: 1, pageSize: 9999 });

//         //@ts-ignore
//         _branch.status == 200 && setBranch(_branch.data.data);
//         //@ts-ignore
//         // _student.status == 200 && setStudent(_student.data.data);
//         //@ts-ignore
//         _area.status == 200 && setArea(_area.data.data);
//       } catch (err) {
//         showNoti("danger", err.message);
//       }
//     })();
//   };

//   const getDistrictByArea = (AreaID: number) => {
//     (async () => {
//       try {
//         const res = await districtApi.getByArea(AreaID);
//         res.status == 200 && setDistrict(res.data.data);
//       } catch (err) {
//         showNoti("danger", err.message);
//       }
//     })();
//   };

//   const onChangeSelect = (name) => (value) => {
//     name == "AreaID" &&
//       (form.setFieldsValue({ DistrictID: "" }), getDistrictByArea(value));
//     setValue(name, value);
//   };

//   const gender = [
//     {
//       id: 0,
//       type: "Nữ",
//     },
//     {
//       id: 1,
//       type: "Nam",
//     },
//     {
//       id: 2,
//       type: "Khác",
//     },
//   ];

//   useEffect(() => {
//     // if (isModalVisible) {
//     //   fetchData();
//     // }
//     fetchData();
//   }, []);

//   const onSubmit = async (data: any) => {
//     console.log("Data submit: ", data);
//     if (typeof data.Course != "undefined") {
//       data.Course = data.Course.toString();
//     } else {
//       data.Course = "";
//     }

//     setLoading(true);
//     if (parentsID) {
//       try {
//         let res = await parentsApi.update({
//           ...data,
//           Enable: true,
//           UserInformationID: parentsID,
//           Branch: data.Branch.toString(),
//         });
//         reloadData(currentPage);
//         afterSubmit(res?.data.message);
//       } catch (error) {
//         showNoti("danger", error.message);
//         setLoading(false);
//       }
//     } else {
//       try {
//         let res = await parentsApi.add({ ...data, Enable: true });
//         afterSubmit(res?.data.message);
//         reloadData(1);
//         form.resetFields();
//       } catch (error) {
//         showNoti("danger", error.message);
//         setLoading(false);
//       }
//     }
//   };

//   const afterSubmit = (mes) => {
//     showNoti("success", mes);
//     setLoading(false);
//     setIsModalVisible(false);
//   };

//   useEffect(() => {
//     if (parentsDetail) {
//       let arrBranch = [];
//       parentsDetail.Branch.forEach((item, index) => {
//         arrBranch.push(item.ID);
//       });
//       console.log("arrBranch: ", arrBranch);
//       form.setFieldsValue({
//         ...parentsDetail,
//         Branch: arrBranch,
//         DOB: null,
//         CMNDDate: null,
//       });
//     }
//   }, [parentsDetail]);

//   return (
//     <>
//       {parentsID ? (
//         <button
//           className="btn btn-icon edit"
//           onClick={() => {
//             setIsModalVisible(true);
//           }}
//         >
//           <Tooltip title="Cập nhật">
//             <RotateCcw />
//           </Tooltip>
//         </button>
//       ) : (
//         <button
//           className="btn btn-warning add-new"
//           onClick={() => {
//             setIsModalVisible(true);
//           }}
//         >
//           Thêm mới
//         </button>
//       )}

//       <Modal
//         title={<>{parentsID ? "Cập nhật phụ huynh" : "Tạo mới phụ huynh"}</>}
//         visible={isModalVisible}
//         onCancel={() => setIsModalVisible(false)}
//         footer={null}
//       >
//         <div className="container-fluid">
//           <Form form={form} layout="vertical" onFinish={onSubmit}>
//             <Divider orientation="center">Thông tin cá nhân</Divider>

//             <div className="row">
//               <div className="col-12">
//                 <Form.Item
//                   name="Branch"
//                   label="Trung tâm"
//                   rules={[
//                     {
//                       required: true,
//                       message: "Vui lòng điền đủ thông tin!",
//                     },
//                   ]}
//                 >
//                   <Select
//                     mode="multiple"
//                     className="w-100 style-input"
//                     placeholder="Chọn trung tâm"
//                     showSearch
//                     allowClear
//                   >
//                     {branch?.map((item) => (
//                       <Option value={`${item.ID}`}>{item.BranchName}</Option>
//                     ))}
//                   </Select>
//                 </Form.Item>
//               </div>
//             </div>

//             <div className="row">
//               <div className="col-12">
//                 <Form.Item
//                   name="FullNameUnicode"
//                   label="Họ và tên"
//                   rules={[
//                     { required: true, message: "Vui lòng điền đủ thông tin!" },
//                   ]}
//                 >
//                   <Input
//                     placeholder="Họ và tên phụ huynh"
//                     className="style-input"
//                     onChange={(e) =>
//                       setValue("FullNameUnicode", e.target.value)
//                     }
//                   />
//                 </Form.Item>
//               </div>
//             </div>

//             <div className="row">
//               <div className="col-12 col-md-6">
//                 <Form.Item
//                   name="Email"
//                   label="Email"
//                   rules={[
//                     { required: true, message: "Vui lòng điền đủ thông tin!" },
//                   ]}
//                 >
//                   <Input
//                     allowClear
//                     placeholder="Email"
//                     className="style-input"
//                     onChange={(e) => setValue("Email", e.target.value)}
//                   />
//                 </Form.Item>
//               </div>

//               <div className="col-12 col-md-6">
//                 <Form.Item
//                   name="Mobile"
//                   label="Số điện thoại"
//                   rules={[
//                     { required: true, message: "Vui lòng điền đủ thông tin!" },
//                   ]}
//                 >
//                   <Input
//                     allowClear
//                     placeholder="SĐT"
//                     className="style-input"
//                     onChange={(e) => setValue("Mobile", e.target.value)}
//                   />
//                 </Form.Item>
//               </div>
//             </div>

//             <div className="row">
//               <div className="col-md-6 col-12">
//                 <Form.Item label="Giới tính" name="Gender">
//                   <Select
//                     className="style-input"
//                     placeholder="Giới tính"
//                     onChange={(value) => setValue("Gender", value)}
//                     allowClear={true}
//                   >
//                     {gender?.map((item, index) => (
//                       <Option key={index} value={item.id}>
//                         {item.type}
//                       </Option>
//                     ))}
//                   </Select>
//                 </Form.Item>
//               </div>
//               <div className="col-md-6 col-12">
//                 <Form.Item
//                   name="DOB"
//                   label="Ngày sinh"
//                   rules={[
//                     { required: true, message: "Vui lòng điền đủ thông tin!" },
//                   ]}
//                 >
//                   <DatePicker
//                     className="style-input"
//                     onChange={(e) => setValue("DayOfExam", e)}
//                   />
//                 </Form.Item>
//               </div>
//             </div>

//             <div className="row">
//               <div className="col-md-6 col-12">
//                 <Form.Item
//                   name="AreaID"
//                   label="Tỉnh/TP"
//                   rules={[
//                     { required: true, message: "Vui lòng điền đủ thông tin!" },
//                   ]}
//                 >
//                   <Select
//                     className="w-100 style-input"
//                     placeholder="Chọn tỉnh/thành phố"
//                     onChange={onChangeSelect("AreaID")}
//                   >
//                     {area?.map((item, index) => (
//                       <Option key={index} value={item.AreaID}>
//                         {item.AreaName}
//                       </Option>
//                     ))}
//                   </Select>
//                 </Form.Item>
//               </div>

//               <div className="col-md-6 col-12">
//                 <Form.Item
//                   name="DistrictID"
//                   label="Quận huyện"
//                   rules={[
//                     { required: true, message: "Vui lòng điền đủ thông tin!" },
//                   ]}
//                 >
//                   <Select
//                     allowClear
//                     className="w-100 style-input"
//                     placeholder="Chọn quận/huyện"
//                     onChange={onChangeSelect("DistrictID")}
//                   >
//                     {district?.map((item, index) => (
//                       <Option key={index} value={item.ID}>
//                         {item.DistrictName}
//                       </Option>
//                     ))}
//                   </Select>
//                 </Form.Item>
//               </div>
//             </div>

//             <div className="row">
//               <div className="col-12">
//                 <Form.Item
//                   name="HouseNumber"
//                   label="Số nhà - phường xã"
//                   rules={[
//                     { required: true, message: "Vui lòng điền đủ thông tin!" },
//                   ]}
//                 >
//                   <Input
//                     allowClear
//                     placeholder="Số nhà - phường xã"
//                     className="style-input"
//                     onChange={(e) => setValue("HouseNumber", e.target.value)}
//                   />
//                 </Form.Item>
//               </div>
//             </div>

//             <Divider orientation="center">Giấy tờ tùy thân</Divider>
//             <div className="row">
//               <div className="col-12">
//                 <Form.Item
//                   name="CMND"
//                   label="Số CMND"
//                   rules={[
//                     { required: true, message: "Vui lòng điền đủ thông tin!" },
//                   ]}
//                 >
//                   <Input
//                     allowClear
//                     className="style-input"
//                     onChange={(e) => setValue("CMND", e.target.value)}
//                   />
//                 </Form.Item>
//               </div>
//             </div>

//             <div className="row">
//               <div className="col-12">
//                 <Form.Item
//                   name="CMNDDate"
//                   label="Ngày làm CMND"
//                   rules={[
//                     { required: true, message: "Vui lòng điền đủ thông tin!" },
//                   ]}
//                 >
//                   <DatePicker
//                     allowClear
//                     className="style-input"
//                     onChange={(e) => setValue("CMNDDate", e)}
//                   />
//                 </Form.Item>
//               </div>
//             </div>

//             <div className="row">
//               <div className="col-12">
//                 <Form.Item
//                   name="CMNDRegister"
//                   label="Nơi làm CMND"
//                   rules={[
//                     { required: true, message: "Vui lòng điền đủ thông tin!" },
//                   ]}
//                 >
//                   <Input
//                     allowClear
//                     className="style-input"
//                     onChange={(e) => setValue("CMNDRegister", e.target.value)}
//                   />
//                 </Form.Item>
//               </div>
//             </div>

//             {parentsID ? (
//               <Fragment>
//                 <Divider orientation="center">Tài khoản</Divider>
//                 <div className="row">
//                   <div className="col-12">
//                     <Form.Item
//                       name="UserName"
//                       label="Tên tài khoản"
//                       rules={[
//                         {
//                           required: true,
//                           message: "Vui lòng điền đủ thông tin!",
//                         },
//                       ]}
//                     >
//                       <Input
//                         allowClear
//                         className="style-input"
//                         onChange={(e) =>
//                           setValue("HouseNumber", e.target.value)
//                         }
//                       />
//                     </Form.Item>
//                   </div>
//                 </div>

//                 <div className="row">
//                   <div className="col-12">
//                     <Form.Item name="Password" label="Mật khẩu">
//                       <Input
//                         allowClear
//                         type="password"
//                         className="style-input"
//                         onChange={(e) => setValue("Password", e.target.value)}
//                       />
//                     </Form.Item>
//                   </div>
//                 </div>
//               </Fragment>
//             ) : (
//               <Fragment></Fragment>
//             )}

//             <div className="row ">
//               <div className="col-12">
//                 <button type="submit" className="btn btn-primary w-100">
//                   Lưu
//                   {loading == true && <Spin className="loading-base" />}
//                 </button>
//               </div>
//             </div>
//           </Form>
//         </div>
//       </Modal>
//     </>
//   );
// });

// export default ParentsForm;

import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import { Form, Divider, Spin, Modal, Tooltip } from "antd";

import { useForm } from "react-hook-form";
import * as yup from "yup";
import InputTextField from "~/components/FormControl/InputTextField";
import DateField from "~/components/FormControl/DateField";
import SelectField from "~/components/FormControl/SelectField";
import TextAreaField from "~/components/FormControl/TextAreaField";
import { districtApi, wardApi, branchApi } from "~/apiBase";
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

import { RotateCcw } from "react-feather";
// import SalaryForm from "./SalaryForm";

type LayoutType = Parameters<typeof Form>[0]["layout"];

let returnSchema = {};
let schema = null;

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
    value: 2,
    title: "Khác",
  },
];

const ParentsForm = (props) => {
  const {
    rowData,
    listDataForm,
    onSubmit,
    isLoading,
    rowID,
    getIndex,
    index,
    onSubmitSalary,
  } = props;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { showNoti } = useWrap();
  const showModal = () => {
    setIsModalVisible(true);
    rowID && getIndex(index);
  };

  const [loadingSelect, setLoadingSelect] = useState({
    status: false,
    name: "",
  });
  const [listData, setListData] = useState<listData>(listDataForm);
  const [imageUrl, setImageUrl] = useState(null);
  // const [statusAdd, setStatusAdd] = useState("add-staff");
  const [disableCenter, setDisableCenter] = useState(false);
  const [statusAdd, setStatusAdd] = useState("add-staff");
  const [dataStaff, setDataStaff] = useState(null);
  const [submitSalary, setSubmitSalary] = useState(true);

  // console.log("Row Data: ", rowData);

  const makeNewData = (data, name) => {
    let newData = null;
    switch (name) {
      case "Area":
        newData = data.map((item) => ({
          title: item.AreaName,
          value: item.AreaID,
        }));
        break;
      case "DistrictID":
        newData = data.map((item) => ({
          title: item.DistrictName,
          value: item.ID,
        }));
        break;
      case "WardID":
        newData = data.map((item) => ({
          title: item.WardName,
          value: item.ID,
        }));
        break;
      case "Branch":
        newData = data.map((item) => ({
          title: item.BranchName,
          value: item.ID,
        }));
        break;
      case "Job":
        newData = data.map((item) => ({
          title: item.JobName,
          value: item.JobID,
        }));
        break;
      case "Purposes":
        newData = data.map((item) => ({
          title: item.PurposesName,
          value: item.PurposesID,
        }));
        break;
      case "Parent":
        newData = data.map((item) => ({
          title: item.FullNameUnicode,
          value: item.UserInformationID,
        }));
        break;
      case "SourceInformation":
        newData = data.map((item) => ({
          title: item.SourceInformationName,
          value: item.SourceInformationID,
        }));
        break;
      case "Counselors":
        newData = data.map((item) => ({
          title: item.FullNameUnicode,
          value: item.UserInformationID,
        }));
        break;
      default:
        break;
    }

    return newData;
  };

  const getDataTolist = (data: any, name: any) => {
    let newData = makeNewData(data, name);

    Object.keys(listData).forEach(function (key) {
      if (key == name) {
        listData[key] = newData;
      }
    });
    setListData({ ...listData });
  };

  const getDataWithID = async (ID, name) => {
    console.log("NAME is: ", name);

    let res = null;
    setLoadingSelect({
      status: true,
      name: name,
    });
    try {
      switch (name) {
        case "DistrictID":
          res = await districtApi.getAll({
            AreaID: ID,
            pageIndex: 1,
            pageSize: 9999,
          });
          break;
        case "WardID":
          res = await wardApi.getAll({
            DistrictID: ID,
            pageIndex: 1,
            pageSize: 9999,
          });
          break;
        // case "Branch":
        //   res = await branchApi.getAll({
        //     DistrictID: form.getValues("DistrictID"),
        //     AreaID: form.getValues("AreaID"),
        //   });
        //   break;
        default:
          break;
      }

      res.status == 200 && getDataTolist(res.data.data, name);
      res.status == 204 && showNoti("danger", name + " không có dữ liệu");
    } catch (error) {
      showNoti("danger", error.message);
    } finally {
      setLoadingSelect({
        status: false,
        name: name,
      });
    }
  };

  // ----- HANDLE CHANGE - AREA ----------
  const handleChange_select = (value, name) => {
    console.log("Value is: ", value);

    if (name == "DistrictID") {
      form.setValue("WardID", null);

      listData.DistrictID = [];
      listData.WardID = [];
      setListData({ ...listData });
    }
    form.setValue(name, null);
    getDataWithID(value, name);
  };

  // HANDLE CHANGE ROLE
  // const handleChange_Role = (value) => {
  //   if (value == 1) {
  //     setDisableCenter(true);
  //   } else {
  //     setDisableCenter(false);
  //   }
  //   form.setValue("RoleID", value);
  // };

  // -----  HANDLE ALL IN FORM -------------
  const defaultValuesInit = {
    FullNameUnicode: null,
    Email: "",
    Mobile: null,
    AreaID: null, //int id Tỉnh/TP
    DistrictID: null, //int id Quận/Huyện
    WardID: null, //int id Phường/Xã
    HouseNumber: null, //Nhập số nhà tên đường
    Address: null, //bỏ trống - chỉ nhập khi khách hàng có địa chỉ không cụ thể
    Avatar: null, //Lưu link file hình
    DOB: null, //ngày sinh
    // Jobdate: null,
    Gender: null, //int 0-Nữ 1-Nam 2-Khác
    CMND: null, //int số CMND
    CMNDDate: null, //Ngày làm
    CMNDRegister: null, //Nơi làm CMND
    Extension: null, //giới thiệu thêm
    Branch: undefined, //string : id của trung tâm - LƯU Ý NẾU TỪ 2 TRUNG TÂM TRỞ LÊN THÌ NHẬP(ID,ID,ID)
    // RoleID: null, //int mã công việc
    StatusID: null,
    Password: null,
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
        // case "Mobile":
        //   returnSchema[key] = yup
        //     .number()
        //     .typeError("SDT phải là số")
        //     .required("Bạn không được để trống");
        //   break;
        // case "CMND":
        //   returnSchema[key] = yup
        //     .number()
        //     .typeError("CMND phải là số")
        //     .required("Bạn không được để trống");
        //   break;
        case "CounselorsID":
          returnSchema[key] = yup.mixed().required("Bạn không được để trống");
          break;
        case "Branch":
          if (!disableCenter) {
            returnSchema[key] = yup.array().required("Bạn không được để trống");
          }

          break;
        default:
          // returnSchema[key] = yup.mixed().required("Bạn không được để trống");
          break;
      }
    });

    schema = yup.object().shape(returnSchema);
  })();

  const form = useForm({
    defaultValues: defaultValuesInit,
    resolver: yupResolver(schema),
  });

  // ----------- SUBMI FORM ------------
  const onSubmitForm = (data: any) => {
    console.log("DATA staff: ", data);

    let res = onSubmit(data);
    res.then(function (rs: any) {
      if (rs) {
        if (rs.status == 200) {
          if (!rowData) {
            form.reset(defaultValuesInit);
            setImageUrl("");
          }
          setIsModalVisible(false);
        }
      }
    });
  };

  const changeVisible = () => {
    if (isModalVisible) {
      setIsModalVisible(false);
      setStatusAdd("add-staff");
    }
  };

  useEffect(() => {
    if (isModalVisible) {
      if (rowData) {
        let arrBranch = [];
        let cloneRowData = { ...rowData };
        cloneRowData.Branch.forEach((item, index) => {
          arrBranch.push(item.ID);
        });
        cloneRowData.Branch = arrBranch;
        cloneRowData.Password = "";

        form.reset(cloneRowData);
        cloneRowData.AreaID && getDataWithID(cloneRowData.AreaID, "DistrictID");
        cloneRowData.DistrictID &&
          getDataWithID(cloneRowData.DistrictID, "WardID");
        setImageUrl(cloneRowData.Avatar);
        // for form salary
        // formSalary.reset({
        //   UserInformationID: rowData.UserInformationID,
        //   FullNameUnicode: rowData.FullNameUnicode,
        // });
      } else {
        form.setValue("StatusID", 0);
      }
    }
  }, [isModalVisible]);

  return (
    <>
      {rowID ? (
        <button className="btn btn-icon edit" onClick={showModal}>
          <Tooltip title="Cập nhật">
            <RotateCcw />
          </Tooltip>
        </button>
      ) : (
        <button className="btn btn-warning add-new" onClick={showModal}>
          Thêm mới
        </button>
      )}

      <Modal
        style={{ top: 20 }}
        title={
          statusAdd == "add-staff"
            ? rowID
              ? "Cập nhật phụ huynh"
              : "Tạo mới phụ huynh"
            : "Thêm lương cho phụ huynh"
        }
        visible={isModalVisible}
        footer={
          statusAdd == "add-staff" ? (
            <div className="row">
              <div className="col-12 d-flex justify-content-center">
                <div style={{ paddingRight: 5 }}>
                  <button
                    type="button"
                    className="btn btn-primary w-100"
                    onClick={form.handleSubmit(onSubmitForm)}
                  >
                    Lưu phụ huynh
                    {isLoading.type == "ADD_DATA" && isLoading.status && (
                      <Spin className="loading-base" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ) : null
        }
        onCancel={() => setIsModalVisible(false)}
        className={`${statusAdd == "add-staff" ? "modal-50 modal-scroll" : ""}`}
      >
        <div className="box-form form-staff">
          <Form layout="vertical" onFinish={form.handleSubmit(onSubmitForm)}>
            {/*  */}

            {/** ==== Thông tin cơ bản  ====*/}
            <div className="row">
              <div className="col-md-2 col-12">
                <AvatarBase
                  imageUrl={imageUrl}
                  getValue={(value) => form.setValue("Avatar", value)}
                />
              </div>
              <div className="col-md-10 col-12">
                {rowData && (
                  <div className="box-info-modal">
                    <p className="name">{rowData?.FullNameUnicode}</p>

                    <p className="detail">
                      <span className="icon mobile">
                        <WhatsAppOutlined />
                      </span>
                      <span className="text">{rowData?.Mobile}</span>
                    </p>
                    <p className="detail">
                      <span className="icon email">
                        <MailOutlined />
                      </span>
                      <span className="text">{rowData?.Email}</span>
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <Divider orientation="center">Thông tin cơ bản</Divider>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 col-12">
                <InputTextField form={form} name="Email" label="Email" />
              </div>

              <div className="col-md-6 col-12">
                <InputTextField
                  form={form}
                  name="FullNameUnicode"
                  label="Họ và tên"
                />
              </div>
            </div>
            {/*  */}
            {/*  */}
            <div className="row">
              <div className="col-md-6 col-12">
                <InputTextField
                  form={form}
                  name="Mobile"
                  label="Số điện thoại"
                />
              </div>

              <div className="col-md-6 col-12">
                <DateField form={form} name="DOB" label="Ngày sinh" />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 col-12">
                <InputTextField form={form} name="CMND" label="Số CMND" />
              </div>
              <div className="col-md-6 col-12">
                <InputTextField
                  form={form}
                  name="CMNDRegister"
                  label="Nơi cấp CMND"
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 col-12">
                <DateField form={form} name="CMNDDate" label="Ngày cấp CMND" />
              </div>
              <div className="col-md-6 col-12">
                <SelectField
                  form={form}
                  name="Gender"
                  label="Giới tính"
                  optionList={optionGender}
                />
              </div>
              {/* <div className="col-md-6 col-12">
                <SelectField
                  form={form}
                  name="RoleID"
                  label="Vị trí"
                  optionList={listData.Role}
                  onChangeSelect={
                    (value) => handleChange_Role(value) // Select Area to load District
                  }
                />
              </div> */}
              <div className="col-md-6 col-12">
                <SelectField
                  disabled={!rowID && true}
                  form={form}
                  name="StatusID"
                  label="Trạng thái hoạt động"
                  optionList={[
                    {
                      value: 0,
                      title: "Hoạt động",
                    },
                    {
                      value: 1,
                      title: "Khóa",
                    },
                  ]}
                />
              </div>
              {rowID && (
                <div className="col-md-6 col-12">
                  <InputTextField
                    form={form}
                    name="Password"
                    label="Mật khẩu"
                  />
                </div>
              )}
            </div>
            {/*  */}
            {/*  */}
            {/** ==== Địa chỉ  ====*/}
            <div className="row">
              <div className="col-12">
                <Divider orientation="center">Địa chỉ</Divider>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 col-12">
                <SelectField
                  form={form}
                  name="AreaID"
                  label="Tỉnh/TP"
                  optionList={listData.Area}
                  onChangeSelect={
                    (value) => handleChange_select(value, "DistrictID") // Select Area to load District
                  }
                />
              </div>
              <div className="col-md-6 col-12">
                <SelectField
                  isLoading={
                    loadingSelect.name == "DistrictID" && loadingSelect.status
                  }
                  form={form}
                  name="DistrictID"
                  label="Quận/Huyện"
                  optionList={listData.DistrictID}
                  onChangeSelect={
                    (value) => handleChange_select(value, "WardID") // Select District to load Ward
                  }
                />
              </div>
            </div>
            {/*  */}
            {/*  */}
            {/*  */}

            <div className="row">
              <div className="col-md-6 col-12">
                <SelectField
                  isLoading={
                    loadingSelect.name == "WardID" && loadingSelect.status
                  }
                  form={form}
                  name="WardID"
                  label="Phường/Xã"
                  optionList={listData.WardID}
                />
              </div>
              <div className="col-md-6 col-12">
                <InputTextField form={form} name="Address" label="Mô tả thêm" />
              </div>
            </div>
            <div className="row">
              <div className="col-md-12 col-12">
                <InputTextField
                  form={form}
                  name="HouseNumber"
                  label="Số nhà/tên đường"
                />
              </div>
            </div>

            {/*  */}
            {/** ==== Khác  ====*/}
            <div className="row">
              <div className="col-12">
                <Divider orientation="center">Khác</Divider>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 col-12">
                <SelectField
                  isLoading={
                    loadingSelect.name == "Branch" && loadingSelect.status
                  }
                  mode="multiple"
                  form={form}
                  name="Branch"
                  label="Tên trung tâm"
                  optionList={listData.Branch}
                  disabled={disableCenter}
                />
              </div>
              <div className="col-md-6 col-12">
                <TextAreaField
                  name="Extension"
                  label="Giới thiệu thêm"
                  form={form}
                  rows={4}
                />
              </div>
              {/* <div className="col-md-6 col-12">
                <DateField form={form} name="Jobdate" label="Ngày vào làm" />
              </div> */}
            </div>

            {/* <div className="row">
             
            </div> */}

            <div className="row d-none">
              <div className="col-12 d-flex justify-content-center">
                <div style={{ paddingRight: 5 }}>
                  <button type="submit" className="btn btn-primary w-100">
                    Lưu
                    {isLoading.type == "ADD_DATA" && isLoading.status && (
                      <Spin className="loading-base" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default ParentsForm;
