import React, { useMemo, useState, useEffect } from "react";
import "./Loader.css"; // Создадим стили отдельно
import { useTranslation } from "react-i18next";

const Loader = () => {
  const { t } = useTranslation();
  // t returns a fresh array each render, which would restart the intervals
  // below on every render if listed as a dependency. Memoized on t, whose
  // identity changes exactly when the language does.
  const messages = useMemo(() => {
    const list = t("loader", { returnObjects: true });
    return Array.isArray(list) ? list : [String(list)];
  }, [t]);

  // const messages = [
  //   "Загрузка...",
  //   "Почти готово...",
  //   "Чай поставил?",
  //   "Терпение — добродетель!",
  // ];
  const [currentMessage, setCurrentMessage] = useState(messages[0]);
  const [dotCount, setDotCount] = useState(0);

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setCurrentMessage((prev) => {
        const currentIndex = messages.indexOf(prev);
        return messages[(currentIndex + 1) % messages.length];
      });
    }, 2000);

    const dotInterval = setInterval(() => {
      setDotCount((prev) => (prev + 1) % 4);
    }, 500);

    return () => {
      clearInterval(messageInterval);
      clearInterval(dotInterval);
    };
  }, [messages]);

  return (
    <div className="loader-container">
      <div className="spinner" />
      <p className="loader-text">
        {currentMessage}
        {".".repeat(dotCount)}
      </p>
    </div>
  );
};

export default Loader;
