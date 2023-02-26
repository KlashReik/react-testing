import React, { createContext, useContext, useState } from "react";
import { pricePerItem } from "../constants";

export const OrderDetails = createContext();

// create custom hook to check whether we're in a provider
export function useOrderDetails() {
  const contextValue = useContext(OrderDetails);
  if (!contextValue)
    throw new Error("UseOrderDetails is out of OrderDetilsProvider");

  return contextValue;
}

export function OrderDetailsProvider(props) {
  const [optionCounts, setOptionCounts] = useState({
    scoops: {},
    toppings: {},
  });

  function updateItemCount(itemName, newItemCount, optionType) {
    const newOptionCounts = { ...optionCounts };

    newOptionCounts[optionType][itemName] = newItemCount;

    setOptionCounts(newOptionCounts);
  }

  function resetOrder() {
    setOptionCounts({ scoops: {}, toppings: {} });
  }

  function calculateTotal(optionType) {
    // get an array of counts for the option type
    const countsArray = Object.values(optionCounts[optionType]);

    // total the values in the array of counts

    const totalCount = countsArray.reduce((total, value) => total + value, 0);

    return totalCount * pricePerItem[optionType];
  }

  const totals = {
    scoops: calculateTotal("scoops"),
    toppings: calculateTotal("toppings"),
  };

  const value = { optionCounts, totals, updateItemCount, resetOrder };

  return <OrderDetails.Provider value={value} {...props} />;
}
