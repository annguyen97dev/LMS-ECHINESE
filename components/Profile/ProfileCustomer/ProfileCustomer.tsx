import React, { useState } from "react";
import { Card, Select, Avatar, Tabs, Affix } from "antd";
import {
  UserOutlined,
  DeploymentUnitOutlined,
  WhatsAppOutlined,
  MailOutlined,
  AimOutlined,
} from "@ant-design/icons";
import InfoCusCard from "./component/InfoCusCard";
import InfoTestCard from "./component/InfoTestCard";
import InfoCourseCard from "./component/InfoCourseCard";
import InfoPaymentCard from "./component/InfoPaymentCard";
import InfoChangeCard from "./component/InfoChangeCard";
import InfoOtherCard from "./component/InfoOtherCard";
import InfoTestResultCard from "./component/InfoTestResultCard";

const ProfileCustomer = () => {
  const { TabPane } = Tabs;

  return (
    <div className="page-no-scroll">
      <div className="row">
        <div className="col-md-3 col-12">
          <Card className="info-profile-left">
            <div className="row">
              <div className="col-12 d-flex align-items-center justify-content-center">
                <Avatar size={120} src={<img src="/images/user2.jpg" />} />
              </div>
            </div>
            <div className="row pt-5">
              <div className="col-2">
                <UserOutlined />
              </div>
              <div className="col-10  d-flex ">Nguyễn Lâm Thảo Tâm</div>
            </div>
            <div className="row pt-4">
              <div className="col-2">
                <DeploymentUnitOutlined />
              </div>
              <div className="col-10  d-flex ">Học viên</div>
            </div>
            <div className="row pt-4">
              <div className="col-2">
                <WhatsAppOutlined />
              </div>
              <div className="col-10  d-flex ">0978111222</div>
            </div>
            <div className="row pt-4">
              <div className="col-2">
                <MailOutlined />
              </div>
              <div className="col-10  d-flex ">kimjisoo@gmail.com</div>
            </div>
            <div className="row pt-4">
              <div className="col-2">
                <AimOutlined />
              </div>
              <div className="col-10  d-flex ">Seoul, Korea</div>
            </div>
          </Card>
        </div>
        <div className="col-md-9 col-12">
          <Card className="space-top-card">
            <Tabs type="card">
              <TabPane tab="Test Info" key="2" className="profile-tabs">
                <InfoTestCard />
              </TabPane>
              <TabPane tab="Course Joined" key="3" className="profile-tabs">
                <InfoCourseCard />
              </TabPane>
              <TabPane tab="Payment History" key="4" className="profile-tabs">
                <InfoPaymentCard />
              </TabPane>
              <TabPane tab="Change History" key="5" className="profile-tabs">
                <InfoChangeCard />
              </TabPane>
              <TabPane tab="Test result" key="6" className="profile-tabs">
                <InfoTestResultCard />
              </TabPane>
              <TabPane tab="Other" key="7" className="profile-tabs">
                <InfoOtherCard />
              </TabPane>
            </Tabs>
          </Card>
        </div>
      </div>
      <div></div>
    </div>
  );
};

export default ProfileCustomer;
