import React, { useState } from "react";
import { Button, Layout, Menu, theme } from "antd";
import {
  ChevronsLeft,
  ChevronsRight,
  Contact,
  Film,
  Users,
  Warehouse,
} from "lucide-react";
// import Layout Content
import {
  UsersManagement,
  ProfileManagement,
  FilmsManagement,
  CinemasManagement,
} from "./Content/_index";

const { Sider, Content } = Layout;


const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [selectedKey, setSelectedKey] = useState("1");
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={260} // rộng khi mở
        collapsedWidth={120} // rộng khi đóng
      >
        {/* Tiêu Đề */}

        <div className="text-center font-bold uppercase leading-tight">
          <div className="text-xl bg-gradient-to-r from-[#ff9a9e] via-[#fbc2eb] to-[#c2e9fb] bg-clip-text text-transparent drop-shadow-md p-4">
            PANDA{" "}
            <span className="text-xl bg-gradient-to-r from-[#ff512f] via-[#dd2476] to-[#ff512f] bg-clip-text text-transparent drop-shadow">
              CINEMA
            </span>
          </div>
        </div>

        {/* Menu chính */}
        <Menu
          selectedKeys={[selectedKey]}
          onClick={(e) => setSelectedKey(e.key)}
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={[
            { key: "1", icon: <Contact />, label: "Profile" },
            {
              key: "2",
              icon: <Users />,
              label: "Users Management",
            },
            {
              key: "3",
              icon: <Film />,
              label: "Films Management",
            },
            {
              key: "4",
              icon: <Warehouse />,
              label: "Cinemas Management",
            },
          ]}
        />

        {/* Nút toggle ở dưới */}
        <div
          style={{
            position: "absolute",
            bottom: "100px",
            width: "100%",
            textAlign: "center",
          }}
        >
          <Button
            type="primary"
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "12px",
            }}
          >
            {collapsed ? <ChevronsRight /> : <ChevronsLeft />}
          </Button>
        </div>
      </Sider>

      <Layout>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {selectedKey === "1" && <ProfileManagement />}
          {selectedKey === "2" && <UsersManagement />}
          {selectedKey === "3" && <FilmsManagement />}
          {selectedKey === "4" && <CinemasManagement />}
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
