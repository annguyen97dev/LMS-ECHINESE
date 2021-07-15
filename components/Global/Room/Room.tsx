import React, { useEffect, useState } from "react";
import PowerTable from "~/components/PowerTable";

import LayoutBase from "~/components/LayoutBase";
import { Tooltip } from "antd";
import RoomForm from "~/components/Global/Option/RoomForm";
import { RotateCcw } from "react-feather";
import SortBox from "~/components/Elements/SortBox";
import FilterColumn from "~/components/Tables/FilterColumn";
import router from "next/router";
import { roomApi } from "~/apiBase";
import { useWrap } from "~/context/wrap";
import DeleteItem from "~/components/Tables/DeleteItem";
import moment from "moment";

let pageIndex = 1;

let listFieldSearch = {
  roomCode: "",
  roomName: "",
  pageIndex: 1,
};

const dataOption = [
  {
    dataSort: {
      sort: 1,
      sortType: false,
    },
    text: "Mã giảm dần",
  },
  {
    dataSort: {
      sort: 1,
      sortType: true,
    },
    text: "Mã tăng dần",
  },
  {
    dataSort: {
      sort: 2,
      sortType: false,
    },
    text: "Tên giảm dần",
  },
  {
    dataSort: {
      sort: 2,
      sortType: true,
    },
    text: "Tên tăng dần ",
  },
];

const Room = () => {
  const listTodoApi = {
    pageSize: 10,
    pageIndex: pageIndex,
    sort: null,
    sortType: null,
    roomCode: null,
    roomName: null,
    BranchID: parseInt(router.query.slug as string),
  };

  const [todoApi, setTodoApi] = useState(listTodoApi);
  const [roomData, setRoomData] = useState<IRoom[]>([]);
  const [isLoading, setIsLoading] = useState({
    type: "",
    status: false,
  });
  const { showNoti } = useWrap();
  const [totalPage, setTotalPage] = useState(null);

  const _onSubmit = async (dataSubmit: any) => {
    setIsLoading({
      type: "ADD_DATA",
      status: true,
    });

    const compareKey = () => {
      let newListTodoApi = listTodoApi;
      Object.keys(newListTodoApi).forEach(function (keyTodoApi) {
        Object.keys(dataSubmit).forEach(function (keyDataSubmit) {
          if (keyTodoApi.toUpperCase() == keyDataSubmit.toUpperCase()) {
            newListTodoApi[keyTodoApi] = dataSubmit[keyDataSubmit];
          }
        });
      });
      return newListTodoApi;
    };

    let res = null;

    if (dataSubmit.RoomID) {
      try {
        res = await roomApi.update(dataSubmit);
        res?.status == 200 && showNoti("success", res.data.message),
          setTodoApi(compareKey);
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
        res = await roomApi.add(dataSubmit);
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

  // -------------- CHECK FIELD ---------------------
  const checkField = (valueSearch, dataIndex) => {
    let newList = null;
    Object.keys(listFieldSearch).forEach(function (key) {
      console.log("key: ", key);
      if (key != dataIndex) {
        listFieldSearch[key] = "";
      } else {
        listFieldSearch[key] = valueSearch;
      }
    });
    newList = listFieldSearch;
    return newList;
  };

  // ------------ ON SEARCH -----------------------
  const onSearch = (valueSearch, dataIndex) => {
    let clearKey = checkField(valueSearch, dataIndex);

    setTodoApi({
      ...todoApi,
      ...clearKey,
    });
  };

  // --------------- HANDLE SORT ----------------------
  const handleSort = async (option) => {
    let newTodoApi = {
      ...listTodoApi,
      sort: option.title.sort,
      sortType: option.title.sortType,
    };

    setTodoApi(newTodoApi);
  };

  // HANDLE RESET
  const handleReset = () => {
    setTodoApi(listTodoApi);
  };

  // Fetch Data
  useEffect(() => {
    getDataRoom();
  }, [todoApi]);

  const columns = [
    {
      title: "Mã phòng",
      dataIndex: "RoomCode",
      ...FilterColumn("roomCode", onSearch, handleReset, "text"),
    },
    {
      title: "Tên phòng",
      dataIndex: "RoomName",
      ...FilterColumn("roomName", onSearch, handleReset, "text"),
    },
    {
      title: "Người cập nhật",
      dataIndex: "ModifiedBy",
      render: (date) => moment(date).format("DD/MM/YYYY"),
    },
    {
      title: "Ngày cập nhật",
      dataIndex: "ModifiedOn",
      render: (date) => moment(date).format("DD/MM/YYYY"),
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

  return (
    <>
      <PowerTable
        totalPage={totalPage && totalPage}
        getPagination={(pageNumber: number) => getPagination(pageNumber)}
        loading={isLoading}
        addClass="basic-header table-medium"
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
          <SortBox
            handleSort={(value) => handleSort(value)}
            dataOption={dataOption}
          />
        }
      />
    </>
  );
};
Room.layout = LayoutBase;

export default Room;
