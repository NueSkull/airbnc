// , (SELECT image_url FROM images WHERE property_id = p.property_id ORDER BY image_id LIMIT 1) AS image
const db = require("../db/connection");

exports.getFeaturedImage = async (property_id) => {
  const propertyImages = await db.query(
    `SELECT image_url FROM images WHERE property_id = $1 ORDER BY image_id ASC LIMIT 1;`,
    [property_id]
  );

  if (propertyImages.rows.length > 0) {
    return propertyImages.rows[0].image_url;
  } else {
    return null;
  }
};

exports.getPropertyImages = async (property_id) => {
  const propertyImages = await db.query(
    `SELECT image_url FROM images WHERE property_id = $1;`,
    [property_id]
  );

  if (propertyImages.rows.length > 0) {
    const imagesResult = propertyImages.rows;
    const images = [];

    for (let row in imagesResult) {
      images.push(imagesResult[row].image_url);
    }

    return images;
  } else {
    return null;
  }
};
