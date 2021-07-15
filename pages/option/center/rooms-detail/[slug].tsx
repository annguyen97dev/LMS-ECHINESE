import React, { useEffect, useState } from "react";
import PowerTable from "~/components/PowerTable";
import { data } from "../../../../lib/option/dataOption";
import LayoutBase from "~/components/LayoutBase";
import { Tooltip } from "antd";
import RoomForm from "~/components/Global/Option/RoomForm";
import { RotateCcw } from "react-feather";
import SortBox from "~/components/Elements/SortBox";
import FilterColumn from "~/components/Tables/FilterColumn";
import router from "next/router";
import { roomApi } from "~/apiBase";
import { useWrap } from "~/context/wrap";
import DeleteItem from "~/components/Tables/DeleteItem";
import moment from "moment";
import Room from "~/components/Global/Room/Room";

let pageIndex = 1;

let listFieldSearch = {
  roomCode: "",
  roomName: "",
  pageIndex: 1,
};

const dataOption = [
  {
    dataSort: {
      sort: 1,
      sortType: false,
    },
    text: "Mã giảm dần",
  },
  {
    dataSort: {
      sort: 1,
      sortType: true,
    },
    text: "Mã tăng dần",
  },
  {
    dataSort: {
      sort: 2,
      sortType: false,
    },
    text: "Tên giảm dần",
  },
  {
    dataSort: {
      sort: 2,
      sortType: true,
    },
    text: "Tên tăng dần ",
  },
];

const RoomCenter = () => {
  return <Room />;
};

RoomCenter.layout = LayoutBase;

export default RoomCenter;
