import React, { useEffect, useState } from "react";
import PowerTable from "~/components/PowerTable";

import LayoutBase from "~/components/LayoutBase";
import { Tooltip } from "antd";
import RoomForm from "~/components/Global/Option/RoomForm";
import { RotateCcw } from "react-feather";
import SortBox from "~/components/Elements/SortBox";
import FilterColumn from "~/components/Tables/FilterColumn";
import router from "next/router";
import { roomApi, branchApi } from "~/apiBase";
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
  const [dataCenter, setDataCenter] = useState<IBranch[]>();
  const [todoApi, setTodoApi] = useState(listTodoApi);
  const [roomData, setRoomData] = useState<IRoom[]>([]);
  const [isLoading, setIsLoading] = useState({
    type: "",
    status: false,
  });
  const { showNoti } = useWrap();
  const [totalPage, setTotalPage] = useState(null);
  const [indexRow, setIndexRow] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const _onSubmit = async (dataSubmit: any) => {
    setIsLoading({
      type: "ADD_DATA",
      status: true,
    });

    let res = null;

    if (dataSubmit.RoomID) {
      try {
        res = await roomApi.update(dataSubmit);

        if (res.status == 200) {
          let newDataSource = [...roomData];
          newDataSource.splice(indexRow, 1, dataSubmit);
          setRoomData(newDataSource);
          // showNoti("success", res.data.message);
        }
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

  // AFTER SUBMIT
  const afterPost = (mes) => {
    showNoti("success", mes);
    setTodoApi({
      ...listTodoApi,
      pageIndex: 1,
    });
    setCurrentPage(1);
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
        setTodoApi({ ...todoApi });
    } catch (error) {
      showNoti("danger", error.message);
    } finally {
      setIsLoading({
        type: "GET_ALL",
        status: false,
      });
    }
  };

  // GET DATA CENTER
  const getDataCenter = async () => {
    // setLoadingSelect(true);

    try {
      let res = await branchApi.getAll({
        pageIndex: 1,
        pageSize: 9999,
      });
      res.status == 200 && setDataCenter(res.data.data);
    } catch (error) {
      showNoti("danger", error.message);
    } finally {
      // setLoadingSelect(false);
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
      res.status == 200 &&
        (setRoomData(res.data.data),
        setTotalPage(res.data.totalRow),
        showNoti("success", "Thành công"));
      res.status == 204 && showNoti("danger", "Không có dữ liệu");
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
    setCurrentPage(pageNumber);
    setTodoApi({
      ...todoApi,
      // ...listFieldSearch,
      pageIndex: pageIndex,
    });
  };

  // -------------- CHECK FIELD ---------------------
  const checkField = (valueSearch, dataIndex) => {
    let newList = { ...listFieldSearch };
    Object.keys(newList).forEach(function (key) {
      console.log("key: ", key);
      if (key != dataIndex) {
        if (key != "pageIndex") {
          newList[key] = null;
        }
      } else {
        newList[key] = valueSearch;
      }
    });

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
      pageIndex: 1,
      sort: option.title.sort,
      sortType: option.title.sortType,
    };
    setCurrentPage(1), setTodoApi(newTodoApi);
  };

  // HANDLE RESET
  const resetListFieldSearch = () => {
    Object.keys(listFieldSearch).forEach(function (key) {
      if (key != "pageIndex") {
        listFieldSearch[key] = null;
      }
    });
  };

  const handleReset = () => {
    setTodoApi({
      ...listTodoApi,
      pageIndex: 1,
    });
    setCurrentPage(1), resetListFieldSearch();
  };

  // Fetch Data
  useEffect(() => {
    getDataRoom();
  }, [todoApi]);

  useEffect(() => {
    getDataCenter();
  }, []);

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
      dataIndex: "CreatedBy",
    },
    {
      title: "Ngày cập nhật",
      dataIndex: "ModifiedOn",
      render: (date) => moment(date).format("DD/MM/YYYY"),
    },
    {
      render: (text, data, index) => (
        <>
          <RoomForm
            dataCenter={dataCenter}
            getIndex={() => setIndexRow(index)}
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
        currentPage={currentPage}
        totalPage={totalPage && totalPage}
        getPagination={(pageNumber: number) => getPagination(pageNumber)}
        loading={isLoading}
        addClass="basic-header table-medium"
        TitlePage="Danh sách phòng"
        TitleCard={
          <RoomForm
            dataCenter={dataCenter}
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
