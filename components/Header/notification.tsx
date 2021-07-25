import React, { useEffect, useState } from "react";
import { BellOutlined,NotificationTwoTone, NotificationOutlined } from "@ant-design/icons";
import { List, Avatar, Popover, Button, Input, Select } from 'antd';
import Link from "next/link";
import { notificationApi } from "~/apiBase";
import { count } from "console";
import { setInterval } from "timers";
import ReactHtmlParser from 'react-html-parser';

const Notifiaction = () => {
    const [dataTable, setDataTable] = useState([]);
    const [isLoading, setIsLoading] = useState({
        type: "",
        status: false,
    });


    const getDataNotification = () => {
		setIsLoading({
		  type: "GET_ALL",
		  status: true,
		});
		(async () => {
		  try {
			let res = await notificationApi.getAllWithUser({pageIndex: 1, pageSize: 9999});
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

    const content_notification = (
        <div className={`wrap-notification middle`}>
            <div className="content_notification">
                <List
                    itemLayout="horizontal"
                    dataSource={dataTable}
                    className="list-notification"
                    renderItem={item => (
                        <List.Item
                            className={item.Status == 0 ? "new" : "old"}
                        >   
                            {item.Status == 0 ? (
                                <List.Item.Meta
                                    avatar={<NotificationTwoTone />}
                                    title={<a href="https://ant.design">{item.NotificationTitle}</a>}
                                    description={ReactHtmlParser(item.NotificationContent)}
                                />
                            ) : (
                                <List.Item.Meta
                                    avatar={<NotificationOutlined />}
                                    title={<a href="https://ant.design">{item.NotificationTitle}</a>}
                                    description={ReactHtmlParser(item.NotificationContent)}
                                />
                            )}

                        </List.Item>
                    )}
                />
                <div className="content_notification--link">
                    <Link href="/notification">
                    <a>Xem tất cả</a>
                    </Link>
                </div>
            </div>
        </div>
    );

    let countNoti = 0;

    for(let i=0; i < dataTable.length; i++) {
        if(dataTable[i].Status == 0) {
            countNoti++;
        }
    }


    useEffect(() => {
        getDataNotification();

        // const interval = setInterval(() => {
        //     getDataNotification();
        //   }, 1000);
        // return () => clearInterval(interval);

    },[countNoti])

    return (
        <Popover placement="bottomRight" content={content_notification} trigger="click">
            <a className="notification-icon">
                <BellOutlined />
            </a>
            <div className="count-notification">
                <span>{countNoti > 9 ? `9+` : countNoti}</span>
            </div>
        </Popover>
    )
} 
export default Notifiaction;