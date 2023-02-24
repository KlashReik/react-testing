import React, { useEffect, useState } from "react";
import axios from "axios";
import ScoopOption from "./ScoopOption";
import { TopingOption } from "./ToppingOption";
import { Row } from "react-bootstrap";

export default function Options({ optionType }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:3030/${optionType}`)
      .then((response) => setItems(response.data))
      .catch((err) => console.log(err));
  }, [optionType]);

  const ItemComponent = optionType === "scoops" ? ScoopOption : TopingOption;

  const optionItems = items.map((el) => (
    <ItemComponent key={el.name} name={el.name} imagePath={el.imagePath} />
  ));

  return <Row>{optionItems}</Row>;
}
