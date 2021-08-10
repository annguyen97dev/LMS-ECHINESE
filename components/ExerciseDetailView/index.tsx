import TitlePage from "../Elements/TitlePage";
import { Card } from "antd";
import Editor from "../Elements/Editor";
import { Comment, Tooltip, Avatar, Rate } from "antd";

const ExerciseDoneView = (props) => {
  return (
    <>
      <TitlePage title={props.TitlePage} />
      <div className="row exercise-done-view">
        <div className="col-md-8 col-12">
          <Card title="Question">
            <p>Bài tập trong thời gian nghỉ:</p>
            <p>
              Paraphrase các câu sau (thử nhiều cách nhé, ít nhất hai cách):
            </p>
            <p>1. There will be a few changes in the office.</p>
            <p>1. There will be a few changes in the office.</p>
            <p>
              3. He seems very well-educated, however, he is not very bright.
            </p>
            <p>4. He drank a cup of tea. He felt dizzy afterwards.</p>
            <p>5. She loves watching rom-com. Her brother loves it, too.</p>
            <p>6. He said that it was Mary who had stolen the money.</p>
          </Card>
          <Card title="Answer" className="mt-3">
            <p>1. There will be a few changes in the office.</p>
            <ul>
              <li>There will be a number of changes in the workplace. Good</li>
              <li>
                People said that there will be a number of modifications within
                the workplace. <b>Okay, people said that thì hơi thừa nhé.</b>
              </li>
            </ul>
            <p>2. You weren't careful, so you made many mistakes.</p>
            <ul>
              <li>You made many mistakes because you weren't careful. okay</li>
              <li>You weren't cautious, so you made many errors. Good</li>
            </ul>
            <p>
              3. He seems very well-educated, however, he is not very bright.
            </p>
            <ul>
              <li>
                <b>Although he seems very well-educated,</b> he is not very
                shining. Bright mang nét nghĩa là thông minh, còn shining thì
                không nhé
              </li>
              <li>
                He seems very well-educated, however, he isn't always very
                brilliant. <b>good</b>
              </li>
            </ul>
            <p>4. He drank a cup of tea. He felt dizzy afterwards.</p>
            <ul>
              <li>He felt dizzy because of drinking a cup of tea. </li>
              <li>
                <b>
                  He felt dizzy/light-headed after having drunk a cup of tea.
                </b>
              </li>
            </ul>
          </Card>
          <Card title="Comment" className="mt-3">
            <Editor />
          </Card>
        </div>
        <div className="col-md-4 col-12">
          <Card title="Infomation" className="box-information">
            <ul>
              <li>
                <b>Center:</b>
                ZIM - 1A - 1B Dân Chủ
              </li>
              <li>
                <b>Course:</b>
                AS-IELTS Intermediate
              </li>
              <li>
                <b>Opening:</b>
                14/01/2021
              </li>
              <li>
                <b>Full name:</b>
                Nguyễn Thị Thanh Trúc
              </li>
              <li>
                <b>Teacher:</b>
                Phan Văn Toán
              </li>
              <li>
                <b>Date:</b>
                04/03/2021 09:11
              </li>
            </ul>
            <hr className="space-between" />
            <p className="text-rating">
              <span className="text">Đánh giá</span>
              <Rate style={{ marginLeft: "20px" }} disabled defaultValue={2} />
            </p>
            <div className="box-btn">
              <button
                className="btn btn-success"
                style={{ marginRight: "10px" }}
              >
                Chấp nhận
              </button>
              <button className="btn btn-danger">Từ chối</button>
            </div>
          </Card>

          <Card className="mt-3 box-comment" title="Comments" extra="0 cmts">
            <Comment
              author={<a>Han Solo</a>}
              avatar={
                <Avatar
                  src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                  alt="Han Solo"
                />
              }
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
              author={<a>Han Solo</a>}
              avatar={
                <Avatar
                  src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                  alt="Han Solo"
                />
              }
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
              author={<a>Han Solo</a>}
              avatar={
                <Avatar
                  src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                  alt="Han Solo"
                />
              }
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
              author={<a>Han Solo</a>}
              avatar={
                <Avatar
                  src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                  alt="Han Solo"
                />
              }
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
              author={<a>Han Solo</a>}
              avatar={
                <Avatar
                  src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                  alt="Han Solo"
                />
              }
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
              author={<a>Han Solo</a>}
              avatar={
                <Avatar
                  src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                  alt="Han Solo"
                />
              }
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

          <Card className="mt-3 box-score" title="Scores">
            <h5>
              Overall: <span>0</span>
            </h5>
          </Card>
        </div>
      </div>
    </>
  );
};

export default ExerciseDoneView;
