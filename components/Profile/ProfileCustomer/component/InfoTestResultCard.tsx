import React, { Fragment, useEffect, useState } from "react";
import { Card, Form, Select, Input, Table, Button } from "antd";
import TinyBox from "~/components/TinyMCE";
import { Comment, Tooltip, Avatar, Rate, Tag } from "antd";
import { dataService } from "../../../../lib/customer/dataCustomer";
import { Upload, Save, Info } from "react-feather";
import PowerTable from "~/components/PowerTable";
import { serviceCustomerExamResultApi } from "~/apiBase";
import { useWrap } from "~/context/wrap";

const InfoTestResultCard = (props) => {
	const [dataTable, setDataTable] = useState<IServiceCustomerExamResult[]>([]);
	const { showNoti } = useWrap();
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [isLoading, setIsLoading] = useState({
		type: "",
		status: false,
	});
	const [totalPage, setTotalPage] = useState(null);
	const [currentPage, setCurrentPage] = useState(1);

	let pageIndex = 1;

	// PARAMS API GETALL
	const listTodoApi = {
		pageSize: 10,
		pageIndex: pageIndex,
		sort: null,
		sortType: null,
		UserInformationID: props.id,
	};
	const [todoApi, setTodoApi] = useState(listTodoApi);

	// GET DATA TABLE
	const getDataTable = () => {
		setIsLoading({
		  type: "GET_ALL",
		  status: true,
		});
		(async () => {
		  try {
			let res = await serviceCustomerExamResultApi.getAll(todoApi);
			if (res.status == 204) {
				showNoti("danger", "Không có dữ liệu");
			}
			if(res.status == 200){
				setDataTable(res.data.data);
				setTotalPage(res.data.totalRow);
			}
		  } catch (error) {
			showNoti("danger", error.message);
		  } finally {
			setIsLoading({
			  type: "GET_ALL",
			  status: false,
			});
		  }
		})();
	};

	// PAGINATION
	const getPagination = (pageNumber: number) => {
		pageIndex = pageNumber;
		setCurrentPage(pageNumber);
		setTodoApi({
			...todoApi,
			pageIndex: pageIndex,
		});
	};

  const columns = [
    {
      title: "Listening",
      dataIndex: "ListeningPoint",
      render: (listening) => {
        return <span>{listening}</span>;
      },
    },
    {
      title: "Reading",
      dataIndex: "ReadingPoint",
      render: (reading) => {
        return <span>{reading}</span>;
      },
    },
    {
      title: "Writing",
      dataIndex: "WritingPoint",
      render: (writing) => {
        return <span>{writing}</span>;
      },
    },
    {
      title: "Speaking",
      dataIndex: "SpeakingPoint",
      render: (speaking) => {
        return <span>{speaking}</span>;
      },
    },
    {
      title: "Overall",
      dataIndex: "OverAll",
      render: (overall) => {
        // Làm tròn 
        let n = parseFloat(overall); 
        overall = Math.round(n * 10)/10;

        if(overall >= 8) {
          return <span className="tag green">{overall}</span>;
        }
        else if(overall >= 5) {
          return <span className="tag yellow">{overall}</span>;
        } else {
          return <span className="tag red">{overall}</span>;
        }
      }
    },
    {
      render: () => (
        <>
          <button className="btn btn-icon edit">
            <Tooltip title="Đăng ký thi IELTS tại BC hoặc IDP ">
              <Info />
            </Tooltip>
          </button>
          <button className="btn btn-icon">
            <Upload />
          </button>
          <button className="btn btn-icon exchange">
            <Save />
          </button>
        </>
      ),
    },
  ];
  const { Option } = Select;

  useEffect(() => {
    getDataTable();
  }, []);

  return (
    <>
      <div className="row">
        <div className="col-md-8 col-12">
          <div className="row">
            <div className="col-12">
              {/* <Card title="Kết quả bài thi">
                <div className="row">
              </Card> */}
              <PowerTable
                loading={isLoading}
                currentPage={currentPage}
                totalPage={totalPage && totalPage}
                getPagination={(pageNumber: number) => getPagination(pageNumber)}
                Extra={
                  <Form layout="vertical">
                    <div className="row">
                      <div className="col-6">
                        <Form.Item label="Ngày thi">
                          <Input className="style-input" type="date" />
                        </Form.Item>
                      </div>
                      <div className="col-6">
                        <Form.Item label="Tư vấn viên">
                          <Select
                            className="w-100 style-input"
                            defaultValue="1"
                          >
                            <Option value="1">
                              [ZIM - 20L5 Thái Hà] - A-IELTS Solo 3 levels,
                              19/10, 18:30-20:30
                            </Option>
                          </Select>
                        </Form.Item>
                      </div>
                    </div>
                  </Form>
                }
                noScroll
                pagination={false}
                columns={columns}
                dataSource={dataTable}
              />
            </div>
          </div>
          <div className="row mt-2">
            <div className="col-12">
              <Card title="Nhận xét giáo viên">
                <TinyBox />
              </Card>
            </div>
          </div>
        </div>
        <div className="col-md-4 col-12">
          <Card className="box-comment space-top-card" title="Nhận xét">
            <Comment
              author={<a>Kim Jisoo</a>}
              avatar={<Avatar src="/images/user2.jpg" alt="Han Solo" />}
              content={
                <p>
                  We supply a series of design principles, practical patterns
                  and high quality design resources (Sketch and Axure), to help
                  people create their product prototypes beautifully and
                  efficiently.
                </p>
              }
            />
            <Comment
              author={<a>Kim Jennie</a>}
              avatar={<Avatar src="/images/user.jpg" alt="Han Solo" />}
              content={
                <p>
                  We supply a series of design principles, practical patterns
                  and high quality design resources (Sketch and Axure), to help
                  people create their product prototypes beautifully and
                  efficiently.
                </p>
              }
            />{" "}
            <Comment
              author={<a>Rosé Park</a>}
              avatar={<Avatar src="/images/user2.jpg" alt="Han Solo" />}
              content={
                <p>
                  We supply a series of design principles, practical patterns
                  and high quality design resources (Sketch and Axure), to help
                  people create their product prototypes beautifully and
                  efficiently.
                </p>
              }
            />
            <Comment
              author={<a>Lalisa</a>}
              avatar={<Avatar src="/images/user.jpg" alt="Lalisa" />}
              content={
                <p>
                  We supply a series of design principles, practical patterns
                  and high quality design resources (Sketch and Axure), to help
                  people create their product prototypes beautifully and
                  efficiently.
                </p>
              }
            />
          </Card>
        </div>
      </div>
    </>
  );
};

export default InfoTestResultCard;
