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
import DeleteItem from "~/components/Tables/DeleteItem";

let pageIndex = 1;

let listFieldSearch = {
  roomCode: "",
  roomName: "",
  pageIndex: 1,
};

const Center = () => {
  const listTodoApi = {
    pageSize: 10,
    pageIndex: pageIndex,
    sort: null,
    sortType: null,
    roomCode: null,
    roomName: null,
    BranchID: parseInt(router.query.slug as string),
  };
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
      render: (data) => (
        <>
          <RoomForm
            roomID={data.RoomID}
            rowData={data}
            isLoading={isLoading}
            _onSubmit={(data: any) => _onSubmit(data)}
          />
          <DeleteItem onDelete={() => onDelete(data.RoomID)} />
        </>
      ),
    },
  ];
  const [todoApi, setTodoApi] = useState(listTodoApi);
  const [roomData, setRoomData] = useState<IRoom[]>([]);
  const [isLoading, setIsLoading] = useState({
    type: "",
    status: false,
  });
  const { showNoti } = useWrap();
  const [totalPage, setTotalPage] = useState(null);

  const _onSubmit = async (data: any) => {
    setIsLoading({
      type: "ADD_DATA",
      status: true,
    });

    console.log("DATA SUBMIT: ", data);

    let res = null;

    if (data.RoomID) {
      try {
        res = await roomApi.update(data);
        res?.status == 200 && showNoti("success", res.data.message),
          setTodoApi({ ...todoApi });
      } catch (error) {
        showNoti("danger", error.message);
      } finally {
        setIsLoading({
          type: "ADD_DATA",
          status: false,
        });
      }
    } else {
      try {
        res = await roomApi.add(data);
        res?.status == 200 && showNoti("success", res.data.message),
          setTodoApi({ ...listTodoApi });
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

  // AFTER SUBMIT
  const afterPost = (mes) => {
    showNoti("success", mes);
    setTodoApi(listTodoApi);
  };

  // DELETE ITEM
  const onDelete = async (id: number) => {
    setIsLoading({
      type: "GET_ALL",
      status: true,
    });

    try {
      let res = await roomApi.update({ RoomID: id, Enable: false });
      res?.status == 200 && showNoti("success", res.data.message),
        setTodoApi({ ...listTodoApi });
    } catch (error) {
      showNoti("danger", error.message);
    } finally {
      setIsLoading({
        type: "GET_ALL",
        status: false,
      });
    }
  };

  // GET DATA ROOM
  const getDataRoom = async () => {
    setIsLoading({
      type: "GET_ALL",
      status: true,
    });

    try {
      let res = await roomApi.getAll(todoApi);
      // @ts-ignore
      res.status == 200 &&
        (setRoomData(res.data.data), setTotalPage(res.data.totalRow));

      res.data.data.length < 1 && showNoti("danger", "Không có dữ liệu");
    } catch (error) {
      showNoti("danger", error.message);
    } finally {
      setIsLoading({
        type: "GET_ALL",
        status: false,
      });
    }
  };

  // -------------- GET PAGE_NUMBER -----------------
  const getPagination = (pageNumber: number) => {
    pageIndex = pageNumber;

    setTodoApi({
      ...todoApi,
      pageIndex: pageIndex,
    });
  };

  // Fetch Data
  useEffect(() => {
    getDataRoom();
  }, [todoApi]);

  return (
    <>
      <PowerTable
        totalPage={totalPage && totalPage}
        getPagination={(pageNumber: number) => getPagination(pageNumber)}
        loading={isLoading}
        addClass="basic-heade table-medium"
        TitlePage="Danh sách phòng"
        TitleCard={
          <RoomForm
            showAdd={true}
            addDataSuccess={() => getDataRoom()}
            isLoading={isLoading}
            _onSubmit={(data: any) => _onSubmit(data)}
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
