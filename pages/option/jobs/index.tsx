import React, { useEffect, useRef, useState } from "react";
import PowerTable from "~/components/PowerTable";
import JobForm from "~/components/Global/Option/Job/JobForm";
import SortBox from "~/components/Elements/SortBox";
import LayoutBase from "~/components/LayoutBase";
import { useWrap } from "~/context/wrap";
import { jobApi } from "~/apiBase";
import moment from "moment";
import JobDelete from "~/components/Global/Option/Job/JobDelete";

const JobsList = () => {
  const columns = [
    {
      title: "Nghề nghiệp",
      dataIndex: "JobName",
      // ...FilterColumn("JobName"),
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

  const [job, setJob] = useState<IJob[]>([]);
  const [isLoading, setIsLoading] = useState({
    type: "GET_ALL",
    status: true,
  });

  const { showNoti } = useWrap();
  const [totalPage, setTotalPage] = useState(null);
  let indexPage = 1;

  const getDataJob = () => {
    (async () => {
      try {
        let res = await jobApi.getAll(10, indexPage);
        res.status == 200 && setJob(res.data.data),
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
  }, []);

  const getPagination = (pageNumber: number) => {
    indexPage = pageNumber;
    getDataJob();
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
          <SortBox />
        </div>
      }
    />
  );
};
JobsList.layout = LayoutBase;
export default JobsList;
