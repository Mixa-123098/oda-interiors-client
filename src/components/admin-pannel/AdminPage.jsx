import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import useLang from "../../lib/useLang";
import { observer } from "mobx-react-lite";
import authStore from "../../store/authStore";
import Header from "../Header";
import PagesHeader from "../Pages/PagesHeader";
import CreateProject from "./CreateProject";
import UsersStatus from "./UsersStatus";
import ProjectsEdit from "./ProjectsEdit";
import LanguagesManager from "./LanguagesManager";
import InquiriesManager from "./InquiriesManager";
import Footer from "../Footer";
import CropModalForm from "./CropModalForm";
import ChangePasswordForm from "./ChangePasswordForm";
import MyAccount from "./MyAccount";
import { useTranslation } from "react-i18next";
import Loader from "../../loader/Loader";

const ALL_TABS = [
  {
    key: "inquiries",
    labelKey: "editPage.inquiries.tab",
    Component: InquiriesManager,
    roles: ["admin", "moderator"],
  },
  {
    key: "createProject",
    labelKey: "editPage.createNewProject.open_close",
    Component: CreateProject,
    roles: ["admin", "moderator"],
  },
  {
    key: "usersList",
    labelKey: "editPage.usersList.open_close",
    Component: UsersStatus,
    roles: ["admin"],
  },
  {
    key: "projectsEdit",
    labelKey: "editPage.editProject.open_close",
    Component: ProjectsEdit,
    roles: ["admin", "moderator"],
  },
  {
    key: "languages",
    labelKey: "editPage.languages.title",
    Component: LanguagesManager,
    roles: ["admin"],
  },
  {
    key: "myAccount",
    labelKey: "editPage.account.title",
    Component: MyAccount,
    roles: ["admin", "moderator"],
  },
  {
    key: "changePassword",
    labelKey: "editPage.changePassword.open_close",
    Component: ChangePasswordForm,
    roles: ["admin", "moderator"],
  },
];

const AdminPage = observer(() => {
  const { t } = useTranslation();

  const { isReady, mustChangePassword, user } = authStore;
  const role = user?.role;
  const hasPanelAccess = role === "admin" || role === "moderator";
  const navigate = useNavigate();
  const { lp } = useLang();

  const tabs = ALL_TABS.filter((tab) => tab.roles.includes(role)).map(
    (tab) => ({ ...tab, label: t(tab.labelKey) })
  );

  const [activeTab, setActiveTab] = useState(() => tabs[0]?.key);

  // Staff-only page: keep it (and its /uk/edit etc. copies) out of search.
  const noindex = (
    <Helmet>
      <meta name="robots" content="noindex" />
    </Helmet>
  );

  // Non-staff normally have nowhere to go in the admin panel — but if they
  // were just password-reset, they still need to land here long enough to
  // change it, so the redirect is held off until that's resolved.
  useEffect(() => {
    if (isReady && !hasPanelAccess && !mustChangePassword) {
      navigate(lp("/"));
    }
  }, [navigate, lp, isReady, hasPanelAccess, mustChangePassword]);

  if (!isReady) {
    return (
      <>
        {noindex}
        <Loader />
      </>
    );
  }

  if (mustChangePassword) {
    return (
      <>
        {noindex}
        <Header fontColor="#000000" invert="invert(0%)" rep={true} />
        <PagesHeader title={t("editPage.changePassword.title")} showTitle />
        <div className="container mt-5 mb-5">
          <p className="text-muted">{t("editPage.changePassword.forcedHint")}</p>
          <ChangePasswordForm
            onSuccess={() => {
              if (!hasPanelAccess) navigate(lp("/"));
            }}
          />
        </div>
        <Footer settings={{ color: "black", bgColor: "white", shadow: true }} />
      </>
    );
  }

  if (!hasPanelAccess) {
    return (
      <>
        {noindex}
        <Loader />
      </>
    );
  }

  // activeTab starts out undefined: the initial state is computed before the
  // user (and so the role-filtered tab list) has loaded. Highlight whichever
  // tab is actually shown, not just the state value.
  const currentTab = tabs.find((tab) => tab.key === activeTab) || tabs[0];
  const ActiveComponent = currentTab.Component;

  return (
    <>
      {noindex}
      <Header fontColor="#000000" invert="invert(0%)" rep={true} />
      <main>
        {/* Title hidden like on the public pages: the "Edit" nav item is
            highlighted and the mobile header names the section. */}
        <PagesHeader title={t("editPage.adminPanel")} />

        {/* Sidebar menu on the left, the working area takes the rest of the
            width (was a row of tabs above the content). */}
        <div className="admin-layout">
          <nav className="admin-sidebar" aria-label={t("editPage.adminPanel")}>
            <ul className="nav admin-tabs">
              {tabs.map((tab) => (
                <li className="nav-item" key={tab.key}>
                  <button
                    type="button"
                    className={`nav-link${currentTab.key === tab.key ? " active" : ""}`}
                    aria-current={currentTab.key === tab.key ? "page" : undefined}
                    onClick={() => setActiveTab(tab.key)}
                  >
                    {tab.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="admin-tab-content">
            <ActiveComponent />
          </div>
        </div>

        <CropModalForm />
      </main>
      <Footer settings={{ color: "black", bgColor: "white", shadow: true }} />
    </>
  );
});

export default AdminPage;
