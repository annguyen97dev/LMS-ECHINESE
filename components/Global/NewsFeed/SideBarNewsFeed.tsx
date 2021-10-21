import { Card, Drawer, Input, Select } from "antd";
import Link from "next/link";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { MoreHorizontal } from "react-feather";
import { packageApi, packageStudentApi } from "~/apiBase";
import { useWrap } from "~/context/wrap";
import { optionCommonPropTypes } from "~/utils/proptypes";
import TopPackageNewsFeed from "./TopPackageNewsFeed";
const { Search } = Input;
const { Option } = Select;

SideBarNewsFeed.propTypes = {
  optionList: PropTypes.shape({
    teamOptionList: optionCommonPropTypes,
    groupOptionList: optionCommonPropTypes,
  }),
  filtersData: PropTypes.shape({
    name: PropTypes.string,
    idTeam: PropTypes.number,
    idGroup: PropTypes.number,
  }),
  handleFilters: PropTypes.func,
  groupFormComponent: PropTypes.element,
};
SideBarNewsFeed.defaultProps = {
  optionList: {
    teamOptionList: [],
    groupOptionList: [],
  },
  filtersData: {
    name: "",
    idTeam: 0,
    idGroup: 0,
  },
  handleFilters: null,
  groupFormComponent: null,
};

function SideBarNewsFeed(props) {
  const { optionList, filtersData, handleFilters, groupFormComponent } = props;
  const { name, idTeam, idGroup } = filtersData;
  const { teamOptionList, groupOptionList } = optionList;
  const [visible, setVisible] = useState(false);
  const [isLoading, setIsLoading] = useState({
    type: "",
    status: false,
  });
  const { showNoti, userInformation } = useWrap();
  // PACKAGE TOP LIST
  const [topPackageList, setTopPackageList] = useState<IPackage[]>([]);

  const showSideBar = () => {
    setVisible(true);
  };
  const closeSideBar = () => {
    setVisible(false);
  };
  const checkHandleFilters = (field: string, value: string | number) => {
    if (!handleFilters) return;
    handleFilters(field, value);
  };
  const checkHandleFiltersMobile = (field: string, value: string | number) => {
    if (!handleFilters) return;
    handleFilters(field, value);
    closeSideBar();
  };

  // PACKAGE
  const fetchTopPackageList = async () => {
    try {
      if (userInformation?.RoleID !== 3) return;
      const res = await packageApi.getAll({ Type: 2 });
      if (res.status === 200) {
        setTopPackageList(res.data.data);
      }
    } catch (error) {
      console.log("fetchTopPackageList", error.message);
    }
  };

  useEffect(() => {
    fetchTopPackageList();
  }, [userInformation]);

  const onBuyPackage = async (data: {
    ID: number;
    Price: string;
    PaymentMethodsID: number;
    Note: string;
  }) => {
    setIsLoading({
      type: "ADD_DATA",
      status: true,
    });
    try {
      const { ID, Price, PaymentMethodsID, Note } = data;
      const newPackageStudent = {
        StudentID: userInformation.UserInformationID,
        SetPackageID: ID,
        Paid: parseInt(Price.toString().replace(/\D/g, "")),
        PaymentMethodsID,
        Note,
      };
      const res = await packageStudentApi.add(newPackageStudent);
      if (res.status === 200) {
        showNoti("success", res.data.message);
        fetchTopPackageList();
      }
      return res;
    } catch (error) {
      showNoti("danger", error.message);
    } finally {
      setIsLoading({
        type: "ADD_DATA",
        status: false,
      });
    }
  };

  const SideBar = () => (
    <>
      <Card className="card-newsfeed" bordered={false}>
        <p className="card-newsfeed__label font-weight-black">TÌM KIẾM</p>
        <Search
          className="style-input"
          placeholder="Nhập từ khóa"
          allowClear
          onSearch={(value) => checkHandleFilters("name", value)}
        />
      </Card>
      {/* PACKAGE ONLY STUDENT */}
      {userInformation?.RoleID === 3 && (
        <Card className="card-newsfeed" bordered={false}>
          <div className="card-newsfeed__label font-weight-black d-flex justify-content-between">
            BỘ ĐỀ CAO CẤP
            <Link href="/package/package-store?type=2">
              <a className="label-nf font-weight-black">Xem thêm</a>
            </Link>
          </div>
          <TopPackageNewsFeed
            isLoading={isLoading}
            topPackageList={topPackageList}
            handleBuyPackage={onBuyPackage}
          />
        </Card>
      )}
      <Card className="card-newsfeed" bordered={false}>
        <div className="card-newsfeed-wrap__label">
          <p className="card-newsfeed__label font-weight-black">Trung tâm</p>
        </div>
        <Select
          value={idTeam}
          className="style-input list-group-nf__mobile"
          placeholder="Chọn trung tâm"
          onChange={(value) => checkHandleFiltersMobile("idTeam", value)}
        >
          {teamOptionList.map((item, index) => (
            <Option key={index} value={item.value}>
              {item.title}
            </Option>
          ))}
        </Select>
        <ul className="list-group-nf">
          {teamOptionList.map((item, index) => (
            <li
              key={index}
              className={idTeam === item.value ? "active" : ""}
              onClick={() => checkHandleFilters("idTeam", item.value)}
            >
              {item.title}
            </li>
          ))}
        </ul>
        {/* CHIA CÁCH BÌNH YÊN */}
        <div className="card-newsfeed-wrap__label">
          <p className="card-newsfeed__label have-plus font-weight-black">
            Nhóm
          </p>
          {groupFormComponent}
        </div>
        <Select
          value={idGroup}
          className="style-input list-group-nf__mobile mb-0"
          placeholder="Chọn nhóm"
          onChange={(value) => checkHandleFiltersMobile("idGroup", value)}
        >
          {groupOptionList.map((item, index) => (
            <Option key={index} value={item.value}>
              {item.title}
            </Option>
          ))}
        </Select>
        <ul className="list-group-nf mb-0">
          {groupOptionList.map((item, index) => (
            <li
              key={index}
              className={idGroup === item.value ? "active" : ""}
              onClick={() => checkHandleFilters("idGroup", item.value)}
            >
              {item.title}
            </li>
          ))}
        </ul>
      </Card>
    </>
  );
  return (
    <>
      <div className="sidebar-desktop">{SideBar()}</div>
      <div className="sidebar-mobile">
        <Link href="/newsfeed">
          <a className="label-nf font-weight-black">NewsFeed</a>
        </Link>
        <button className="btn btn-light" onClick={showSideBar}>
          <MoreHorizontal />
        </button>
        <Drawer
          placement="right"
          closable={false}
          onClose={closeSideBar}
          visible={visible}
          className="drawer-newsfeed"
        >
          {SideBar()}
        </Drawer>
      </div>
    </>
  );
}

export default SideBarNewsFeed;
