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
    setJobParams({
      ...listJobParams,
      JobName: data,
    });
  };

  const handleReset = () => {
    setJobParams(listJobParams);
  };
  const columns = [
    {
      title: "Nghề nghiệp",
      dataIndex: "JobName",
      ...FilterColumn("JobName", onSearch, handleReset, "text"),
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
            reloadData={() => {
              getDataJob();
            }}
          />
          <JobDelete
            jobId={data.JobID}
            reloadData={() => {
              getDataJob();
            }}
          />
        </>
      ),
    },
  ];

  let pageIndex = 1;
  const sortOption = [
    {
      dataSort: {
        sort: null,
        sortType: null,
      },
      value: 1,
      text: "Mới cập nhật",
    },
    {
      dataSort: {
        sort: null,
        sortType: true,
      },
      value: 2,
      text: "Từ dưới lên",
    },
    {
      dataSort: {
        sort: 1,
        sortType: null,
      },
      value: 3,
      text: "A-z",
    },
    {
      dataSort: {
        sort: 2,
        sortType: null,
      },
      value: 4,
      text: "Z-a",
    },
  ];

  const handleSort = async (option) => {
    setJobParams({
      ...jobParams,
      sort: option.title.sort,
      sortType: option.title.sortType,
    });
  };

  const [job, setJob] = useState<IJob[]>([]);
  const [isLoading, setIsLoading] = useState({
    type: "GET_ALL",
    status: false,
  });

  const { showNoti } = useWrap();
  const [totalPage, setTotalPage] = useState(null);

  const listJobParams = {
    pageSize: 10,
    pageIndex: pageIndex,
    sort: null,
    sortType: null,
    JobName: "",
  };
  const [jobParams, setJobParams] = useState(listJobParams);

  const getDataJob = () => {
    setIsLoading({
      type: "GET_ALL",
      status: true,
    });
    (async () => {
      try {
        let res = await jobApi.getAll(jobParams);
        res.status == 200 && setJob(res.data.data);
        setTotalPage(res.data.totalRow);
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
    getDataJob();
  }, [jobParams]);

  const getPagination = (pageNumber: number) => {
    pageIndex = pageNumber;
    setJobParams({
      ...jobParams,
      pageIndex: pageIndex,
    });
  };

  return (
    <PowerTable
      loading={isLoading}
      totalPage={totalPage && totalPage}
      getPagination={(pageNumber: number) => getPagination(pageNumber)}
      addClass="basic-header"
      TitlePage="Jobs list"
      TitleCard={
        <JobForm
          reloadData={() => {
            getDataJob();
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
