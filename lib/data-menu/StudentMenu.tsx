import React, { Fragment } from "react";
import {
  Home,
  Airplay,
  User,
  Package,
  Book,
  UserCheck,
  Tool,
  FileText,
} from "react-feather";

export const StudentParentMenu = [
  //   {
  //     TabName: "tab-home",
  //     Icon: <Home />,
  //   },
  //   {
  //     TabName: "tab-course",
  //     Icon: <Airplay />,
  //   },
  //   {
  //     TabName: "tab-exercise",
  //     Icon: <FileText />,
  //   },
  //   {
  //     TabName: "tab-student",
  //     Icon: <User />,
  //   },
  //   {
  //     TabName: "tab-staff",
  //     Icon: <UserCheck />,
  //   },
  {
    TabName: "tab-package",
    Icon: <Package />,
  },
];

export const StudentChildMenu = [
  {
    MenuName: "tab-package",
    MenuTitle: "Bộ đề thi",
    MenuKey: "/package",
    MenuItem: [
      {
        ItemType: "single",
        Key: "/package/package-student",
        Route: "/package/package-student",
        Text: "Danh sách bộ đề",
        Icon: "",
      },

      {
        ItemType: "single",
        Key: "/package/package-store",
        Route: "/package/package-store",
        Text: "Cửa hàng",
        Icon: "",
      },
    ],
  },
];
