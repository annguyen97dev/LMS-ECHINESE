import React, { useEffect, useRef, useState } from "react";
import PowerTable from "~/components/PowerTable";
import JobForm from "~/components/Global/Option/Job/JobForm";
import SortBox from "~/components/Elements/SortBox";
import LayoutBase from "~/components/LayoutBase";
import { useWrap } from "~/context/wrap";
import { jobApi } from "~/apiBase";
import moment from "moment";
import JobDelete from "~/components/Global/Option/Job/JobDelete";
import FilterColumn from "~/components/Tables/FilterColumn";

const JobsList = () => {
  const onSearch = (data) => {
    setCurrentPage(1);
    setJobParams({
      ...listJobParams,
      pageSize: null,
      JobName: data,
    });
  };

  const handleReset = () => {
    setCurrentPage(1);
    setJobParams(listJobParams);
  };

  const columns = [
    {
      title: "Nghề nghiệp",
      dataIndex: "JobName",
      ...FilterColumn("JobName", onSearch, handleReset, "text"),
      render: (text) => <p className="font-weight-black">{text}</p>,
    },
    { title: "Modified By", dataIndex: "ModifiedBy" },
    {
      title: "Modified Date",
      dataIndex: "ModifiedOn",
      render: (date) => moment(date).format("DD/MM/YYYY"),
    },

    {
      render: (data) => (
        <>
          <JobForm
            jobDetail={data}
            jobId={data.JobID}
            reloadData={(firstPage) => {
              getDataJob(firstPage);
            }}
            currentPage={currentPage}
          />
          <JobDelete
            jobId={data.JobID}
            reloadData={(firstPage) => {
              getDataJob(firstPage);
            }}
            currentPage={currentPage}
          />
        </>
      ),
    },
  ];

  const sortOption = [
    {
      dataSort: {
        sortType: null,
      },
      value: 1,
      text: "Mới cập nhật",
    },
    {
      dataSort: {
        sortType: true,
      },
      value: 2,
      text: "Từ dưới lên",
    },
  ];

  const handleSort = async (option) => {
    setJobParams({
      ...listJobParams,
      sortType: option.title.sortType,
    });
  };

  const [job, setJob] = useState<IJob[]>([]);
  const [isLoading, setIsLoading] = useState({
    type: "GET_ALL",
    status: false,
  });

  const { showNoti, pageSize } = useWrap();
  const [totalPage, setTotalPage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const listJobParams = {
    pageSize: pageSize,
    pageIndex: currentPage,
    sort: null,
    sortType: null,
    JobName: "",
  };

  const [jobParams, setJobParams] = useState(listJobParams);

  const getDataJob = (page: any) => {
    setIsLoading({
      type: "GET_ALL",
      status: true,
    });
    (async () => {
      try {
        let res = await jobApi.getAll({ ...jobParams, pageIndex: page });
        res.status == 200 && setJob(res.data.data);
        if (res.status == 204) {
          showNoti("danger", "Không tìm thấy dữ liệu!");
          setCurrentPage(1);
          setJobParams(listJobParams);
          setJob([]);
        } else setTotalPage(res.data.totalRow);
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
    getDataJob(currentPage);
  }, [jobParams]);

  const getPagination = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    setJobParams({
      ...jobParams,
      pageIndex: currentPage,
    });
  };

  return (
    <PowerTable
      currentPage={currentPage}
      loading={isLoading}
      totalPage={totalPage && totalPage}
      getPagination={(pageNumber: number) => getPagination(pageNumber)}
      addClass="basic-header"
      TitlePage="Jobs list"
      TitleCard={
        <JobForm
          reloadData={(firstPage) => {
            setCurrentPage(1);
            getDataJob(firstPage);
          }}
        />
      }
      dataSource={job}
      columns={columns}
      Extra={
        <div className="extra-table">
          <SortBox
            dataOption={sortOption}
            handleSort={(value) => handleSort(value)}
          />
        </div>
      }
    />
  );
};
JobsList.layout = LayoutBase;
export default JobsList;
