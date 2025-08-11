import path from "path";
import React, {
  lazy,
  Suspense,
  type FC,
  type LazyExoticComponent,
} from "react";
import { Route, type RouteObject } from "react-router-dom";
const Homepage = lazy(() => import("../Page/HomeTemplete/index"));
const Login = lazy(() => import("../Page/AuthTemplete/Login"));
const Movie = lazy(() => import("../Page/HomeTemplete/Movie/listmovie"));
const TrangChu = lazy(() => import("../Page/HomeTemplete/TrangChu"));

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
    element: withSuspense(Login),
  },
  {
    path: "/Home",
    element: withSuspense(Homepage),
    children: [
      { path: "Trang-Chu", element: withSuspense(TrangChu) },
      { path: "Movie", element: withSuspense(Movie) },
    ],
  },

  //   {
  //     path: "/auth",
  //     element: withSuspense(AuthTemplate),
  //     children: [
  //         // Chỉ định các route con cho AuthTemplate
  //         // auth/login, auth/register
  //       { path: "login", element: withSuspense(LoginPage) },
  //       { path: "register", element: withSuspense(ResgisterPage) },
  //     ],
  //   },
];
