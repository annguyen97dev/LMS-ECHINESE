import React, { Fragment, useEffect, useRef, useState } from "react";
import PowerTable from "~/components/PowerTable";
import randomColor from "randomcolor";
import { Tag, Tooltip } from "antd";
import { Info, RotateCcw } from "react-feather";
import SortBox from "~/components/Elements/SortBox";
import FilterColumn from "~/components/Tables/FilterColumn";
import FilterTable from "~/components/Global/CourseList/FitlerTable";
import Link from "next/link";
import LayoutBase from "~/components/LayoutBase";
import { branchApi } from "~/apiBase";
import CenterForm from "~/components/Global/Option/CenterForm";
import { useWrap } from "~/context/wrap";

let indexPage = 1;

const Center = () => {
  const columns = [
    {
      title: "Mã trung tâm",
      dataIndex: "BranchCode",
      ...FilterColumn("address"),
    },

    {
      title: "Tên trung tâm",
      dataIndex: "BranchName",
      ...FilterColumn("center"),
    },
    { title: "Địa chỉ", dataIndex: "Address", ...FilterColumn("address") },
    {
      title: "Số điện thoại",
      dataIndex: "Phone",
      ...FilterColumn("district"),
    },
    {
      render: (data) => (
        <>
          <Link
            href={{
              pathname: "/option/center/rooms-detail/[slug]",
              query: { slug: `${data.ID}` },
            }}
          >
            <Tooltip title="Xem phòng">
              <button className="btn btn-icon">
                <Info />
              </button>
            </Tooltip>
          </Link>

          <Tooltip title="Cập nhật trung tâm">
            <CenterForm
              showIcon={true}
              branchId={data.ID}
              getBranchDetail={(branchId: number) => getBranchDetail(branchId)}
              rowData={rowData}
              isLoading={isLoading}
              _onSubmit={(data: any) => _onSubmit(data)}
            />
          </Tooltip>
        </>
      ),
    },
  ];

  const [center, setCenter] = useState<IBranch[]>([]);
  const [isLoading, setIsLoading] = useState({
    type: "",
    status: false,
  });

  const { showNoti } = useWrap();
  const [rowData, setRowData] = useState<IBranch>();

  const getDataCenter = (pageNumber) => {
    setIsLoading({
      type: "GET_ALL",
      status: true,
    });
    (async () => {
      try {
        let res = await branchApi.getPagination(pageNumber);
        res.status == 200 && setCenter(res.data.data);
      } catch (error) {
        showNoti("danger", error.message);
      } finally {
        setIsLoading({
          type: "GET_ALL",
          status: false,
        });
      }
    })();
  };
  let indexPage = 2;

  useEffect(() => {
    getDataCenter(indexPage);
  }, []);

  const getBranchDetail = (branchId: number) => {
    setIsLoading({
      type: "GET_WITH_ID",
      status: true,
    });
    (async () => {
      try {
        let res = await branchApi.getDetail(branchId);
        res.status == 200 && setRowData(res.data.createAcc);
      } catch (error) {
        showNoti("danger", error.message);
      } finally {
        setIsLoading({
          type: "GET_WITH_ID",
          status: false,
        });
      }
    })();
  };

  // const editRowData = (dataEdit: any, mes: string) => {
  //   let space = indexPage * 10;
  //   let limit = space < center.length ? space : center.length;
  //   let dataClone = [...center];

  //   for (let i = space - 10; i <= limit; i++) {
  //     if (dataClone[i].BranchCode == dataEdit.BranchCode) {
  //       dataClone[i].BranchName = dataEdit.BranchName;
  //       dataClone[i].Phone = dataEdit.Phone;
  //       dataClone[i].AreaID = dataEdit.AreaID;
  //       dataClone[i].Address = dataEdit.Address;
  //       dataClone[i].DistrictID = dataEdit.DistrictID;
  //       break;
  //     }
  //   }
  //   setCenter(dataClone);
  //   showNoti("success", mes);
  // };
  const afterPost = (mes) => {
    showNoti("success", mes);
    getDataCenter(indexPage);
  };

  const _onSubmit = async (data: any) => {
    setIsLoading({
      type: "ADD_DATA",
      status: true,
    });

    let res = null;

    if (data.ID) {
      try {
        res = await branchApi.put(data);
        res?.status == 200 && afterPost(res.data.message);
      } catch (error) {
        console.log("error: ", error);
        showNoti("danger", error.message);
      } finally {
        setIsLoading({
          type: "ADD_DATA",
          status: false,
        });
      }
    } else {
      try {
        res = await branchApi.post(data);
        res?.status == 200 && afterPost(res.data.message);
      } catch (error) {
        showNoti("danger", error.message);
      } finally {
        setIsLoading({
          type: "ADD_DATA",
          status: false,
        });
      }
    }

    return res;
  };

  // GET PAGE_NUMBER
  const getPagination = (pageNumber: number) => {
    indexPage = pageNumber;
    getDataCenter(pageNumber);
  };

  return (
    <Fragment>
      <PowerTable
        getPagination={(pageNumber: number) => getPagination(pageNumber)}
        loading={isLoading}
        addClass="basic-header"
        TitlePage="Danh sách trung tâm"
        TitleCard={
          <CenterForm
            showAdd={true}
            addDataSuccess={(pageNumber: number) => getDataCenter(pageNumber)}
            isLoading={isLoading}
            _onSubmit={(data: any) => _onSubmit(data)}
          />
        }
        dataSource={center}
        columns={columns}
        Extra={
          <div className="extra-table">
            <SortBox />
          </div>
        }
      />
    </Fragment>
  );
};
Center.layout = LayoutBase;
export default Center;
