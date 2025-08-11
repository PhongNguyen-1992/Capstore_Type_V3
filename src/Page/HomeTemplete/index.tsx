import React from 'react'
import Banner from './Componnent/Banner'
import Headder from './Componnent/Headder'
import { Outlet } from 'react-router-dom'

export default function HomePage() {
  return (
    <div>
      <h1>Home Page</h1>
      <Headder/>
      <Banner/>
      <Outlet/>
    </div>
  )
}
