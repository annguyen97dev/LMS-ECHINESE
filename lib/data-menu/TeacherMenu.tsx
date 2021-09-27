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

export const TeacheParentMenu = [
  {
    TabName: "tab-home",
    Icon: <Home />,
  },
  {
    TabName: "tab-course",
    Icon: <Airplay />,
  },
  {
    TabName: "tab-exercise",
    Icon: <FileText />,
  },
  {
    TabName: "tab-student",
    Icon: <User />,
  },
  {
    TabName: "tab-staff",
    Icon: <UserCheck />,
  },
];

export const TeacherChildMenu = [
  {
    MenuName: "tab-home",
    MenuTitle: "Dashboard",
    MenuKey: "/dashboard",
    MenuItem: [
      {
        TypeItem: "single",
        Key: "/dashboard",
        Route: "/dashboard",
        Icon: "",
        Text: "Trang chủ",
      },
      {
        TypeItem: "single",
        Key: "/newsfeed",
        Route: "/newsfeed",
        Icon: "",
        Text: "Tin tức",
      },
    ],
  },
];
