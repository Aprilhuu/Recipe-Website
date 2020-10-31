import React from 'react';
import styles from './NutritionLabel.less';

// TODO: Hacking with dummy data right now
export default ( ) => (
  <section className={styles.performanceFacts}>
    <header className={styles.performanceFactsHeader}>
      <h1 className={styles.performanceFactsTitle}>Nutrition Facts</h1>
      <p>Serving Size 1/2 cup (about 82g)</p>
      <p>Serving Per Container 8</p>
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
          200
        </th>
        <td>
          Calories from Fat
          130
        </td>
      </tr>
      <tr className={styles.thickRow}>
        <td colSpan="3" className={styles.smallInfo}>
          <b>% Daily Value*</b>
        </td>
      </tr>
      <tr>
        <th colSpan="2">
          <b>Total Fat </b>
          14g
        </th>
        <td>
          <b>22%</b>
        </td>
      </tr>
      <tr>
        <td className={styles.blankCell}>
        </td>
        <th>
          Saturated Fat
          9g
        </th>
        <td>
          <b>22%</b>
        </td>
      </tr>
      <tr>
        <td className={styles.blankCell}>
        </td>
        <th>
          Trans Fat
          0g
        </th>
        <td>
        </td>
      </tr>
      <tr>
        <th colSpan="2">
          <b>Cholesterol </b>
          55mg
        </th>
        <td>
          <b>18%</b>
        </td>
      </tr>
      <tr>
        <th colSpan="2">
          <b>Sodium </b>
          40mg
        </th>
        <td>
          <b>2%</b>
        </td>
      </tr>
      <tr>
        <th colSpan="2">
          <b>Total Carbohydrate </b>
          17g
        </th>
        <td>
          <b>6%</b>
        </td>
      </tr>
      <tr>
        <td className={styles.blankCell}>
        </td>
        <th>
          Dietary Fiber
          1g
        </th>
        <td>
          <b>4%</b>
        </td>
      </tr>
      <tr>
        <td className={styles.blankCell}>
        </td>
        <th>
          Sugars
          14g
        </th>
        <td>
        </td>
      </tr>
      <tr className={styles.thickEnd}>
        <th colSpan="2">
          <b>Protein </b>
          3g
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
          Vitamin A
          10%
        </td>
        <td>
          Vitamin C
          0%
        </td>
      </tr>
      <tr className={styles.thinEnd}>
        <td colSpan="2">
          Calcium
          10%
        </td>
        <td>
          Iron
          6%
        </td>
      </tr>
      </tbody>
    </table>

    <p className={styles.smallInfo}>* Percent Daily Values are based on a 2,000 calorie diet. Your daily values may
      be higher or lower depending on your calorie needs:</p>
  </section>
);
