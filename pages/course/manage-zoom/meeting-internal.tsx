import React, { useEffect, useState } from "react";
import TitlePage from "~/components/Elements/TitlePage";
import Link from "next/link";
import { Card } from "antd";
import LayoutBase from "~/components/LayoutBase";
import { dataCategory, dataCourse } from "~/lib/course-buy";
import { Menu, Rate } from "antd";

type dataCourse = [];

const CourseBuy = () => {
  return (
    <div className="row zoom-interval">
      <div className="col-12">
        <TitlePage title="Phòng họp nội bộ" />
        <Card className="card-zoom-wrap">
          <div className="ant-card-body-list">
            {dataCourse?.map((item, index) => {
              return (
                <div className="wrap-zoom" key={item.id}>
                  <div className="row">
                    <div className="col-2" style={{ width: "150px" }}>
                      <div className="zoom-image">
                        <a>
                          <img src={item.course_image} alt="zoom-image" />
                        </a>
                      </div>
                    </div>

                    <div className="col-9">
                      <div className="row ">
                        <div className="col-12 d-flex">
                          <span className="tag green">Đang mở</span>
                          <h5 className="zoom-title">
                            HỌP HỌC VỤ GIỮA THÁNG 6
                          </h5>
                        </div>
                      </div>

                      <div className="row pt-4 zoom-content">
                        <div className="col-10">
                          <div className="row">
                            <div className="col-4">
                              <i className="far fa-user-plus zoom-icons" />
                              <span>Người tạo:</span>
                            </div>
                            <div className="col-4">
                              <i className=" far fa-calendar-alt zoom-icons" />
                              <span> Ngày tạo:</span>
                            </div>
                            <div className="col-4">
                              <i className="far fa-play zoom-icons" />
                              <span> Lịch diễn ra:</span>
                            </div>
                          </div>

                          <div className="row pt-2">
                            <div className="col-4">
                              <i className="far fa-pause-circle zoom-icons" />
                              <span>Kết thúc lúc:</span>
                            </div>

                            <div className="col-4">
                              <i className="far fa-home zoom-icons" />
                              <span>ID Phòng: </span>
                            </div>

                            <div className="col-4">
                              <i className="far fa-unlock-alt zoom-icons" />
                              <span>Mật khẩu:</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-1"></div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
};

CourseBuy.layout = LayoutBase;
export default CourseBuy;
