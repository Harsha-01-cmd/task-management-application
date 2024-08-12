import React, { useEffect } from "react";
import { FaHeart } from "react-icons/fa";
import { TiTick } from "react-icons/ti";
import { MdOutlineAdsClick } from "react-icons/md";
import { TiThSmall } from "react-icons/ti";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authActions } from "../../store/auth";
import axios from "axios";

const Sidebar = () => {
  const dispatch = useDispatch();
  const data = [
    {
      title: "All Tasks",
      icons: <TiThSmall />,
      link: "/"
    },
    {
      title: "Important Tasks",
      icons: <FaHeart />,
      link: "/imp-tasks"
    },
    {
      title: "Completed Tasks",
      icons: <TiTick />,
      link: "/comp-tasks"
    },
    {
      title: "Remaining Tasks",
      icons: <MdOutlineAdsClick />,
      link: "/rem-tasks"
    },
  ];

  const logout = async () => {
    dispatch(authActions.logout());
    localStorage.clear("id");
    localStorage.clear("token");
  }

  const headers = { authorization: `Bearer ${localStorage.getItem("token")}` };

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await axios.get("http://localhost:1000/api/v1/get-all-tasks", { headers });
        console.log(response);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    }
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="flex flex-col h-[90vh] items-center justify-between">
      <div className="flex flex-col items-center">
        <div className="mt-5 mb-2 text-xl font-bold">Dev: Harsha Rashmi</div>
        <div className="mb-3 text-gray-400">sinhaharsha2805@gmail.com</div>
        <hr />
        <div className="flex flex-col">
          {data.map((item, i) => (
            <Link to={item.link} key={i} className="my-2 gap-2 flex items-center hover:bg-zinc-900 p-2">
              {item.icons} {item.title}
            </Link>
          ))}
        </div>
      </div>
      <div>
        <button onClick={logout} className="bg-gray-600 w-full px-3 py-1 border border-none rounded">
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
