import React, { useEffect, useState } from "react";
import TitlePage from "~/components/Elements/TitlePage";
import Link from "next/link";
import { Card } from "antd";
import SortBox from "~/components/Elements/SortBox";
import SearchBox from "~/components/Elements/SearchBox";
import LayoutBase from "~/components/LayoutBase";
import { dataCategory, dataCourse } from "~/lib/course-buy";
import { Menu, Rate } from 'antd';

const { SubMenu } = Menu;


type dataCategory = [];
type dataCourse = [];

// submenu keys of first level
const rootSubmenuKeys = ['sub1', 'sub2', 'sub4'];

const CourseBuy = () => {
  const [showFilter, showFilterSet] = useState(false);
  const [cate, setCate] = useState();

  const funcShowFilter = () => {
    showFilter ? showFilterSet(false) : showFilterSet(true);
  };

  const handleChangeCate = (e) => {
    e.preventDefault();
    const selectElm = document.querySelector('.text-select');

    let id_cate = e.target.getAttribute("data-cate");
    selectElm.textContent = e.target.textContent;
    document.querySelector('.side-bar').classList.remove('active');
    setCate(id_cate);
  }

  const dropdownMenuMoblie = (e) => {
      e.preventDefault();
      e.target.parentElement.classList.toggle('active');
  }

  const [openKeys, setOpenKeys] = React.useState(['sub1']);

  const onOpenChange = keys => {
    const latestOpenKey = keys.find(key => openKeys.indexOf(key) === -1);
    if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };



  return (
    <div className="row course-buy">
      <div className="col-12">
        <TitlePage title="Mua bán khóa học" />
        <Card
            className="course-buy-wrap"
            title={
              <div className="extra-table">
                <SortBox />
                <SearchBox />
              </div>
            }
          >
            <div className="ant-card-body-list">
                {dataCourse?.map((item, index) => {
                    if(!cate) {
                        return (
                            <div className="wrap-buy" key={item.id}>
                                <div className="wrap-buy-content">
                                    <div className="buy-image">
                                        <Link href={{
                                            pathname: "/course/course-buy/detail/[slug]",
                                            query: { slug: item.course_slug }
                                        }}>
                                        <a><img src={item.course_image} alt="image-course-buy" /></a>
                                    </Link>
                                    </div>
                                <div className="buy-content">
                                    <h6 className="buy-title">
                                        <Link href={{
                                            pathname: "/course/course-buy/detail/[slug]",
                                            query: { slug: item.course_slug }
                                        }}>
                                            <a>{item.course_title}</a>
                                        </Link>
                                    </h6>
                                    <ul className="buy-list">
                                    <li className="price">
                                        Price: <span>{item.course_price}</span>
                                    </li>
                                    <li className="auth">
                                        Auth: <span>{item.course_auth}</span>
                                    </li>
                                    </ul>
                                    <p className="buy-des">{item.course_desc}</p>
                                    <div className="set-btn">
                                        <Link
                                        href={{
                                        //   pathname: "/package/package-set/type/[slug]",
                                        // query: { slug: 2 },
                                        }}
                                        >
                                        <a className="btn btn-warning">Buy now</a>
                                        </Link>
                                    </div>
                                </div>
                                </div>
                                <div className="tag-rate">
                                    <Rate allowHalf defaultValue={4.5} />
                                </div>
                            </div>
                        )
                    }
                    if(item.course_cate_id == cate) {
                        return (
                            <div className="wrap-buy" key={item.id}>
                                <div className="wrap-buy-content">
                                    <div className="buy-image">
                                        <Link href={{
                                            pathname: "/course/course-buy/detail/[slug]",
                                            query: { slug: item.course_slug }
                                        }}>
                                        <a><img src={item.course_image} alt="image-course-buy" /></a>
                                    </Link>
                                    </div>
                                <div className="buy-content">
                                    <h6 className="buy-title">
                                        <Link href={{
                                            pathname: "/course/course-buy/detail/[slug]",
                                            query: { slug: item.course_slug }
                                        }}>
                                            <a>{item.course_title}</a>
                                        </Link>
                                    </h6>
                                    <ul className="buy-list">
                                    <li className="price">
                                        Price: <span>{item.course_price}</span>
                                    </li>
                                    <li className="auth">
                                        Auth: <span>{item.course_auth}</span>
                                    </li>
                                    </ul>
                                    <p className="buy-des">{item.course_desc}</p>
                                    <div className="set-btn">
                                        <Link
                                        href={{
                                        //   pathname: "/package/package-set/type/[slug]",
                                        // query: { slug: 2 },
                                        }}
                                        >
                                        <a className="btn btn-warning">Buy now</a>
                                        </Link>
                                    </div>
                                </div>
                                </div>
                                <div className="tag-rate">
                                    <Rate allowHalf defaultValue={4.5} />
                                </div>
                            </div>
                        )
                    }
                })}
            </div>
        </Card>
        <div className="course-buy-sidebar" >
            <div className="side-bar ant-card-bordered">
                <div className="btn-dropdown-menu" onClick={dropdownMenuMoblie}>
                    <span className="text-select">Chọn khóa học</span>
                    <i className="ant-menu-submenu-arrow"></i>
                </div>
                <Menu
                
                mode="inline" 
                openKeys={openKeys} 
                onOpenChange={onOpenChange}
                defaultSelectedKeys={['all-course']} 
                defaultOpenKeys={['all-course']}
                >
                <Menu.Item
                    key="all-course"
                >
                    <a
                        data-cate=""
                        onClick={handleChangeCate}
                    >All Course</a>
                </Menu.Item>
                {dataCategory?.map((menu, index) => {
                    if(menu.CourseType != "sub-menu") {
                        return (
                            <Menu.Item
                                key={menu.CourseKey}
                            >
                                <a
                                    data-cate={menu.CourseID}
                                    onClick={handleChangeCate}
                                >{menu.CourseTitle}</a>
                            </Menu.Item>
                        )
                    } else {
                        return (
                            <SubMenu
                                key={menu.CourseKey}
                                title={menu.CourseTitle}
                            >
                                {menu?.CourseItems.map((subitem, indexSubitem) => (
                                    <Menu.Item
                                        key={subitem.Key}
                                    >
                                    <a
                                        data-cate={subitem.CourseID}
                                        onClick={handleChangeCate}
                                    >{subitem.TitleOption}</a>
                                    </Menu.Item>
                                ))}
                            </SubMenu>
                        )
                    }
                })}
            </Menu>
            </div>
        </div>
      </div>
    </div>
  );
};

CourseBuy.layout = LayoutBase;
export default CourseBuy;

