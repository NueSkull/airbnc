const db = require("../db/connection");
const { checkPropertyType } = require("./property_types");
const { hasUserFavourited } = require("./favourites");
const { getFeaturedImage, getPropertyImages } = require("./images");

exports.getProperties = async (
  maxprice,
  minprice,
  property_type,
  sort,
  order
) => {
  let sortValue;
  let orderValue;

  const validSort = {
    cost_per_night: "p.price_per_night",
    popularity: "COUNT(f.property_id)",
  };

  const validOrder = ["ASC", "DESC"];

  if (sort && !validSort[sort]) {
    return Promise.reject({ status: 400, msg: "Invalid Sort Property" });
  } else if (sort && validSort[sort]) {
    sortValue = validSort[sort];
  } else {
    sortValue = "COUNT(f.property_id)";
  }

  if (order && !validOrder.includes(order)) {
    return Promise.reject({ status: 400, msg: "Invalid Order Property" });
  } else if (order && validOrder.includes(order)) {
    orderValue = order;
  } else {
    orderValue = "DESC";
  }

  const queries = [];
  let queryCount = 0;
  const whereOrAnd = function () {
    if (queryCount === 0) {
      return "WHERE";
    } else {
      return "AND";
    }
  };

  let query = `SELECT 
    p.property_id, p.name AS property_name, CONCAT(u.first_name,' ', u.surname) as host, p.location, p.price_per_night 
    FROM properties as p
    JOIN users as u ON p.host_id = u.user_id
    LEFT JOIN favourites as f ON p.property_id = f.property_id \n`;

  if (maxprice) {
    query += `${whereOrAnd()} p.price_per_night <= $${++queryCount} \n`;
    queries.push(maxprice);
  }

  if (minprice) {
    query += `${whereOrAnd()} p.price_per_night >= $${++queryCount} \n`;
    queries.push(minprice);
  }

  if (property_type) {
    query += `${whereOrAnd()} p.property_type = $${++queryCount} \n`;
    queries.push(property_type);
  }

  query += `GROUP BY p.property_id, p.name, CONCAT(u.first_name,' ', u.surname), p.location, p.price_per_night
  ORDER BY ${sortValue} ${orderValue};`;

  const result = await db.query(query, queries);

  if (result.rows.length === 0) {
    await checkPropertyType(property_type);
  }

  const featuredImagesPromises = result.rows.map(async (property) => {
    const featuredImage = await getFeaturedImage(property.property_id);
    return { ...property, image: featuredImage };
  });

  const addedFeaturedImages = await Promise.all(featuredImagesPromises);
  return addedFeaturedImages;
};

const checkPropertyExists = async (prop_id) => {
  const result = await db.query(
    `SELECT * FROM properties WHERE property_id = $1;`,
    [prop_id]
  );
  if (result.rows.length === 0) {
    return Promise.reject({ status: 404, msg: "Property Not Found" });
  }
};

exports.getProperty = async (prop_id, user_id) => {
  let result = await db.query(
    `SELECT p.property_id, p.name AS property_name, p.location, p.price_per_night, p.description, CONCAT(u.first_name, u.surname) AS host, u.avatar AS host_avatar, COUNT(f.property_id) AS favourite_count FROM properties AS p
    JOIN users AS u ON p.host_id = u.user_id 
    LEFT JOIN favourites AS f ON p.property_id = f.property_id 
    WHERE p.property_id = $1
    GROUP BY p.property_id, p.name, p.location, p.price_per_night, p.description, host, host_avatar`,
    [prop_id]
  );

  if (result.rows.length === 0) {
    await checkPropertyExists(prop_id);
  }

  if (user_id) {
    result.rows[0].favourited = await hasUserFavourited(prop_id, user_id);
  }

  const propertyImages = await getPropertyImages(prop_id);
  return { ...result.rows[0], images: propertyImages };
};
