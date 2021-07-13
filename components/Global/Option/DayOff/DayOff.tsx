import moment from "moment";
import React, { useEffect, useState } from "react";
import dayOffApi from "~/apiBase/options/day-off";
import SortBox from "~/components/Elements/SortBox";
import DayOffForm from "~/components/Global/Option/DayOff/DayOffForm";
import PowerTable from "~/components/PowerTable";
import { useWrap } from "~/context/wrap";
// import TableSearch from '../TableSearch/TableSearch';
import FilterColumn from "~/components/Tables/FilterColumn";
import DayOffDelete from "./DayOffDelete";

let listFieldSearch = {
  DayOff: "",
  DayOffName: "",
  fromDate: "",
  toDate: "",
};

let pageIndex = 1;

const DayOff = () => {
  const [dayOffList, setDayOffList] = useState<IDayOff[]>([]);
  const [isLoading, setIsLoading] = useState({
    type: "",
    status: false,
  });
  const [totalPage, setTotalPage] = useState(null);
  const { showNoti } = useWrap();

  // FILTER
  const clearSearchFilter = {
    pageIndex: pageIndex,
    pageSize: 10,
    sort: 0,
    DayOff: "",
    DayOffName: "",
    fromDate: "",
    toDate: "",
    searchCreateby: "",
  };

  const [filter, setFilter] = useState(clearSearchFilter);
  const sortOptionList = [
    {
      value: 1,
      text: "Ngày tăng dần",
    },
    {
      value: 2,
      text: "Ngày giảm dần",
    },
    {
      value: 3,
      text: "Tên tăng dần",
    },
    {
      value: 4,
      text: "Tên giảm dần",
    },
  ];
  // GET DATA IN FIRST TIME
  const fetchDayOffList = async () => {
    setIsLoading({
      type: "GET_ALL",
      status: true,
    });
    try {
      let res = await dayOffApi.getAll(filter);

      if (res.status === 200) {
        setDayOffList(res.data.data);
        setTotalPage(res.data.totalRow);
        res.data.data.length > 0
          ? showNoti("success", res.data.message)
          : showNoti("danger", "Không tìm thấy");
      }
    } catch (error) {
      showNoti("danger", error.message);
    } finally {
      setIsLoading({
        type: "GET_ALL",
        status: false,
      });
    }
  };

  useEffect(() => {
    fetchDayOffList();
  }, [filter]);
  // PAGINATION
  const getPagination = (page: number) => {
    pageIndex = page;
    const newFilter = {
      ...filter,
      pageIndex,
    };
    setFilter(newFilter);
  };
  // SORT
  const onSort = (value: number) => {
    setFilter({
      ...filter,
      ...clearSearchFilter,
      sort: value,
    });
  };
  // SEARCH
  // const onSearchDayOff = (date: any) => {
  // 	const newFilter = {
  // 		...filter,
  // 		DayOff: moment(date.toDate()).format('YYYY/MM/DD'),
  // 	};
  // 	setFilter(newFilter);
  // };
  // const onSearchDayOffName = (note: string) => {
  // 	const newFilter = {
  // 		...filter,
  // 		DayOffName: note,
  // 	};
  // 	setFilter(newFilter);
  // };
  // const onSearchDayOffCreatedOn = (date: Array<any>) => {
  // 	const newFilter = {
  // 		...filter,
  // 		fromDate: moment(date[0].toDate()).format('YYYY/MM/DD'),
  // 		toDate: moment(date[1].toDate()).format('YYYY/MM/DD'),
  // 	};
  // 	setFilter(newFilter);
  // };

  const onResetSearchDayOff = () => {
    let newFilter = filter;

    setFilter({
      ...newFilter,
      ...clearSearchFilter,
    });
  };

  const checkField = (valueSearch, dataIndex) => {
    Object.keys(listFieldSearch).forEach(function (key) {
      console.log("key: ", key);
      if (key != dataIndex) {
        listFieldSearch[key] = "";
      } else {
        listFieldSearch[key] = valueSearch;
      }
      if (dataIndex == "CreatedOn") {
        listFieldSearch.fromDate = valueSearch.fromDate;
        listFieldSearch.toDate = valueSearch.toDate;
      }
    });

    return listFieldSearch;
    // newList = listFieldSearch;
    // return newList;
  };

  const onSearch = (valueSearch, dataIndex) => {
    let clearKey = checkField(valueSearch, dataIndex);

    setFilter({
      ...filter,
      ...clearKey,
    });
  };

  // CREATE
  const onCreateDayOff = async (data: any) => {
    setIsLoading({
      type: "GET_ALL",
      status: true,
    });
    try {
      const res = await dayOffApi.add({
        ...data,
        DayOff: moment(data.DayOff).format("YYYY/MM/DD"),
        Enable: true,
      });
      const { data: newData, message } = res.data;
      if (res.status === 200) {
        const newDayOffList = [newData, ...dayOffList];
        setDayOffList(newDayOffList);
        fetchDayOffList();
        showNoti("success", message);
      }
    } catch (error) {
      showNoti("danger", error.message);
    } finally {
      setIsLoading({
        type: "GET_ALL",
        status: false,
      });
    }
  };
  // UPDATE
  const onUpdateDayOff = async (newObj: any, idx: number, oldObj: any) => {
    setIsLoading({
      type: "GET_ALL",
      status: true,
    });
    try {
      const newDayOff = {
        ...oldObj,
        ...newObj,
        DayOff: moment(newObj.DayOff).format("YYYY/MM/DD"),
      };
      const res = await dayOffApi.update(newDayOff);
      if (res.status === 200) {
        const { message } = res.data;
        const newDayOffList = [...dayOffList];
        newDayOffList.splice(idx, 1, newDayOff);
        setDayOffList(newDayOffList);
        showNoti("success", message);
      }
    } catch (error) {
      showNoti("danger", error.message);
    } finally {
      setIsLoading({
        type: "GET_ALL",
        status: false,
      });
    }
  };
  // DELETE
  const onDeleteDayOff = async (id: number, idx: number) => {
    setIsLoading({
      type: "GET_ALL",
      status: true,
    });
    try {
      const res = await dayOffApi.delete(id);
      if (res.status === 200) {
        const { message } = res.data;
        const newDayOffList = [...dayOffList];
        newDayOffList.splice(idx, 1);
        setDayOffList(newDayOffList);
        fetchDayOffList();
        showNoti("success", message);
      }
    } catch (error) {
      showNoti("danger", error.message);
    } finally {
      setIsLoading({
        type: "GET_ALL",
        status: false,
      });
    }
  };
  // COLUMN FOR TABLE
  const columns = [
    {
      title: "Ngày nghỉ",
      dataIndex: "DayOff",
      ...FilterColumn("DayOff", onSearch, onResetSearchDayOff, "date"),
      render: (date) => moment(date).format("DD/MM/YYYY"),
    },
    {
      title: "Ghi chú",
      dataIndex: "DayOffName",
      ...FilterColumn("DayOffName", onSearch, onResetSearchDayOff, "text"),
    },
    {
      title: "Ngày khởi tạo",
      dataIndex: "CreatedOn",
      //   ...FilterColumn("CreatedOn", onSearch, onResetSearchDayOff, "date-range"),
      render: (date) => moment(date).format("DD/MM/YYYY"),
    },
    {
      title: "Được tạo bởi",
      dataIndex: "CreatedBy",
    },
    {
      render: (value, _, idx) => (
        <>
          <DayOffDelete
            handleDeleteDayOff={onDeleteDayOff}
            deleteIDObj={value.ID}
            index={idx}
          />
          <DayOffForm
            isUpdate={true}
            updateObj={value}
            idxUpdateObj={idx}
            handleUpdateDayOff={onUpdateDayOff}
          />
        </>
      ),
    },
  ];
  // RETURN
  return (
    <PowerTable
      totalPage={totalPage && totalPage}
      getPagination={(pageNumber: number) => getPagination(pageNumber)}
      loading={isLoading}
      addClass="basic-header"
      TitlePage="Day Off"
      TitleCard={
        <DayOffForm isUpdate={false} handleCreateDayOff={onCreateDayOff} />
      }
      dataSource={dayOffList}
      columns={columns}
      Extra={
        <div className="extra-table">
          {/* <FilterDayOffTable /> */}
          <SortBox handleSort={onSort} dataOption={sortOptionList} />
        </div>
      }
    />
  );
};

export default DayOff;
