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

  // largura da sidebar (px ou vw)
  const expandedWidth = "20vw";
  const collapsedWidth = 80; // px

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
      onClick: () => navigate("/recompensas"),
    },
  ];

  // define o valor real usado no margin e no calc()
  const siderWidth = collapsed ? `${collapsedWidth}px` : expandedWidth;

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* sidebar fixa */}
      <Sider
        collapsible
        trigger={null}
        collapsed={collapsed}
        onCollapse={setCollapsed}
        width={collapsedWidth}
        collapsedWidth={collapsedWidth}
        style={{
          width: siderWidth,
          background: "#200000",
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
        }}
      >
        {/* logo */}
        <div
          style={{ height: 64, display: "flex", alignItems: "center", justifyContent: "center" }}
          onClick={() => setCollapsed(!collapsed)}
        >
          <img
            src="./logo.png"
            alt="Logo"
            style={{
              height: 40,
              transition: "transform .3s",
              transform: collapsed ? "rotate(180deg)" : "none",
            }}
          />
        </div>

        {/* menu */}
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[pathname]}
          items={items}
          style={{
            background: "transparent",
            border: "none",
            marginTop: 16,
          }}
        />

        {/* avatar + botao */}
        <div
          style={{
            position: "absolute",
            bottom: 16,
            width: "100%",
            textAlign: "center",
          }}
        >
          <Avatar style={{ backgroundColor: "#D9D9D9", marginBottom: 8 }}>AM</Avatar>
          {!collapsed && <Text style={{ color: "#fff" }}>Arthur Morgan</Text>}
          <Button
            icon={<LogoutOutlined />}
            danger
            style={{ marginTop: 8, width: "80%", maxWidth: 160 }}
            onClick={() => {/* logout */}}
          >
            {!collapsed && "Sair"}
          </Button>
        </div>
      </Sider>

      {/* layout de conteúdo, empurrado para a direita */}
      <Layout
        style={{
          marginLeft: siderWidth,
          width: `calc(100% - ${siderWidth})`,
          minHeight: "100vh",
        }}
      >
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            background: "#fff",
            minHeight: "calc(100vh - 48px)", // 48px = top+bottom margins
          }}
        >
          {/* aqui entram todas as suas páginas (Home, Gameplay, Recompensas, etc.) */}
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
