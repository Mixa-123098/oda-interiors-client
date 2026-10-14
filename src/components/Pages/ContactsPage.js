import React, { useState } from "react";
import Header from "../Header";
import PagesHeader from "./PagesHeader";
import Footer from "../Footer";
import Seo from "../Seo";
import "./ContactsPage.css";
import { useTranslation } from "react-i18next";
import { API_URL } from "../../config/api";

const InquiryForm = () => {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    name: "",
    contact: "",
    message: "",
    website: "", // honeypot — hidden from real users
  });
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.contact.trim() && !form.message.trim()) return;
    setStatus("submitting");
    try {
      const response = await fetch(`${API_URL}/inquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!response.ok) throw new Error("failed");
      setStatus("success");
      // Record the conversion in analytics (Behavior → Events in Umami).
      window.umami?.track?.("lead-form-submit");
      setForm({ name: "", contact: "", message: "", website: "" });
    } catch (error) {
      console.error("Error submitting inquiry:", error);
      setStatus("error");
    }
  };

  return (
    <div className="contacts-panel">
      <h2 className="contacts-form-title">{t("contactsPage.form.title")}</h2>
      <p className="contacts-form-hint">{t("contactsPage.form.hint")}</p>

      {status === "success" ? (
        <div className="contacts-message contacts-message--success" role="alert">
          {t("contactsPage.form.success")}
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            className="contacts-field"
            placeholder={t("contactsPage.form.name")}
            value={form.name}
            onChange={handleChange}
            disabled={status === "submitting"}
          />
          <input
            type="text"
            name="contact"
            className="contacts-field"
            placeholder={t("contactsPage.form.contact")}
            value={form.contact}
            onChange={handleChange}
            disabled={status === "submitting"}
            required
          />
          <textarea
            name="message"
            className="contacts-field"
            rows="3"
            placeholder={t("contactsPage.form.message")}
            value={form.message}
            onChange={handleChange}
            disabled={status === "submitting"}
          />
          {/* Honeypot: visually hidden, off-screen, not tab-reachable. */}
          <input
            type="text"
            name="website"
            value={form.website}
            onChange={handleChange}
            tabIndex="-1"
            autoComplete="off"
            style={{ position: "absolute", left: "-9999px" }}
            aria-hidden="true"
          />
          {status === "error" && (
            <div className="contacts-message contacts-message--error" role="alert">
              {t("contactsPage.form.error")}
            </div>
          )}
          <button
            type="submit"
            className="contacts-submit"
            disabled={status === "submitting"}
          >
            {status === "submitting" && (
              <span
                className="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              ></span>
            )}
            {status === "submitting"
              ? t("contactsPage.form.submitting")
              : t("contactsPage.form.submit")}
          </button>
        </form>
      )}
    </div>
  );
};

const ContactsPage = () => {
  const { t } = useTranslation();

  return (
    <div className="contacts-page">
      <Seo
        title={t("seo.contacts.title")}
        description={t("seo.contacts.description")}
      />
      <Header fontColor={`#000000`} invert={`invert(0%)`} rep={true} />
      <PagesHeader title={t("contactsPage.contacts")} />
      <div className="container my-5" style={{ minHeight: "25vh" }}>
        <div className="contacts-layout">
          <InquiryForm />

          <div className="contacts-direct">
            <h2 className="contacts-form-title contacts-direct-title">
              {t("contactsPage.direct")}
            </h2>
            <div className="contacts-details">
              <div className="contacts-detail">
                <span className="contacts-detail-label">
                  {t("contactsPage.telegram")}
                </span>
                <a
                  href="https://t.me/marynaprokhorova_design"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  @marynaprokhorova_design
                </a>
              </div>
              <div className="contacts-detail">
                <span className="contacts-detail-label">
                  {t("contactsPage.instagram")}
                </span>
                <a
                  href="https://www.instagram.com/_svidoma_/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  @_svidoma_
                </a>
              </div>
              <div className="contacts-detail">
                <span className="contacts-detail-label">
                  {t("contactsPage.email")}
                </span>
                <a href="mailto:marynaprokhorova@gmail.com">
                  marynaprokhorova@gmail.com
                </a>
              </div>
              <div className="contacts-detail">
                <span className="contacts-detail-label">
                  {t("contactsPage.telephone")}
                </span>
                <span className="contacts-phone">
                  <a href="tel:+380676397018">+380 67 639 70 18</a>
                  <span className="contacts-phone-apps">
                    <a href="viber://chat?number=%2B380676397018">
                      {t("contactsPage.viber")}
                    </a>
                    <a
                      href="https://wa.me/380676397018"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      WhatsApp
                    </a>
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer settings={{ color: `black`, bgColor: `white`, shadow: true }} />
    </div>
  );
};

export default ContactsPage;
