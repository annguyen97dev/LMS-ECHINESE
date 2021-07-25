import React, { Fragment, useEffect, useState } from "react";
import ExpandTable from "~/components/ExpandTable";
// import { data } from "../../../lib/option/dataOption2";
import PowerTable from "~/components/PowerTable";
import SortBox from "~/components/Elements/SortBox";
import FilterColumn from "~/components/Tables/FilterColumn";
import FilterDateColumn from "~/components/Tables/FilterDateColumn";
import FilterTable from "~/components/Global/CourseList/FitlerTable";
import LayoutBase from "~/components/LayoutBase";
import { Eye, AlertCircle } from "react-feather";

import { notificationApi } from "~/apiBase";
import { useWrap } from "~/context/wrap";
import moment from "moment";
import { Checkbox, Row, Col, Tooltip } from 'antd';
import document from "next/document";
import ReactHtmlParser from 'react-html-parser';
import { id } from "date-fns/locale";
import Modal from "antd/lib/modal/Modal";

const Notification = () => {
    const [dataTable, setDataTable] = useState([]);
    const [dataSeen, setDataSeen] = useState({
        ID: null,

    })
    const [contentRow, setContentRow] = useState({
        content: null,
        title: null,
    })
    const { showNoti } = useWrap();
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [isLoading, setIsLoading] = useState({
	  type: "",
	  status: false,
	});
    const [totalPage, setTotalPage] = useState(null);
	const [currentPage, setCurrentPage] = useState(1);

    let pageIndex = 1;
    // PARAMS API GETALL
	const listTodoApi = {
		pageSize: 10,
		pageIndex: pageIndex,
	};
	const [todoApi, setTodoApi] = useState(listTodoApi);

    // GET DATA
    const getDataTable = () => {
		setIsLoading({
		  type: "GET_ALL",
		  status: true,
		});
		(async () => {
		  try {
			let res = await notificationApi.getAllWithUser(todoApi);
			if(res.status == 204) {
				showNoti("danger", "Không có dữ liệu");
			}
			if(res.status == 200){
				setTotalPage(res.data.totalRow);
                setDataTable(res.data.data);
            }
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

    // PAGINATION
	const getPagination = (pageNumber: number) => {
		pageIndex = pageNumber;
		setCurrentPage(pageNumber);
		setTodoApi({
		  ...todoApi,
		//   ...listFieldSearch,
		  pageIndex: pageIndex,
		});
	};

    const _onSubmit = async (data:any) => {
        setIsLoading({
            type: "UPDATE_DATA",
            status: true,
        });
      
        let res = null;
        try {
            res = await notificationApi.upadteSeen(data);
            res?.status == 200 && showNoti("success", "Cập nhật thành công"), getDataTable();
        } catch (error) {
            showNoti("danger", error.message);
        } finally {
            setIsLoading({
            type: "ADD_DATA",
            status: false,
            });
        }
    
        return res;
    }

    const onChange = e => {
        console.log('Checked Value: ', e.target.value);
        const data = {
            ID: e.target.value
        }
        _onSubmit(data);
    };

    const columns = [
        { 
            title: "Tên thông báo", 
            dataIndex: "NotificationTitle", 
            // ...FilterColumn("center")
            render: (text) =>  <p className="font-weight-black">{text}</p>
        },
        { 
            title: "Nội dung thông báo", 
            dataIndex: "NotificationContent",
            render: (text) => <div className="content-notification">{ReactHtmlParser(text)}</div>  
            // ...FilterColumn("supplier") 
        },
        { 
            title: "Thời gian", 
            dataIndex: "CreatedOn",
            render: (date) => <p className="font-weight-blue">{moment(date).format("DD/MM/YYYY")}</p>,  
        },
        {
            render: (record) => (
                <Tooltip title="Chi tiết">
                    <button
                        className="btn btn-icon edit"
                        onClick={() => {
                            setIsModalVisible(true);
                            setDataSeen({
                                ID: record.ID,
                            });
                            setContentRow({
                                content: record.NotificationContent,
                                title: record.NotificationTitle
                            });
                        }}
                    >
                        <Eye />
                    </button>
                </Tooltip>
            )
        },
        { 
            title: () => (<Checkbox value={0} onChange={onChange}><span className="color-white">Xem tất cả</span></Checkbox>), 
            dataIndex: "Status",
            // render: (record) => (
            //     record.Status == 0
            //     ? ( <Checkbox value={record.ID} onChange={onChange}><span className="font-weight-black">Xem</span></Checkbox>) 
            //     : (<Checkbox checked><span className="font-weight-black">Xem</span></Checkbox>)
            // ),
            render: (text, record) => <p>{text == 0 ? (<Checkbox className="uncheck" value={record.ID} onChange={onChange}><span className="font-weight-black">Xem</span></Checkbox>) : (<Checkbox checked><span className="font-weight-black">Xem</span></Checkbox>)}</p>
        },
    ];

    useEffect(() => {
        getDataTable()
    }, [todoApi])

    return (
        <>
            <Modal
				title={<AlertCircle color="#32c6a4" />}
				visible={isModalVisible}
				onOk={() => _onSubmit(dataSeen)}
				onCancel={() => {setIsModalVisible(false); _onSubmit(dataSeen)}}
			>
				<div className="content-notification">
                    <p className="font-weight-black fz-18 mb-15">{contentRow.title}</p>
                    {ReactHtmlParser(contentRow.content)}
                </div>
			</Modal>
            <PowerTable
                loading={isLoading}
                currentPage={currentPage}
                totalPage={totalPage && totalPage}
                getPagination={(pageNumber: number) => getPagination(pageNumber)}
                addClass="basic-header"
                TitlePage="NOTIFICATION list"
                // TitleCard={
                //     <PurposeForm 
                //         showAdd={true} 
                //         isLoading={isLoading} 
                //         _onSubmit={(data: any) => _onSubmit(data)}
                //     />}
                dataSource={dataTable}
                columns={columns}
            />
        </>

        );
    };
Notification.layout = LayoutBase;
export default Notification;
