import path from "path";
import React, {
  lazy,
  Suspense,
  type FC,
  type LazyExoticComponent,
} from "react";
import { Route, type RouteObject } from "react-router-dom";
const Homepage = lazy(() => import("../Page/HomeTemplete/index"));
const Login = lazy(() => import("../Page/AuthTemplete/Login/index"));
const Movie = lazy(() => import("../Page/HomeTemplete/Movie/listmovie"));
const TrangChu = lazy(() => import("../Page/HomeTemplete/TrangChu"));
const Auth = lazy(() => import("../Page/AuthTemplete"));
const Adminpage = lazy(() => import("../Page/AdminTemplate"));

const withSuspense = (Component: LazyExoticComponent<FC>) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Component />
    </Suspense>
  );
};
export const router: RouteObject[] = [
  {
    path: "/",
    element: withSuspense(Homepage),
    children: [
      { path: "Trang-Chu", element: withSuspense(TrangChu) },
      { path: "Movie", element: withSuspense(Movie) },
    ],
  },
  {
    path: "/auth",
    element: withSuspense(Auth),
    children: [{ path: "login", element: withSuspense(Login) }],
  },
  {
    path: "/admin",
    element: withSuspense(Adminpage),
  },
];
