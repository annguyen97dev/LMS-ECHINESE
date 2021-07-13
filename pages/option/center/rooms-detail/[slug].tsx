import React, { useEffect, useState } from "react";
import PowerTable from "~/components/PowerTable";
import { data } from "../../../../lib/option/dataOption";
import LayoutBase from "~/components/LayoutBase";
import { Tooltip } from "antd";
import RoomForm from "~/components/Global/Option/RoomForm";
import { RotateCcw } from "react-feather";
import SortBox from "~/components/Elements/SortBox";
import FilterTable from "~/components/Global/CourseList/FitlerTable";
import FilterColumn from "~/components/Tables/FilterColumn";
import FilterDateColumn from "~/components/Tables/FilterDateColumn";
import router from "next/router";
import { roomApi } from "~/apiBase";
import { useWrap } from "~/context/wrap";

let pageIndex = 1;

const listField = {
  pageSize: 10,
  pageIndex: pageIndex,
  sort: null,
  sortType: null,
  roomCode: null,
  roomName: null,
  BranchID: null,
};

const Center = () => {
  const columns = [
    {
      title: "Mã phòng",
      dataIndex: "RoomCode",
      // ...FilterColumn("RoomCode")
    },
    {
      title: "Tên phòng",
      dataIndex: "RoomName",
      //  ...FilterColumn("RoomName")
    },
    {
      title: "Người cập nhật",
      dataIndex: "ModifiedBy",
      // ...FilterColumn("ModifiedBy"),
    },
    {
      title: "Ngày cập nhật",
      dataIndex: "ModifiedOn",
      // ...FilterDateColumn("ModifiedOn"),
    },
    {
      render: () => (
        <>
          {/* <Tooltip title="Cập nhật phòng">
            <RoomForm
              showIcon={true}
              // branchId={data.ID}
              // getBranchDetail={(branchId: number) => getBranchDetail(branchId)}
              // rowData={rowData}
              isLoading={isLoading}
              _onSubmit={(data: any) => _onSubmit(data)}
            />
          </Tooltip> */}
        </>
      ),
    },
  ];
  const [todoApi, setToDoApi] = useState(listField);
  const [roomForm, setRoomForm] = useState(false);
  const [roomData, setRoomData] = useState<IRoom[]>([]);
  const [isLoading, setIsLoading] = useState({
    type: "",
    status: false,
  });
  const { showNoti } = useWrap();
  const [rowData, setRowData] = useState<IRoom[]>();

  console.log("Room data: ", roomData);

  // const _onSubmit = async (data: any) => {
  //   setIsLoading({
  //     type: "ADD_DATA",
  //     status: true,
  //   });

  //   try {
  //     const res = await roomApi.post({
  //       ...data,
  //       BranchID: parseInt(router.query.slug as string),
  //     });
  //     res?.status == 200 && afterPost();
  //   } catch (error) {
  //     showNoti("danger", error.message);
  //   } finally {
  //     setIsLoading({
  //       type: "ADD_DATA",
  //       status: false,
  //     });
  //   }
  // };

  const afterPost = () => {
    showNoti("success", "Thêm thành công");
    getDataRoom();
  };

  const getDataRoom = () => {
    setIsLoading({
      type: "GET_ALL",
      status: true,
    });
    (async () => {
      let todoApi = {
        action: "getAll",
        pageIndex: pageIndex,
      };

      try {
        let res = await roomApi.getById(router.query.slug);
        // @ts-ignore
        res.status == 200 && setRoomData(res.data.data);
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

  useEffect(() => {
    getDataRoom();
  }, []);

  return (
    <>
      <PowerTable
        loading={isLoading}
        addClass="basic-header"
        TitlePage="Danh sách phòng"
        TitleCard={
          <RoomForm
            showAdd={true}
            addDataSuccess={() => getDataRoom()}
            isLoading={isLoading}
            // _onSubmit={(data: any) => _onSubmit(data)}
          />
        }
        dataSource={roomData}
        columns={columns}
        Extra={
          <div className="extra-table">
            <SortBox />
          </div>
        }
      />
    </>
  );
};
Center.layout = LayoutBase;

export default Center;
