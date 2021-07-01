import Link from "next/link";
import LayoutBase from "~/components/LayoutBase";
import TitlePage from "~/components/Elements/TitlePage";
import { Collapse, Rate } from 'antd';

const { Panel } = Collapse;

const CoureBuyDetail = () => {
    return (
        <div className="row course-buy-detail">
            <div className="col-12">
                <TitlePage title="Khóa học - Chi tiết" />
                <div className="course-buy-content">
                    <div className="wrap-content">
                        <div className="wrap-info-course">
                            <h1 className="title-page-detail">Ielts Course test 1</h1>
                            <div className="rating">
                                <span className="lb-text">Đánh giá: </span>
                                <Rate allowHalf defaultValue={4.5} />
                            </div>
                            <div className="auth">
                                <span className="lb-text">Giảng viên: </span>
                                <span className="auth-name">Tú Phạm</span>
                            </div>
                            <div className="time-update">
                                <span className="lb-text">Cập nhật: </span>
                                <span className="time-text">23/06/2021</span>
                            </div>
                        </div>
                        <div className="wrap-content-course">
                            <div className="main-content-course">Nội dung khóa học</div>
                            <ul className="maint-content-timeline">
                                <li><span className="lb-text">Thời lượng: </span></li>
                                <li>1 chương</li>
                                <li>8 bài học</li>
                                <li>0 phút</li>
                            </ul>
                            <div className="main-content-side">
                                <Collapse className="collapse-content" bordered={false} defaultActiveKey={['1']}>
                                    <Panel header="Mở đầu khóa học" key="1">
                                        <ul>
                                            <li>
                                                <span className="anticon">
                                                    <img src="/images/icons/play.svg" alt="icon" />
                                                </span>
                                                <span className="text">Bài video</span>
                                            </li>
                                            <li>
                                                <span className="anticon">
                                                    <img src="/images/icons/file.svg" alt="icon" />
                                                </span>
                                                <span className="text">Bài text</span>
                                            </li>
                                            <li>
                                                <span className="anticon">
                                                    <img src="/images/icons/information.svg" alt="icon" />
                                                </span>
                                                <span className="text">Câu hỏi 1</span>
                                            </li>
                                            <li>
                                                <span className="anticon">
                                                    <img src="/images/icons/presentation.svg" alt="icon" />
                                                </span>
                                                <span className="text">Bài thuyết trình</span>
                                            </li>
                                            <li>
                                                <span className="anticon"></span>
                                                <span className="text">Bài Meeting</span>
                                            </li>
                                            <li>
                                                <span className="anticon"></span>
                                                <span className="text">Tên bài mới</span>
                                            </li>
                                            <li>
                                                <span className="anticon"></span>
                                                <span className="text">Tên bài mới</span>
                                            </li>
                                            <li>
                                                <span className="anticon"></span>
                                                <span className="text">Tên bài mới</span>
                                            </li>
                                        </ul>
                                    </Panel>
                                </Collapse>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="course-buy-aside">
                    <div className="wrap-aside">
                        <div className="video">
                            <iframe src="https://www.youtube.com/embed/EiHIRt2P98w" title="YouTube video player"></iframe>
                        </div>
                        <div className="aside-info">
                            <div className="name-course">Ielts Course test 1</div>
                            <div className="rating">
                                <span className="lb-text">Đánh giá: </span>
                                <Rate allowHalf defaultValue={4.5} />
                            </div>
                            <div className="auth">
                                <span className="lb-text">Giảng viên: </span>
                                <span className="auth-name">Tú Phạm</span>
                            </div>
                            <div className="time-update">
                                <span className="lb-text">Cập nhật: </span>
                                <span className="time-text">23/06/2021</span>
                            </div>
                            <div className="price">
                                Price: <span>2,200,000 VNĐ</span>
                            </div>
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
                            <div className="course-incentive">
                                <ul>
                                    <li><span className="lb-text">Khóa học bao gồm</span></li>
                                    <li>
                                        <span className="anticon">
                                            <img src="/images/icons/check.svg" alt="icon" />
                                        </span>
                                        <span className="text">0 phút thời lượng</span>
                                    </li>
                                    <li>
                                        <span className="anticon">
                                            <img src="/images/icons/check.svg" alt="icon" />
                                        </span>
                                        <span className="text">8 bài giảng</span>
                                    </li>
                                    <li>
                                        <span className="anticon">
                                            <img src="/images/icons/check.svg" alt="icon" />
                                        </span>
                                        <span className="text">Hỗ trợ điện thoại, máy tính bảng và desktop</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

CoureBuyDetail.layout = LayoutBase;
export default CoureBuyDetail;