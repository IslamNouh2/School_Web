'use client'
import Announcement from "@/components/announcement"
import AttendanceCharts from "@/components/AttendanceCharts"
import CountChart from "@/components/CountChart"
import EventCalendar from "@/components/EventCalendar"
import FinanceChart from "@/components/FinanceChart"
import UserCard from "@/components/UserCard"
import api from "@/utils/api"
import axios from "axios";
import { useEffect, useState } from "react"

const AdminPage = () => {
  const [studentCount, setStudentCount] = useState(0);
  const [teacherCount, setTeacherCount] = useState(0);
  const [parentCount, setParentCount] = useState(0);
  const [staffCount, setStaffCount] = useState(0);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const res = await api.get("/student/count" , { withCredentials: true }); // make sure baseURL is set or use full URL
        setStudentCount(res.data.total);
        setTeacherCount(25);
        setParentCount(90);
        setStaffCount(15);

        
      } catch (err) {
        console.error("Failed to fetch counts", err);
      }
    };
    fetchCounts();
  }, []);


  return (
    <div className="p-4 h-full">
      {/* USER CARD */}
      <div className="p-4">
        <div className="flex gap-4 justify-between flex-wrap">
          <UserCard type="Student" count={studentCount} />
          <UserCard type="Teacher" count={teacherCount} />
          <UserCard type="Parent" count={parentCount} />
          <UserCard type="Staff" count={staffCount} />
        </div>
      </div>
      <div className='p-4 flex gap-4 flex-col md:flex-row'>
        {/* Left Parte */}
        <div className="w-full lg:w-2/3 flex flex-col gap-8">

          {/*Top Charts*/}
          <div className="flex gap-4 flex-col lg:flex-row">
            {/* Count Chart */}
            <div className="w-full lg:w-1/3 h-[450px] ">
              <CountChart />
            </div>
            {/* Attendance Chart */}
            <div className="w-full lg:w-2/3 h-[450px] ">
              <AttendanceCharts />
            </div>
          </div>

          {/* Bottom Chart */}
          <div className="w-full h-[500px]">
            <FinanceChart/>
          </div>

        </div>

        {/* Right Parte */}
        <div className="w-full lg:w-1/3 flex flex-col gap-8">
          <div>
            <EventCalendar/>
          </div>
          <div>
            <Announcement/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminPage