import React from "react";

function Entity({ name, health }) {
  return (
    <section className="container">
      <h2>{name}</h2>
      <div className="healthbar">
        <div
          className="healthbar__value"
          style={{ width: health + "%" }}
        ></div>
      </div>
      <p>{health} HP</p>
    </section>
  );
}

export default Entity;