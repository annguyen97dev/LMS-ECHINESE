import React, { useEffect, useState } from "react";
import PowerTable from "~/components/PowerTable";
import { data } from "../../../lib/option/dataOption2";
import JobForm from "~/components/Global/Option/JobForm";
import FilterColumn from "~/components/Tables/FilterColumn";
import SortBox from "~/components/Elements/SortBox";
import LayoutBase from "~/components/LayoutBase";
import { useWrap } from "~/context/wrap";
import { jobApi } from "~/apiBase";

const JobsList = () => {
  const columns = [
    {
      title: "Nghề nghiệp",
      dataIndex: "JobName",
      ...FilterColumn("JobName"),
    },
    { title: "Modified By", dataIndex: "ModifiedBy" },
    {
      title: "Modified Date",
      dataIndex: "ModifiedOn",
    },
    {
      render: () => (
        <>
          <JobForm showIcon={true} />
        </>
      ),
    },
  ];

  const [job, setJob] = useState<IJob[]>([]);
  const [isLoading, setIsLoading] = useState({
    type: "",
    status: false,
  });

  const { showNoti } = useWrap();
  const [rowData, setRowData] = useState<IJob>();
  const [totalPage, setTotalPage] = useState(null);
  let indexPage = 1;

  const getDataJob = () => {
    setIsLoading({
      type: "GET_ALL",
      status: true,
    });
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

  const _onSubmit = async (data: any) => {
    setIsLoading({
      type: "ADD_DATA",
      status: true,
    });
    let res = null;
    if (data.ID) {
      try {
        res = await jobApi.update(data);
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
        res = await jobApi.add(data);
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

  const afterPost = (mes) => {
    showNoti("success", mes);
    getDataJob();
  };

  return (
    <PowerTable
      totalPage={totalPage && totalPage}
      getPagination={(pageNumber: number) => getPagination(pageNumber)}
      loading={isLoading}
      addClass="basic-header"
      TitlePage="Jobs list"
      TitleCard={
        <JobForm
          showAdd={true}
          isLoading={isLoading}
          _onSubmit={(data: any) => _onSubmit(data)}
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
