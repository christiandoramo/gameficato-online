// frontend/src/components/layout/AuthenticatedLayout.tsx
import { Layout, Menu, Avatar, Button, Typography } from "antd";
import {
  PlayCircleOutlined,
  GiftOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
const { Sider, Content } = Layout;
const { Text } = Typography;

export default function AuthenticatedLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const items = [
    {
      key: "/",
      icon: <PlayCircleOutlined />,
      label: "Jogos",
      onClick: () => navigate("/"),
    },
    {
      key: "/recompensas",
      icon: <GiftOutlined />,
      label: "Recompensas",
      onClick: () => navigate("#"),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        trigger={null} // ← remove o trigger padrão
        collapsed={collapsed}
        onCollapse={setCollapsed}
        width={collapsed ? 80 : "20vw"} // veja abaixo, largura dinâmica
        collapsedWidth={80} // largura fixa ao colapsar
        breakpoint="md" // opcional: em telas < md, colapsa automaticamente
        style={{
          background: "#200000",
          height: "100vh", // ocupa 100% da altura da viewport
          position: "fixed", // fixa à esquerda
          left: 0,
          top: 0,
        }}
      >
        <div
          className="flex items-center justify-center cursor-pointer"
          style={{ height: 64, overflow: "hidden" }}
          onClick={() => setCollapsed(!collapsed)}
        >
          <img
            src="./logo.png"
            alt="Logo"
            style={{
              height: 40,
              transition: "transform .3s",
              transform: collapsed ? "rotate(180deg)" : "rotate(0deg)",
            }}
          />
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[pathname]}
          items={items}
          style={{
            background: "transparent",
            color: "#fff",
            border: "none",
          }}
        />

        <div
          style={{
            position: "absolute",
            bottom: 0,
            width: "100%",
            padding: 16,
            textAlign: "center",
          }}
        >
          <Avatar style={{ backgroundColor: "#D9D9D9", marginBottom: 8 }}>
            AM
          </Avatar>
          {!collapsed && <Text style={{ color: "#fff" }}>Arthur Morgan</Text>}
          <Button
            icon={<LogoutOutlined />}
            danger
            style={{ marginTop: 8, width: "100%" }}
            onClick={() => {
              /* logout */
            }}
          >
            {!collapsed && "Sair"}
          </Button>
        </div>
      </Sider>

      <Layout
        style={{
          marginLeft: collapsed ? 80 : "20vw", // ← desloca o conteúdo
          minHeight: "100vh",
        }}
      >
        <Content style={{ margin: "24px 16px 0", overflow: "auto" }}>
          <div style={{ padding: 24, background: "#fff", minHeight: 360 }}>
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
