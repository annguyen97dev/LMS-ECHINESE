import TitlePage from "~/components/TitlePage";
import { Card, Form, Select, Input, Table, Button } from "antd";
import TinyBox from "~/components/TinyMCE";
import { Comment, Tooltip, Avatar, Rate, Tag } from "antd";
import { dataService } from "../../../../lib/customer/dataCustomer";
import { Upload, Save, Info } from "react-feather";
import PowerTable from "~/components/PowerTable";

const InfoTestResultCard = () => {
  const columns = [
    {
      title: "Listening",
      dataIndex: "listening",
      render: (listening) => {
        return <span className="tag green">{listening}</span>;
      },
    },
    {
      title: "Reading",
      dataIndex: "reading",
      render: (reading) => {
        return <span className="tag green">{reading}</span>;
      },
    },
    {
      title: "Writing",
      dataIndex: "writing",
      render: (writing) => {
        return <span className="tag green">{writing}</span>;
      },
    },
    {
      title: "Speaking",
      dataIndex: "speaking",
      render: (speaking) => {
        return <span className="tag green">{speaking}</span>;
      },
    },
    {
      title: "Overall",
      dataIndex: "overall",
      render: (overall) => {
        return <span className="tag blue">{overall}</span>;
      },
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
                dataSource={dataService}
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
