import { t } from "i18next";
import { TbCalendarEvent, TbFileSpreadsheet, TbSquare5Filled, TbUserCheck } from "react-icons/tb";
import { NavLink } from "react-router-dom";

export default function FancyNavbar() {
  const menuLinkClass = (isActive: boolean) => {
    return `rounded-full px-4 w-fit text-2xl roboto uppercase link flex items-center justify-center gap-2 ${
      isActive ? "text-slate-200 !bg-left" : "text-gray-400 bg-bgLght !bg-right"
    }`;
  };

  return (
    <>
    <div className="flex w-4/5 text-xl flex-wrap gap-4 lg:w-fit lg:flex-row lg:flex-nowrap mt-8 items-center justify-center">
      <NavLink to="grades" className={({ isActive }) => menuLinkClass(isActive)}>
        <TbSquare5Filled />
        {t("registerGrades")}
      </NavLink>
      <div className="xl:block hidden w-1 rounded-xl h-8 bg-bgLght" />
      <NavLink to="attendance" className={({ isActive }) => menuLinkClass(isActive)}>
        <TbUserCheck />
        {t("registerAttendance")}
      </NavLink>
      <div className=" xl:block hidden w-1 rounded-xl h-8 bg-bgLght" />
      <NavLink to="homework" className={({ isActive }) => menuLinkClass(isActive)}>
        <TbFileSpreadsheet />
        {t("registerHomework")}
      </NavLink>
      <div className=" xl:block hidden w-1 rounded-xl h-8 bg-bgLght" />
      <NavLink to="exams" className={({ isActive }) => menuLinkClass(isActive)}>
        <TbCalendarEvent />
        {t("registerExams")}
      </NavLink>
    </div>
    {window.location.pathname === "/class-register" && (<h2 className="text-4xl roboto text-gray-400 uppercase mt-20 text-center">{t("registerNoTab")}</h2>)}
    </>
  );
}
