import React from "react";
import { Link } from "react-router-dom";
import ScrollToTop from "../../custom-hooks/ScrollToTop";
import { useTranslation } from "react-i18next";

const FifthBlock = () => {
  const { t } = useTranslation();

  return (
    <div className="first-block">
      <div className="first-block-content-container">
        <h2>{t("mainPage.block5.title")}</h2>
        <div className="row pt-4 pb-2">
          <div className="col">
            <p>{t("mainPage.block5.mainTextPartOne")}</p>
          </div>
          <div className="col">
            <p>{t("mainPage.block5.mainTextPartTwo")}</p>
          </div>
        </div>
        <button className="first-block-button">
          <Link to="/price" className="link-style" onClick={ScrollToTop}>
            {t("mainPage.block5.button")}
          </Link>
        </button>
      </div>
    </div>
  );
};

export default FifthBlock;

// import React from "react";

// const FifthBlock = () => {
//   return (
//     <div className="container my-5">
//       <h2 className="text-center mb-4">Дізнатися ціну</h2>
//       <div className="row justify-content-center">
//         <div className="col-md-6">
//           <form>
//             <div className="mb-3">
//               <label htmlFor="name" className="form-label">
//                 Ім'я
//               </label>
//               <input type="text" className="form-control" id="name" />
//             </div>
//             <div className="mb-3">
//               <label htmlFor="email" className="form-label">
//                 Електронна пошта
//               </label>
//               <input type="email" className="form-control" id="email" />
//             </div>
//             <div className="mb-3">
//               <label htmlFor="message" className="form-label">
//                 Повідомлення
//               </label>
//               <textarea className="form-control" id="message" rows="3"></textarea>
//             </div>
//             <button type="submit" className="btn btn-primary">
//               Відправити
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FifthBlock;
