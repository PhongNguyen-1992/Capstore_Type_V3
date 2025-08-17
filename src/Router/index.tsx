import { Alert, Flex, Spin } from "antd";
import {
  lazy,
  Suspense,  
  type FC,
  type LazyExoticComponent,
} from "react";
import { type RouteObject } from "react-router-dom";



// Lazy load các trang
const Homepage = lazy(() => import("../Page/HomeTemplete/index"));
const Login = lazy(() => import("../Page/AuthTemplete/Login"));
const Auth = lazy(() => import("../Page/AuthTemplete"));
const MovieDetail = lazy(() => import("../Page/HomeTemplete/Movie/detail"));

// HOC để wrap Suspense
const withSuspense = (Component: LazyExoticComponent<FC>) => {
  return (
    <Suspense
      fallback={
        <div
          style={{
            position: "fixed",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0,0,0,0.85)",
            zIndex: 9999,
          }}
        >
          <Flex vertical align="center" justify="center" gap="large">
            <Spin tip="Loading..." size="large" />
            <Alert
              message="Chào Mừng Bạn Đến Với PandaMovie"
              description="Chúng tôi đang tải dữ liệu, vui lòng chờ một chút"
              type="info"
              showIcon
            />
          </Flex>
        </div>
      }
    >
      <Component />
    </Suspense>
  );
};

export const router: RouteObject[] = [
  {
    path: "/",
    element: withSuspense(Homepage),
  },
  {
    path: "movie-detail/:movieID",
    element: withSuspense(MovieDetail),
  },
  {
    path: "/auth",
    element: withSuspense(Auth),
    children: [{ path: "login", element: withSuspense(Login) }],
  },
];
