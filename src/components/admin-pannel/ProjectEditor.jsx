import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import DragAndDropImges from "./DragAndDropImges";
import ProjectLocationPicker from "./ProjectLocationPicker";
import useFileUpload from "../../custom-hooks/useFileUpload";
import { API_URL } from "../../config/api";

const TEXT_FIELDS = [
  "name",
  "city",
  "country",
  "brief",
  "end_date",
  "team",
  "drawing_description",
];

const emptyTextFields = () =>
  TEXT_FIELDS.reduce((acc, f) => ({ ...acc, [f]: "" }), {});

// One editor for everything about a project: pick a language at the top
// (works the same whether that language is the project's own — source_lang,
// stored on projects/projects_blueprints — or a translation, stored in
// project_translations) and edit its text; specialization, photos, and
// gallery order are language-independent and stay visible regardless of
// which language tab is active. Replaces what used to be two separate
// editors (a full form for the source language only, and a text-only
// translations panel) with one, styled after the old translations panel.
const ProjectEditor = ({ project, onSaved, onClose }) => {
  const { t } = useTranslation();
  const [sourceLang, setSourceLang] = useState(null);
  const [allTranslations, setAllTranslations] = useState(null);
  const [activeLang, setActiveLang] = useState(null);
  const [fields, setFields] = useState(emptyTextFields());
  const [specialization, setSpecialization] = useState(
    project.project_specialization?.trim() || ""
  );
  const [square, setSquare] = useState(project.project_square || "");
  const [order, setOrder] = useState([]);
  const [loadStatus, setLoadStatus] = useState("loading"); // loading | idle | error
  const [saveStatus, setSaveStatus] = useState("idle"); // idle | saving | success | error

  const [projectData, setProjectData] = useState({});
  const { handleFileChange, handleUpload } = useFileUpload(
    setProjectData,
    projectData
  );

  useEffect(() => {
    setLoadStatus("loading");
    fetch(`${API_URL}/projects/${project.id}/translations`, {
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) throw new Error("load_failed");
        return response.json();
      })
      .then((data) => {
        setSourceLang(data.source_lang);
        setAllTranslations(data.translations);
        setActiveLang(data.source_lang);
        setFields({
          ...emptyTextFields(),
          ...(data.translations[data.source_lang] || {}),
        });
        setLoadStatus("idle");
      })
      .catch((error) => {
        console.error("Error loading project translations:", error);
        setLoadStatus("error");
      });
  }, [project.id]);

  const handleSelectLang = (lang) => {
    setActiveLang(lang);
    setSaveStatus("idle");
    setFields({ ...emptyTextFields(), ...(allTranslations[lang] || {}) });
  };

  const handleFieldChange = (field, value) => {
    setFields((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaveStatus("saving");
    try {
      await handleUpload(`${API_URL}/upload`);

      const isSource = activeLang === sourceLang;

      const [textRes, otherRes] = await Promise.all([
        fetch(`${API_URL}/projects/${project.id}/translations/${activeLang}`, {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(fields),
        }),
        // Specialization/photos/order aren't per-language. When the active
        // tab is the source language, the edited text flows through here
        // too; otherwise the original source text is sent back unchanged so
        // this request can't overwrite it with whatever's on screen for a
        // different language.
        fetch(`${API_URL}/update_project/${project.id}`, {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            project_name: isSource ? fields.name : project.project_name,
            project_city: isSource ? fields.city : project.project_city,
            project_country: isSource
              ? fields.country
              : project.project_country,
            project_specialization: specialization,
            project_img_src: projectData.header_prew,
            project_header_img: projectData.header_img,
            project_brief: isSource ? fields.brief : project.project_brief,
            project_finish_date: isSource
              ? fields.end_date
              : project.project_finish_date,
            project_square: square,
            project_team: isSource ? fields.team : project.project_team,
            imges_list: order,
            prew_img: projectData.blueprint,
            new_images: projectData.new_images
              ? [].concat(projectData.new_images)
              : [],
          }),
        }),
      ]);

      if (!textRes.ok || !otherRes.ok) throw new Error("save_failed");

      setAllTranslations((prev) => ({ ...prev, [activeLang]: fields }));
      setSaveStatus("success");
      onSaved({
        ...project,
        project_name: isSource ? fields.name : project.project_name,
        project_city: isSource ? fields.city : project.project_city,
        project_country: isSource ? fields.country : project.project_country,
        project_specialization: specialization,
        project_brief: isSource ? fields.brief : project.project_brief,
        project_finish_date: isSource
          ? fields.end_date
          : project.project_finish_date,
        project_square: square,
        project_team: isSource ? fields.team : project.project_team,
      });
    } catch (error) {
      console.error("Error saving project:", error);
      setSaveStatus("error");
    }
  };

  if (loadStatus === "loading") {
    return <p>Завантаження...</p>;
  }
  if (loadStatus === "error") {
    return <p className="text-danger">Не вдалося завантажити проєкт</p>;
  }

  return (
    <div className="border rounded p-3 mt-2">
      <div className="d-flex flex-wrap gap-2 mb-3">
        {Object.keys(allTranslations).map((lang) => (
          <button
            key={lang}
            type="button"
            className={`btn btn-sm ${
              activeLang === lang ? "btn-dark" : "btn-outline-dark"
            }`}
            onClick={() => handleSelectLang(lang)}
          >
            {lang.toUpperCase()}
            {lang === sourceLang && " *"}
            {allTranslations[lang] === null && " (нема перекладу)"}
          </button>
        ))}
        <button
          type="button"
          className="btn btn-sm btn-outline-secondary ms-auto"
          onClick={onClose}
        >
          {t("editPage.editProject.closeEditor")}
        </button>
      </div>
      <p className="text-muted small">
        * — мова, якою проєкт створений напряму (не переклад)
      </p>

      {saveStatus === "success" && (
        <div className="alert alert-success py-1 small" role="alert">
          {t("editPage.editProject.saveSuccess")}
        </div>
      )}
      {saveStatus === "error" && (
        <div className="alert alert-danger py-1 small" role="alert">
          {t("editPage.editProject.saveError")}
        </div>
      )}

      <div className="row g-2">
        <div className="col-6">
          <label className="form-label small">
            {t("editPage.createNewProject.name")}
          </label>
          <input
            type="text"
            className="form-control form-control-sm"
            value={fields.name}
            onChange={(e) => handleFieldChange("name", e.target.value)}
          />
        </div>
        <div className="col-3">
          <label className="form-label small">
            {t("editPage.createNewProject.city")}
          </label>
          <input
            type="text"
            className="form-control form-control-sm"
            value={fields.city}
            onChange={(e) => handleFieldChange("city", e.target.value)}
          />
        </div>
        <div className="col-3">
          <label className="form-label small">
            {t("editPage.createNewProject.country")}
          </label>
          <input
            type="text"
            className="form-control form-control-sm"
            value={fields.country}
            onChange={(e) => handleFieldChange("country", e.target.value)}
          />
        </div>
        <div className="col-12">
          <label className="form-label small">
            {t("editPage.createNewProject.projectDescription")}
          </label>
          <input
            type="text"
            className="form-control form-control-sm"
            value={fields.brief}
            onChange={(e) => handleFieldChange("brief", e.target.value)}
          />
        </div>
        <div className="col-4">
          <label className="form-label small">
            {t("editPage.createNewProject.endDate")}
          </label>
          <input
            type="text"
            className="form-control form-control-sm"
            value={fields.end_date}
            onChange={(e) => handleFieldChange("end_date", e.target.value)}
          />
        </div>
        <div className="col-8">
          <label className="form-label small">
            {t("editPage.createNewProject.team")}
          </label>
          <input
            type="text"
            className="form-control form-control-sm"
            value={fields.team}
            onChange={(e) => handleFieldChange("team", e.target.value)}
          />
        </div>
        <div className="col-12">
          <label className="form-label small">
            {t("editPage.createNewProject.blueprintDescription")}
          </label>
          <input
            type="text"
            className="form-control form-control-sm"
            value={fields.drawing_description}
            onChange={(e) =>
              handleFieldChange("drawing_description", e.target.value)
            }
          />
        </div>
      </div>

      <hr />
      <div className="small text-muted mb-2">
        {t("editPage.editProject.sharedFieldsHint")}
      </div>
      <div className="row g-2">
        <div className="col-6">
          <label className="form-label small">
            {t("editPage.createNewProject.specialization.title")}
          </label>
          <select
            className="form-select form-select-sm"
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
          >
            <option value="1">
              {t(
                "editPage.createNewProject.specialization.publicInteriors"
              )}
            </option>
            <option value="2">
              {t("editPage.createNewProject.specialization.apartments")}
            </option>
            <option value="3">
              {t(
                "editPage.createNewProject.specialization.privateHouses"
              )}
            </option>
          </select>
        </div>
        <div className="col-6">
          <label className="form-label small">
            {t("editPage.editProject.square")}
          </label>
          <input
            type="text"
            className="form-control form-control-sm"
            value={square}
            onChange={(e) => setSquare(e.target.value)}
          />
        </div>
      </div>

      <ProjectLocationPicker project={project} />

      <DragAndDropImges
        project_id={project.id}
        setOrder={setOrder}
        handleFileChange={handleFileChange}
      />

      <button
        type="button"
        className="btn btn-dark btn-sm mt-3 d-flex align-items-center gap-2"
        onClick={handleSave}
        disabled={saveStatus === "saving"}
      >
        {saveStatus === "saving" && (
          <span
            className="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
          ></span>
        )}
        {t("editPage.editProject.save")}
      </button>
    </div>
  );
};

export default ProjectEditor;
