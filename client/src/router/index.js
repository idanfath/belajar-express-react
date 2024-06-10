import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from '../pages/home'
import Admin from '../pages/admin'
function Rute() {
    return (
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/admin" element={<Admin/>}/>
        </Routes>
    )
}

export default Rute
