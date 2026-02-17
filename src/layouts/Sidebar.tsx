import { Link, useLocation } from "react-router-dom";
import { BiBookOpen } from "react-icons/bi";
import { MdDashboard } from "react-icons/md";

export default function Sidebar() {
  const location = useLocation();

  const activeClass =
    "bg-green-200 text-hijau font-extrabold flex items-center rounded-xl p-4";

  const normalClass =
    "hover:text-hijau flex cursor-pointer items-center rounded-xl p-4 font-medium text-gray-600 hover:bg-green-200 hover:font-extrabold";

  return (
    <div className="flex min-h-screen w-90 flex-col bg-white p-10 shadow-lg">
      
      {/* Logo */}
      <div className="flex flex-col">
        <span className="font-poppins text-[48px] text-gray-900">
          Sedap <b className="text-hijau">.</b>
        </span>
        <span className="font-semibold text-gray-400">
          Modern Admin Dashboard
        </span>
      </div>

      {/* Menu */}
      <div className="mt-10 space-y-3">
        <Link
          to="/"
          className={
            location.pathname === "/" ? activeClass : normalClass
          }
        >
          <MdDashboard className="mr-4 text-xl" />
          Dashboard
        </Link>

        <Link
          to="/enrollments"
          className={
            location.pathname === "/enrollments"
              ? activeClass
              : normalClass
          }
        >
          <BiBookOpen className="mr-4 text-xl" />
          Enrollments
        </Link>
      </div>

      {/* Footer tetap */}
    </div>
  );
}
