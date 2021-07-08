import LayoutBase from "~/components/LayoutBase";
import PowerTable from "~/components/PowerTable";
import SortBox from "~/components/Elements/SortBox";
import FilterColumn from "~/components/Tables/FilterColumn";
import { Tooltip, Switch, DatePicker } from "antd";
import moment from 'moment';
import { dataListTask } from "~/lib/staff/dataListTask";
import TaskForm from "~/components/Global/StaffList/ManageTask/TaskForm";
import DrawerForm from "~/components/Global/StaffList/ManageTask/DrawerForm";
import { useState } from "react";

const dateFormat = 'DD/MM/YYYY';
const monthFormat = 'MM/YYYY';

const { RangePicker } = DatePicker; 

const dataOption = [];

const ManageTask = () => {
    const [isOpen, setIsOpen] = useState({
      isOpen: false,
      status: null,
    });
    const [isShowSubTask, setIsShowSubTask] = useState(false)

    const dataNotification = [
      {
        text: "Echinese đã hoàn thành công việc 1 vào Kiểm tra tài liệu - 01/07/2021 3:21:18 PM",
      },
      {
        text: "Echinese đã hoàn thành công việc 1 vào Kiểm tra tài liệu - 01/07/2021 3:21:18 PM",
      },
      {
        text: "Echinese đã hoàn thành công việc 1 vào Kiểm tra tài liệu - 01/07/2021 3:21:18 PM",
      },
      {
        text: "Echinese đã hoàn thành công việc 1 vào Kiểm tra tài liệu - 01/07/2021 3:21:18 PM",
      },
      {
        text: "Echinese đã hoàn thành công việc 1 vào Kiểm tra tài liệu - 01/07/2021 3:21:18 PM",
      }
    ];
    const columns = [
        {
            title: "Nhóm công việc",
            dataIndex: "TitleTask",
            ...FilterColumn("TitleTask")
        },
        {
            title: "Ghi chú",
            dataIndex: "Note",
        },
        {
            title: "Hạn làm",
            dataIndex: "DateTask",
        },
        {
            title: "Ngày tạo",
            dataIndex: "CreateTaskAt",
        },
        {
            title: "Tiến độ",
            dataIndex: "Progress",
        },
        {
            title: "Hidden",
            dataIndex: "Enable",
            render: (Enable, record) => (
              <>
                <Switch
                  checkedChildren="Hiện"
                  unCheckedChildren="Ẩn"
                  checked={Enable}
                //   size="default"
                //   onChange={(checked) => changeStatus(checked, record.ListCourseID)}
                />
              </>
            ),
        },
        {
            render: (record) => (
              <>
                <Tooltip title="Thêm nhân viên">
                  <TaskForm
                    showIcon={true}
                  />
                </Tooltip>
              </>
            ),
        },
    ];


    return (
        <>
        <PowerTable
          columns={columns}
          dataSource={dataListTask}
          TitlePage="Danh sách task"
          TitleCard={
            <TaskForm
                showAdd={true}
            />}
          Extra={
            <div className="extra-table">
              <div className="filter-datetime">
                <RangePicker
                  defaultValue={[moment('2015/01/01', dateFormat), moment('2015/01/01', dateFormat)]}
                  format={dateFormat}
                  className="style-input"
                />
              </div>
                <SortBox dataOption={dataOption} />
                <DrawerForm
                  data={dataNotification}
                />
            </div>
          }
        >
        </PowerTable>
      </>
    )
}

ManageTask.layout = LayoutBase;
export default ManageTask;