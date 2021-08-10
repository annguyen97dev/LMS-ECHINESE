import React, { useEffect, useState } from "react";
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
import { studentApi } from "~/apiBase";
import { useWrap } from "~/context/wrap";

const ProfileCustomer = (props) => {
  const id = props.id;
  const { showNoti } = useWrap();
  const { TabPane } = Tabs;
  const [isLoading, setIsLoading] = useState({
    type: null,
    status: false,
  })
  const [info, setInfo] = useState<IStudent[]>([]);

  const getInfoCustomer = async () => {
    setIsLoading({
      type: "GET_INFO",
      status: true
    })
    try {
      let res = await studentApi.getWithID(id);
      res.status == 200 && setInfo(res.data.data);
    } catch (error) {
      showNoti("danger", error.message);
    } finally {
      setIsLoading({
        type: "GET_INFO",
        status: false
      })
    }
  }

  useEffect(() => {
    getInfoCustomer();
  }, []);

  return (
    <div className="page-no-scroll">
      <div className="row">
        <div className="col-md-3 col-12">
          <Card className="info-profile-left">
            <div className="row">
              <div className="col-12 d-flex align-items-center justify-content-center">
                <Avatar size={120} src={<img src={info?.Avatar} />} />
              </div>
            </div>
            <div className="row pt-5">
              <div className="col-2">
                <UserOutlined />
              </div>
              <div className="col-10  d-flex ">{info?.FullNameUnicode}</div>
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
              <div className="col-10  d-flex ">{info?.Mobile}</div>
            </div>
            <div className="row pt-4">
              <div className="col-2">
                <MailOutlined />
              </div>
              <div className="col-10  d-flex ">{info?.Email}</div>
            </div>
            <div className="row pt-4">
              <div className="col-2">
                <AimOutlined />
              </div>
              <div className="col-10  d-flex ">{info?.Address}</div>
            </div>
          </Card>
        </div>
        <div className="col-md-9 col-12">
          <Card className="space-top-card">
            <Tabs type="card">
              <TabPane tab="Test Info" key="2" className="profile-tabs">
                <InfoTestCard id={id}/>
              </TabPane>
              <TabPane tab="Course Joined" key="3" className="profile-tabs">
                <InfoCourseCard id={id} />
              </TabPane>
              <TabPane tab="Payment History" key="4" className="profile-tabs">
                <InfoPaymentCard id={id}/>
              </TabPane>
              <TabPane tab="Change History" key="5" className="profile-tabs">
                <InfoChangeCard />
              </TabPane>
              <TabPane tab="Test result" key="6" className="profile-tabs">
                <InfoTestResultCard id={id}/>
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
