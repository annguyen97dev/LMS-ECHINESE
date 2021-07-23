import moment from "moment";
import React, { Fragment, useEffect, useState } from "react";
import { examServiceApi } from "~/apiBase/options/examServices";
import { feedbackApi } from "~/apiBase/options/feedback";
import ExamForm from "~/components/Global/Option/ExamForm";
import FeedbackDelete from "~/components/Global/Option/Feedback/FeedbackDelete";
import FeedBackForm from "~/components/Global/Option/Feedback/FeedBackForm";
import FilterFeedbackTable from "~/components/Global/Option/FilterTable/FilterFeedbackTable";
import LayoutBase from "~/components/LayoutBase";
import PowerTable from "~/components/PowerTable";
import FilterColumn from "~/components/Tables/FilterColumn";
import { useWrap } from "~/context/wrap";

const ExamServices = () => {
  const onSearch = (data) => {
    setCurrentPage(1);
    setParams({
      ...listParamsDefault,
      // search: data,
    });
  };

  const handleReset = () => {
    setCurrentPage(1);
    setParams(listParamsDefault);
  };
  const columns = [
    {
      title: "Nguồn dịch vụ",
      dataIndex: "SupplierServicesName",
    },
    {
      title: "Đợt thi",
      dataIndex: "ServicesName",
      // ...FilterColumn("Name", onSearch, handleReset, "text"),
    },
    {
      title: "Hình thức",
      dataIndex: "ExamOfServiceStyle",
      render: (type) => (
        <Fragment>
          {type == 1 && <span className="tag blue">Thi Thật</span>}
          {type == 2 && <span className="tag green">Thi Thử</span>}
        </Fragment>
      ),
    },

    {
      title: "Ngày thi",
      dataIndex: "DayOfExam",
      render: (date) => moment(date).format("DD/MM/YYYY"),
    },
    { title: "Thời gian thi", dataIndex: "TimeExam" },
    { title: "Số thí sinh", dataIndex: "Amount" },
    {
      title: "Giá bài thi",
      dataIndex: "Price",
      render: (price) => (
        <span>{Intl.NumberFormat("ja-JP").format(price)}</span>
      ),
    },
    {
      title: "Trả trước",
      dataIndex: "InitialPrice",
      render: (price) => (
        <span>{Intl.NumberFormat("ja-JP").format(price)}</span>
      ),
    },
    {
      render: (data) => (
        <>
          {/* <FeedBackForm
            feedbackDetail={data}
            feedbackId={data.ID}
            reloadData={(firstPage) => {
              getDataExamServices(firstPage);
            }}
            currentPage={currentPage}
          />

          <FeedbackDelete
            feedbackId={data.ID}
            reloadData={(firstPage) => {
              getDataExamServices(firstPage);
            }}
            currentPage={currentPage}
          /> */}
          <ExamForm showIcon={true} />
        </>
      ),
    },
  ];
  const [currentPage, setCurrentPage] = useState(1);

  const listParamsDefault = {
    pageSize: 10,
    pageIndex: currentPage,
    sort: null,
    sortType: null,
    fromDate: null,
    toDate: null,
    ExamOfServiceStyle: null,
    SupplierServicesID: null,
    ServicesName: null,
  };

  const [params, setParams] = useState(listParamsDefault);
  const { showNoti } = useWrap();
  const [totalPage, setTotalPage] = useState(null);
  const [examServices, setExamServices] = useState<IExamServices[]>([]);
  const [isLoading, setIsLoading] = useState({
    type: "GET_ALL",
    status: false,
  });

  const getPagination = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    setParams({
      ...params,
      pageIndex: currentPage,
    });
  };

  const getDataExamServices = (page: any) => {
    setIsLoading({
      type: "GET_ALL",
      status: true,
    });
    (async () => {
      try {
        let res = await examServiceApi.getPaged({ ...params, pageIndex: page });
        res.status == 200 && setExamServices(res.data.data);
        if (res.status == 204) {
          showNoti("danger", "Không tìm thấy dữ liệu!");
          setCurrentPage(1);
          setParams(listParamsDefault);
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
    getDataExamServices(currentPage);
  }, [params]);

  // const _onFilterTable = (data) => {
  //   setParams({ ...listParamsDefault, Role: data.RoleID });
  // };

  return (
    <PowerTable
      currentPage={currentPage}
      loading={isLoading}
      totalPage={totalPage && totalPage}
      getPagination={(pageNumber: number) => getPagination(pageNumber)}
      addClass="basic-header"
      TitlePage="Đợt thi"
      TitleCard={
        // <FeedBackForm
        //   reloadData={(firstPage) => {
        //     setCurrentPage(1);
        //     getDataExamServices(firstPage);
        //   }}
        // />
        <ExamForm showAdd={true} />
      }
      dataSource={examServices}
      columns={columns}
      // Extra={
      //   <div className="extra-table">
      //     <FilterFeedbackTable
      //       _onFilter={(value: any) => _onFilterTable(value)}
      //     />
      //   </div>
      // }
    />
  );
};
ExamServices.layout = LayoutBase;
export default ExamServices;
