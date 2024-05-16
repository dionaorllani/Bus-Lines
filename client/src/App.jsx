import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import Style
import './index.css';

// Pages imports
import Home from './pages/Home'
import Lines from './pages/Lines'
import Profile from './pages/Profile'
import Admin from './pages/Admin'
import Login from './pages/LogIn'
import CityList from './pages/admin/city/CityList'
import CityCreate from './pages/admin/city/CityCreate'
import EditCity from './pages/admin/city/EditCity'
import ScheduleList from './pages/admin/schedule/ScheduleList'
import EditSchedule from './pages/admin/schedule/EditSchedule';
import ScheduleCreate from './pages/admin/schedule/ScheduleCreate';
import LineList from './pages/admin/line/LineList'
import LineCreate from './pages/admin/line/LineCreate'
import EditLine from './pages/admin/line/EditLine'
import StopList from './pages/admin/stop/StopList'
import EditStop from './pages/admin/stop/StopEdit'
import StopCreate from './pages/admin/stop/StopCreate'
import UserList from './pages/admin/user/UserList'
import EditUser from './pages/admin/user/EditUser'
import UserCreate from './pages/admin/user/UserCreate'
import OperatorList from './pages/admin/operator/OperatorList'
import EditOperator from './pages/admin/operator/EditOperator'   
import OperatorCreate from './pages/admin/operator/OperatorCreate'
import TicketList from './pages/admin/ticket/TicketList'
import TicketEdit from './pages/admin/ticket/TicketEdit'




const App = () => {

  return (
    <>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/lines" element={<Lines />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/authentication" element={<Login />} />
            <Route path="/admin/cities/" element={<CityList />} />
            <Route path="/admin/cities/addCity" element={<CityCreate />} />
            <Route path="/admin/cities/:id/edit" element={<EditCity />} />
            <Route path="/admin/schedules/" element={<ScheduleList />} />
            <Route path="/admin/schedules/addSchedule" element={<ScheduleCreate />} />
            <Route path="/admin/schedules/:id/edit" element={<EditSchedule />} />
            <Route path="/admin/lines/" element={<LineList />} />
            <Route path="/admin/lines/addLine" element={<LineCreate />} />
            <Route path="/admin/lines/:id/edit" element={<EditLine />} />
            <Route path="/admin/stops/" element={<StopList />} />
            <Route path="/admin/stops/:id/edit" element={<EditStop />} />
            <Route path="/admin/stops/addStop" element={<StopCreate />} />
            <Route path="/admin/users/" element={<UserList />} />
            <Route path="/admin/users/:id/edit" element={<EditUser />} />
            <Route path="/admin/users/addUser" element={<UserCreate />} />
            <Route path="/admin/operators/" element={<OperatorList />} />
            <Route path="/admin/operators/:id/edit" element={<EditOperator />} />
            <Route path="/admin/operators/addOperator" element={<OperatorCreate />} />
            <Route path="/admin/tickets/" element={<TicketList />} />
            <Route path="/admin/tickets/:id/edit" element={<TicketEdit />} />
          </Routes>
        </Router>
    </>
  );
};

export default App;

