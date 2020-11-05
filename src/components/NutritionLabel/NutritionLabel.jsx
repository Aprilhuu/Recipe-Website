import React from 'react';
import styles from './NutritionLabel.less';

/**
 * This function is used to construct a nutrition label widget. Code is refactored from
 * reference design here: https://codepen.io/chriscoyier/pen/egHEK
 */
export default ({nutritionFact, servingSize}) => (
  <section className={styles.performanceFacts}>
    <header className={styles.performanceFactsHeader}>
      <h1 className={styles.performanceFactsTitle}>Nutrition Facts</h1>
      <p>{ "Serving Size 1/" + servingSize + " recipe" }</p>
      <p>{ "Serving Per Container " + servingSize } </p>
    </header>
    <table className={styles.performanceFactsTable}>
      <thead>
      <tr>
        <th colSpan="3" className={styles.smallInfo}>
          Amount Per Serving
        </th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <th colSpan="2">
          <b>Calories </b>
          { nutritionFact["nutrition facts"]["calories"] }
        </th>
      </tr>
      <tr className={styles.thickRow}>
        <td colSpan="3" className={styles.smallInfo}>
          <b>% Daily Value*</b>
        </td>
      </tr>
      <tr>
        <th colSpan="2">
          <b>Total Fat </b>
          { nutritionFact["nutrition facts"]["fat"] }
        </th>
        <td>
          <b>{ Math.round(100 * parseFloat(nutritionFact["nutrition facts"]["fat"])/65) + "%" }</b>
        </td>
      </tr>
      <tr>
        <td className={styles.blankCell}>
        </td>
        <th>
          <span>Saturated Fat </span>
          { nutritionFact["nutrition facts"]["saturated fat"] }
        </th>
        <td>
          <b>{ Math.round(100 * parseFloat(nutritionFact["nutrition facts"]["saturated fat"])/20) + "%" }</b>
        </td>
      </tr>
      <tr>
        <td className={styles.blankCell}>
        </td>
        <th>
          <span>Trans Fat </span>
          { nutritionFact["nutrition facts"]["trans fat"] }
        </th>
        <td>
        </td>
      </tr>
      <tr>
        <th colSpan="2">
          <b>Cholesterol </b>
          { nutritionFact["nutrition facts"]["cholesterol"] }
        </th>
        <td>
          <b>{ Math.round(100 * parseFloat(nutritionFact["nutrition facts"]["cholesterol"])/300) + "%" }</b>
        </td>
      </tr>
      <tr>
        <th colSpan="2">
          <b>Sodium </b>
          { nutritionFact["nutrition facts"]["sodium"] }
        </th>
        <td>
          <b>{ Math.round(100 * parseFloat(nutritionFact["nutrition facts"]["sodium"])/2400) + "%" }</b>
        </td>
      </tr>
      <tr>
        <th colSpan="2">
          <b>Total Carbohydrate </b>
          { nutritionFact["nutrition facts"]["total carbohydrate"] }
        </th>
        <td>
          <b>{ Math.round(100 * parseFloat(nutritionFact["nutrition facts"]["total carbohydrate"])/300) + "%" }</b>
        </td>
      </tr>
      <tr>
        <td className={styles.blankCell}>
        </td>
        <th>
          <span>Dietary Fiber </span>
          { nutritionFact["nutrition facts"]["fiber"] }
        </th>
        <td>
          <b>{ Math.round(100 * parseFloat(nutritionFact["nutrition facts"]["fiber"])/25) + "%" }</b>
        </td>
      </tr>
      <tr>
        <td className={styles.blankCell}>
        </td>
        <th>
          <span>Sugars </span>
          { nutritionFact["nutrition facts"]["sugars"] }
        </th>
        <td>
        </td>
      </tr>
      <tr className={styles.thickEnd}>
        <th colSpan="2">
          <b>Protein </b>
          { nutritionFact["nutrition facts"]["protein"] }
        </th>
        <td>
        </td>
      </tr>
      </tbody>
    </table>

    <table className={styles.performanceFactsTableGrid}>
      <tbody>
      <tr>
        <td colSpan="2">
          <span>Vitamin A </span>
          { nutritionFact["nutrition facts"]["vit a"] }
        </td>
        <td>
          <span>Vitamin C </span>
          { nutritionFact["nutrition facts"]["vit c"] }
        </td>
      </tr>
      <tr className={styles.thinEnd}>
        <td colSpan="2">
          <span>Calcium </span>
          { nutritionFact["nutrition facts"]["calc"] }
        </td>
        <td>
          <span>Iron </span>
          { nutritionFact["nutrition facts"]["iron"] }
        </td>
      </tr>
      </tbody>
    </table>

    <p className={styles.smallInfo}>* Percent Daily Values are based on a 2,000 calorie diet. Your daily values may
      be higher or lower depending on your calorie needs:</p>
  </section>
);
