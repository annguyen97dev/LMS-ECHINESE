import React, { useEffect, useState } from "react";
import { BellOutlined,NotificationTwoTone, NotificationOutlined, MoreOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { List, Avatar, Popover, Button, Input, Select, Tooltip, Card } from 'antd';
import Link from "next/link";
import { notificationApi } from "~/apiBase";
import { count } from "console";
import { setInterval } from "timers";
import ReactHtmlParser from 'react-html-parser';
import Modal from "antd/lib/modal/Modal";
import { Eye, AlertCircle } from "react-feather";

const Notifiaction = () => {
    const [dataTable, setDataTable] = useState([]);
    const [show, setShow] = useState(false)
    const [isLoading, setIsLoading] = useState({
        type: "",
        status: false,
    });
    const [dataSeen, setDataSeen] = useState({
        ID: null,
    })
    const [contentRow, setContentRow] = useState({
        content: null,
        title: null,
        status: null,
    })
    const [isModalVisible, setIsModalVisible] = useState(false);

	const listTodoApi = {
		pageSize: 999,
		pageIndex: 1,
	};
	const [todoApi, setTodoApi] = useState(listTodoApi);

    const getDataNotification = () => {
		setIsLoading({
		  type: "GET_ALL",
		  status: true,
		});
		(async () => {
		  try {
			let res = await notificationApi.getAllWithUser(todoApi);
			if(res.status == 204) {
				// showNoti("danger", "Không có dữ liệu");
                console.log("Lỗi: Không tìm thấy");
			}
			if(res.status == 200){
                setDataTable(res.data.data);
            }
		  } catch (error) {
			// showNoti("danger", error.message);
            console.log("error: ", error);
		  } finally {
			setIsLoading({
			  type: "GET_ALL",
			  status: false,
			});
		  }
		})();
	};

    const _onSubmit = async (data:any) => {
        setIsLoading({
            type: "UPDATE_DATA",
            status: true,
        });
      
        let res = null;
        try {
            res = await notificationApi.upadteSeen(data);
            res.Status == 200 && console.log("update thành công"), getDataNotification();
        } catch (error) {
            console.log("error", error.message);
        } finally {
            setIsLoading({
            type: "UPDATE_DATA",
            status: false,
            });
        }
    
        return res;
    }

    const content_notification = (
        <div className={`wrap-notification middle`}>
            <div className="content_notification">
                <Card title="Thông báo" extra={<Link href="/notification"><a>Xem tất cả</a></Link>} bordered={false}>
                <List
                    itemLayout="horizontal"
                    dataSource={dataTable}
                    className="list-notification"
                    renderItem={item => (
                        <a 
                            onClick={() => {
                                setIsModalVisible(true);
                                setShow(false);
                                setDataSeen({
                                    ID: item.ID
                                });
                                setContentRow({
                                    content: item.NotificationContent,
                                    title: item.NotificationTitle,
                                    status: item.Status,
                                });
                        }}>
                            <List.Item
                                className={item.Status == 0 ? "new" : "old"}

                            >   
                                    {item.Status == 0 ? (
                                        <List.Item.Meta
                                            avatar={<NotificationTwoTone />}
                                            title={item.NotificationTitle}
                                            description={ReactHtmlParser(item.NotificationContent)}
                                        />
                                    ) : (
                                        <List.Item.Meta
                                            avatar={<NotificationOutlined />}
                                            title={item.NotificationTitle}
                                            description={ReactHtmlParser(item.NotificationContent)}
                                        />
                                    )}
                            </List.Item>
                        </a>
                    )}
                />
                </Card>
            </div>
        </div>
    );

    let countNoti = 0;

    for(let i=0; i < dataTable.length; i++) {
        if(dataTable[i].Status == 0) {
            countNoti++;
        }
    }

    const handleVisibleChange = (visible) => {
        setShow(visible);
    }

    useEffect(() => {
        getDataNotification();
        // const interval = setInterval(() => {
        //     getDataNotification();
        //   }, 1000);
        // return () => clearInterval(interval);
    },[countNoti, todoApi])

    return (
        <>
            <Modal
				title={<AlertCircle color="#32c6a4" />}
				visible={isModalVisible}
                width={1000}
				onOk={() => {
                    setIsModalVisible(false)
                    contentRow.status == 0 && _onSubmit(dataSeen);
                }}
				onCancel={() => {
                    setIsModalVisible(false)
                    contentRow.status == 0 && _onSubmit(dataSeen);
                }}
			>
				<h4>{contentRow.title}</h4>
				<div>{ReactHtmlParser(contentRow.content)}</div>
			</Modal>
            <Popover 
                placement="bottomRight" 
                content={content_notification} 
                trigger="click"
                visible={show} 
                onVisibleChange={visible => handleVisibleChange(visible)}>
                <button className="notification-icon">
                    <BellOutlined />
                </button>
                <div className={countNoti > 0 ? "count-notification" : "hide"}>
                    <span>{countNoti > 9 ? `9+` : countNoti}</span>
                </div>
            </Popover>
        </>

    )
} 
export default Notifiaction;