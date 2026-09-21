import React from "react";
import ResponsiveImg from "../ResponsiveImg";

const CardTemplate = ({
  title,
  subtitle,
  card_content,
  img_src,
  img_file,
  alt,
  isList,
  height,
  imgHeight,
  border,
}) => {
  const splited_content =
    card_content &&
    card_content
      .split(";")
      .map((sentence, index) => <li key={index}>{sentence.trim()}</li>);

  const cardStyle = {
    height: height,
    border: border ? "1px solid #ddd" : "none",
  };

  return (
    <div className="card" style={cardStyle}>
      {(img_src || img_file) &&
        (() => {
          const imgProps = {
            alt: alt || title || "img",
            className: "card-img-top",
            style: {
              width: "100%",
              height: imgHeight,
              objectFit: "cover",
              objectPosition: "top",
              borderRadius: "5px",
            },
          };
          // img_file: a photo from the uploads folder, served as responsive
          // WebP variants; img_src: any other URL, used as-is.
          return img_file ? (
            <ResponsiveImg
              file={img_file}
              sizes="(max-width: 576px) 100vw, (max-width: 768px) 50vw, 25vw"
              {...imgProps}
            />
          ) : (
            // alt is spread in from imgProps; repeated explicitly so
            // jsx-a11y can see it (it cannot look through a spread).
            <img src={img_src} {...imgProps} alt={imgProps.alt} />
          );
        })()}
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <h6 className="card-subtitle mb-2 text-muted">{subtitle}</h6>
        {isList === true ? (
          <ul className="card-text">{splited_content} </ul>
        ) : (
          <p className="card-text">{card_content} </p>
        )}
      </div>
    </div>
  );
};

export default CardTemplate;
