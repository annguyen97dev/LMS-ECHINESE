import React from "react";
import PowerTable from "~/components/PowerTable";
import { data } from "../../../lib/option/dataOption2";
import FilterColumn from "~/components/Tables/FilterColumn";
import FilterDateColumn from "~/components/Tables/FilterDateColumn";
import SortBox from "~/components/Elements/SortBox";
import FilterTable from "~/components/Global/CourseList/FitlerTable";
import LayoutBase from "~/components/LayoutBase";
import { Copy, Power } from "react-feather";
import { Tooltip } from "antd";

const MeetingZoom = () => {
  const columns = [
    {
      title: "RoomID",
      dataIndex: "roomID",
      render: (roomID) => (
        <div className="d-flex">
          <div>{roomID}</div>
          <Tooltip title="Sao chép link lớp học">
            <button
              className="btn btn-icon"
              style={{
                marginLeft: "1.5rem",
                paddingTop: "0px",
              }}
            >
              <Copy style={{ color: "blueviolet" }} />
            </button>
          </Tooltip>
        </div>
      ),
    },
    { title: "Khóa học", dataIndex: "centerCourse" },
    { title: "Ca học", dataIndex: "timeClass" },

    {
      title: "Ngày học",
      dataIndex: "expires",
    },
    {
      title: "Giáo viên",
      dataIndex: "teacherName",
    },
    {
      title: "Trạng thái",
      dataIndex: "statusZoom",
      render: (statusZoom) => (
        <>
          {statusZoom % 2 == 0 ? (
            <span className="tag green">Đang diễn ra</span>
          ) : (
            <span className="tag gray">Đã đóng</span>
          )}

          {statusZoom % 2 == 0 && (
            <Tooltip title="Đóng phòng học">
              <button
                className="btn btn-icon delete"
                style={{ marginLeft: "2rem" }}
              >
                <Power />
              </button>
            </Tooltip>
          )}
        </>
      ),
    },
  ];

  return (
    <PowerTable
      addClass="basic-header"
      TitlePage="Jobs list"
      dataSource={data}
      columns={columns}
      Extra={
        <div className="extra-table">
          <FilterTable />
          <SortBox />
        </div>
      }
    />
  );
};
MeetingZoom.layout = LayoutBase;
export default MeetingZoom;
