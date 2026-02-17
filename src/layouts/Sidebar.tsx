import { NavLink } from "react-router-dom";
import { MdDashboard } from "react-icons/md";
import { BiBookOpen } from "react-icons/bi";
import { FaUserGraduate } from "react-icons/fa";
import { FaBook } from "react-icons/fa";

export default function Sidebar() {
  return (
    <div className="flex min-h-screen w-[280px] flex-col bg-white p-8 shadow-lg">

      <div className="flex flex-col">
        <span className="font-poppins text-[30px]">
          AKADEMIK <b className="text-hijau">.</b>
        </span>
        <span className="text-gray-400 text-sm">
          POLITEKNIK CALTEX RIAU
        </span>
      </div>

      <div className="mt-10 space-y-2">

        <NavLink to="/" className="menu-link">
          <MdDashboard className="mr-3 text-lg" />
          Dashboard
        </NavLink>

        <NavLink to="/students" className="menu-link">
          <FaUserGraduate className="mr-3 text-lg" />
          Students
        </NavLink>

        <NavLink to="/courses" className="menu-link">
          <FaBook className="mr-3 text-lg" />
          Courses
        </NavLink>

        <NavLink to="/enrollments" className="menu-link">
          <BiBookOpen className="mr-3 text-lg" />
          Enrollments
        </NavLink>

      </div>
    </div>
  );
}
