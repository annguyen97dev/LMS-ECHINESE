import moment from "moment";
import React, { useEffect, useState } from "react";
import { feedbackApi } from "~/apiBase/options/feedback";
import FeedbackDelete from "~/components/Global/Option/Feedback/FeedbackDelete";
import FeedBackForm from "~/components/Global/Option/Feedback/FeedBackForm";
import FilterFeedbackTable from "~/components/Global/Option/FilterTable/FilterFeedbackTable";
import LayoutBase from "~/components/LayoutBase";
import PowerTable from "~/components/PowerTable";
import FilterColumn from "~/components/Tables/FilterColumn";
import { useWrap } from "~/context/wrap";
import { Roles } from "~/lib/roles/listRoles";

const FeedBackList = () => {
  const onSearch = (data) => {
    setCurrentPage(1);
    setParams({
      ...listParamsDefault,
      search: data,
    });
  };

  const handleReset = () => {
    setCurrentPage(1);
    setParams(listParamsDefault);
  };
  const columns = [
    {
      title: "Role",
      dataIndex: "Role",
      render: (Role) => Roles.find((r) => r.id == Role)?.RoleName,
    },
    {
      title: "Loại phản hồi",
      dataIndex: "Name",
      ...FilterColumn("Name", onSearch, handleReset, "text"),
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
          <FeedBackForm
            feedbackDetail={data}
            feedbackId={data.ID}
            reloadData={(firstPage) => {
              getDataFeedback(firstPage);
            }}
            currentPage={currentPage}
          />

          <FeedbackDelete
            feedbackId={data.ID}
            reloadData={(firstPage) => {
              getDataFeedback(firstPage);
            }}
            currentPage={currentPage}
          />
        </>
      ),
    },
  ];
  const [currentPage, setCurrentPage] = useState(1);

  const listParamsDefault = {
    pageSize: 10,
    pageIndex: currentPage,
    search: null,
    Role: null,
  };

  const [params, setParams] = useState(listParamsDefault);
  const { showNoti } = useWrap();
  const [totalPage, setTotalPage] = useState(null);
  const [feedback, setFeedback] = useState<IFeedback[]>([]);
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

  const getDataFeedback = (page: any) => {
    setIsLoading({
      type: "GET_ALL",
      status: true,
    });
    (async () => {
      try {
        let res = await feedbackApi.getAll({ ...params, pageIndex: page });
        res.status == 200 && setFeedback(res.data.data);
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
    getDataFeedback(currentPage);
  }, [params]);

  const _onFilterTable = (data) => {
    setParams({ ...listParamsDefault, Role: data.RoleID });
  };

  return (
    <PowerTable
      currentPage={currentPage}
      loading={isLoading}
      totalPage={totalPage && totalPage}
      getPagination={(pageNumber: number) => getPagination(pageNumber)}
      addClass="basic-header"
      TitlePage="Feedback category"
      TitleCard={
        <FeedBackForm
          reloadData={(firstPage) => {
            setCurrentPage(1);
            getDataFeedback(firstPage);
          }}
        />
      }
      dataSource={feedback}
      columns={columns}
      Extra={
        <div className="extra-table">
          <FilterFeedbackTable
            _onFilter={(value: any) => _onFilterTable(value)}
          />
        </div>
      }
    />
  );
};
FeedBackList.layout = LayoutBase;
export default FeedBackList;
