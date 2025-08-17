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
const Auth = lazy(() => import("../Page/AuthTemplete"));
const MovieDetail = lazy(() => import("../Page/HomeTemplete/Movie/detail"));

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
