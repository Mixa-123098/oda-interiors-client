import React from "react";

const ThirdBlock = () => {
  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">Наша Команда</h2>
      <div className="row">
        <div className="col-md-4 mb-4">
          <img
            src="url_до_зображення_учасника_команди"
            alt="Учасник 1"
            className="img-fluid rounded-circle"
          />
          <h4 className="mt-3">Ім'я Учасника 1</h4>
          <p>Посада у команді</p>
        </div>
        <div className="col-md-4 mb-4">
          <img
            src="url_до_зображення_учасника_команди"
            alt="Учасник 2"
            className="img-fluid rounded-circle"
          />
          <h4 className="mt-3">Ім'я Учасника 2</h4>
          <p>Посада у команді</p>
        </div>
        <div className="col-md-4 mb-4">
          <img
            src="url_до_зображення_учасника_команди"
            alt="Учасник 3"
            className="img-fluid rounded-circle"
          />
          <h4 className="mt-3">Ім'я Учасника 3</h4>
          <p>Посада у команді</p>
        </div>
      </div>
    </div>
  );
};

export default ThirdBlock;
