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
          { nutritionFact["nutrition facts"]["CALORIES"] }
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
          { nutritionFact["nutrition facts"]["FAT"] }
        </th>
        <td>
          <b>{ Math.round(100 * parseFloat(nutritionFact["nutrition facts"]["FAT"])/65) + "%" }</b>
        </td>
      </tr>
      <tr>
        <td className={styles.blankCell}>
        </td>
        <th>
          <span>Saturated Fat </span>
          { nutritionFact["nutrition facts"]["SAT FAT"] }
        </th>
        <td>
          <b>{ Math.round(100 * parseFloat(nutritionFact["nutrition facts"]["SAT FAT"])/20) + "%" }</b>
        </td>
      </tr>
      <tr>
        <td className={styles.blankCell}>
        </td>
        <th>
          <span>Trans Fat </span>
          { nutritionFact["nutrition facts"]["TRANS FAT"] }
        </th>
        <td>
        </td>
      </tr>
      <tr>
        <th colSpan="2">
          <b>Cholesterol </b>
          { nutritionFact["nutrition facts"]["CHOL"] }
        </th>
        <td>
          <b>{ Math.round(100 * parseFloat(nutritionFact["nutrition facts"]["CHOL"])/300) + "%" }</b>
        </td>
      </tr>
      <tr>
        <th colSpan="2">
          <b>Sodium </b>
          { nutritionFact["nutrition facts"]["SODIUM"] }
        </th>
        <td>
          <b>{ Math.round(100 * parseFloat(nutritionFact["nutrition facts"]["SODIUM"])/2400) + "%" }</b>
        </td>
      </tr>
      <tr>
        <th colSpan="2">
          <b>Total Carbohydrate </b>
          { nutritionFact["nutrition facts"]["CARB"] }
        </th>
        <td>
          <b>{ Math.round(100 * parseFloat(nutritionFact["nutrition facts"]["CARB"])/300) + "%" }</b>
        </td>
      </tr>
      <tr>
        <td className={styles.blankCell}>
        </td>
        <th>
          <span>Dietary Fiber </span>
          { nutritionFact["nutrition facts"]["FIBER"] }
        </th>
        <td>
          <b>{ Math.round(100 * parseFloat(nutritionFact["nutrition facts"]["FIBER"])/25) + "%" }</b>
        </td>
      </tr>
      <tr>
        <td className={styles.blankCell}>
        </td>
        <th>
          <span>Sugars </span>
          { nutritionFact["nutrition facts"]["SUGARS"] }
        </th>
        <td>
        </td>
      </tr>
      <tr className={styles.thickEnd}>
        <th colSpan="2">
          <b>Protein </b>
          { nutritionFact["nutrition facts"]["PROTEIN"] }
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
          { nutritionFact["nutrition facts"]["VIT A"] }
        </td>
        <td>
          <span>Vitamin C </span>
          { nutritionFact["nutrition facts"]["VIT C"] }
        </td>
      </tr>
      <tr className={styles.thinEnd}>
        <td colSpan="2">
          <span>Calcium </span>
          { nutritionFact["nutrition facts"]["CALC"] }
        </td>
        <td>
          <span>Iron </span>
          { nutritionFact["nutrition facts"]["IRON"] }
        </td>
      </tr>
      </tbody>
    </table>

    <p className={styles.smallInfo}>* Percent Daily Values are based on a 2,000 calorie diet. Your daily values may
      be higher or lower depending on your calorie needs:</p>
  </section>
);
