import { Card, Tooltip } from "antd";
import Button from "react-bootstrap/Button";

import { SearchOutlined } from "@ant-design/icons";

import TitlePage from "~/components/Elements/TitlePage";

import LayoutBase from "~/components/LayoutBase";

export default function Tables() {
  return (
    <div className="btn-page">
      <div className="row">
        <div className="col-12">
          <TitlePage title={"Button"} />
        </div>
      </div>
      <div className="row ">
        <div className="col-12">
          <Card title="Default Buttons" className="cardRadius list-button">
            <Button variant="primary">Primary</Button>{" "}
            <Button variant="secondary">Secondary</Button>{" "}
            <Button variant="success">Success</Button>{" "}
            <Button variant="warning">Warning</Button>{" "}
            <Button variant="danger">Danger</Button>{" "}
            <Button variant="info">Info</Button>{" "}
            <Button variant="light">Light</Button>{" "}
            <Button variant="dark">Dark</Button>{" "}
            <Button variant="link">Link</Button>
          </Card>
        </div>

        <div className="space-between"></div>

        <div className="col-12">
          <Card title="Button light style" className="cardRadius list-button">
            <Button variant="primary">Primary</Button>{" "}
            <Button variant="secondary" className="light">
              Secondary
            </Button>{" "}
            <Button variant="success" className="light">
              Success
            </Button>{" "}
            <Button variant="warning" className="light">
              Warning
            </Button>{" "}
            <Button variant="danger" className="light">
              Danger
            </Button>{" "}
            <Button variant="info" className="light">
              Info
            </Button>{" "}
            <Button variant="light" className="light">
              Light
            </Button>{" "}
            <Button variant="dark" className="light">
              Dark
            </Button>{" "}
            <Button variant="link" className="light">
              Link
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}

Tables.layout = LayoutBase;
