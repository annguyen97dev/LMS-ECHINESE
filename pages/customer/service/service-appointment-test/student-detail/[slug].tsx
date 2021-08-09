import React, { useEffect, useState } from "react";
import ProfileCustomer from "~/components/Profile/ProfileCustomer/ProfileCustomer";
import LayoutBase from "~/components/LayoutBase";
import StudentForm from "~/components/Global/Customer/Student/StudentForm";
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
  staffApi,
} from "~/apiBase";
import { useWrap } from "~/context/wrap";
import { useRouter } from "next/router";
import { Spin } from "antd";

// -- FOR DIFFERENT VIEW --
interface optionObj {
  title: string;
  value: number;
}

interface listDataForm {
  Area: Array<optionObj>;
  DistrictID: Array<optionObj>;
  WardID: Array<optionObj>;
  Job: Array<optionObj>;
  Branch: Array<optionObj>;
  Purposes: Array<optionObj>;
  SourceInformation: Array<optionObj>;
  Parent: Array<optionObj>;
  Counselors: Array<optionObj>;
}

const listApi = [
  {
    api: areaApi,
    text: "Tỉnh/Tp",
    name: "Area",
  },

  {
    api: jobApi,
    text: "Công việc",
    name: "Job",
  },
  {
    api: puroseApi,
    text: "Mục đích học",
    name: "Purposes",
  },
  {
    api: branchApi,
    text: "Trung tâm",
    name: "Branch",
  },
  {
    api: parentsApi,
    text: "Phụ huynh",
    name: "Parent",
  },
  {
    api: sourceInfomationApi,
    text: "Nguồn khách hàng",
    name: "SourceInformation",
  },
  {
    api: staffApi,
    text: "Tư vấn viên",
    name: "Counselors",
  },
];

const CustomerDetail = () => {
  const router = useRouter();
  const studentID = parseInt(router.query.slug as string);

  const [dataRow, setDataRow] = useState<IStudent>(null);
  const { showNoti } = useWrap();
  const [isLoading, setIsLoading] = useState(true);
  const [listDataForm, setListDataForm] = useState<listDataForm>({
    Area: [],
    DistrictID: [],
    WardID: [],
    Job: [],
    Branch: [],
    Purposes: [],
    SourceInformation: [],
    Parent: [],
    Counselors: [],
  });

  // FOR STUDENT FORM
  // ------------- ADD data to list --------------

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

    Object.keys(listDataForm).forEach(function (key) {
      if (key == name) {
        listDataForm[key] = newData;
      }
    });
    setListDataForm({ ...listDataForm });
  };

  // ----------- GET DATA SOURCE ---------------
  const getDataStudentForm = (arrApi) => {
    arrApi.forEach((item, index) => {
      (async () => {
        let res = null;
        try {
          if (item.name == "Counselors") {
            res = await item.api.getAll({
              pageIndex: 1,
              pageSize: 99999,
              RoleID: 6,
            });
          } else {
            res = await item.api.getAll({ pageIndex: 1, pageSize: 99999 });
          }

          res.status == 200 && getDataTolist(res.data.data, item.name);

          res.status == 204 &&
            showNoti("danger", item.text + " Không có dữ liệu");
        } catch (error) {
          showNoti("danger", error.message);
        } finally {
        }
      })();
    });
  };

  // GET DATA STUDENT WITH ID
  const getDataStudent = async () => {
    try {
      let res = await studentApi.getWithID(studentID);
      res.status == 200 &&
        (showNoti("success", "Tải dữ liệu thành công"),
        setDataRow(res.data.data));
      res.status == 204 && showNoti("danger", "Không có dữ liệu");
    } catch (error) {
      showNoti("danger", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getDataStudentForm(listApi);
    getDataStudent();
  }, []);

  return isLoading ? (
    <div className="w-100 d-flex justify-content-center p-5">
      <Spin />
    </div>
  ) : (
    dataRow && <StudentForm listDataForm={listDataForm} dataRow={dataRow} />
  );
};
CustomerDetail.layout = LayoutBase;

export default CustomerDetail;
