
import React from 'react'
import { Outlet } from 'react-router-dom'

export default function AuthTemplete() {
  return (
    <div>
      <h1>AuthenTemplet</h1>
      <Outlet/>
    </div>
  )
}
