const properties = require('./json/properties.json');
const users = require('./json/users.json');
const { Pool } = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
})

pool.query(`SELECT title FROM properties LIMIT 10;`).then(response => { 
  // console.log(response)

})

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function (email) {
  // let user;
  // for (const userId in users) {
  //   user = users[userId];
  //   if (user.email.toLowerCase() === email.toLowerCase()) {
  //     break;
  //   } else {
  //     user = null;
  //   }
  // }
  // return Promise.resolve(user);

  //USING database
  return pool
  .query(`SELECT * FROM users WHERE email = $1`,[email])
    .then((result) => {
      console.log(result.rows);
      if(result.rows.length>0){
      return result.rows[0];
      }else{
        return null;
      }
    })
    .catch((err) => {
      console.log(err.message);
    }); 

}
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function (id) {
  // return Promise.resolve(users[id]);

    //USING database
    return pool
    .query(`SELECT * FROM users WHERE id = $1`,[id])
      .then((result) => {
        console.log(result.rows);
        if(result.rows.length>0){
        return result.rows[0];
        }else{
          return null;
        }
      })
      .catch((err) => {
        console.log(err.message);
      }); 
}
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function (user) {
  // const userId = Object.keys(users).length + 1;
  // user.id = userId;
  // users[userId] = user;
  // return Promise.resolve(user);

    //USING database
    return pool
    .query(`INSERT INTO users(name,email,password) 
    VALUES($1,$2,$3) RETURNING *`,[user.name,user.email,user.password])
      .then((result) => {
        return result.rows;
      })
      .catch((err) => {
        console.log(err.message);
      }); 
}
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function (guest_id, limit = 10) {
  // return getAllProperties(null, 2);
      //USING database
      return pool
      .query(`
      SELECT reservations.*, properties.*, avg(property_reviews.rating) as average_rating
      FROM reservations
      JOIN users ON guest_id = users.id
      JOIN properties ON property_id = properties.id
      JOIN property_reviews ON properties.id = property_reviews.property_id
      WHERE users.id = $1
      GROUP by reservations.id, properties.id
      ORDER BY start_date
      LIMIT 10;;  
      `,[guest_id])
        .then((result) => {
          // console.log(result.rows);
          return result.rows;
        })
        .catch((err) => {
          console.log(err.message);
        }); 

}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function (options, limit = 10) {
  //USING JSON

  // const limitedProperties = {};
  // for (let i = 1; i <= limit; i++) {
  //   limitedProperties[i] = properties[i];
  // }
  // return Promise.resolve(limitedProperties);

  //USING DATABASE lightbnb
  // 1
  const queryParams = [];
  let input = false;
  // 2
  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  `;

  // 3

  if (options.owner_id) {
    queryParams.push(`%${options.owner_id}%`);
    queryString += `WHERE owner_id = $${queryParams.length} `;
  }

  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `WHERE city LIKE $${queryParams.length} `;
    input = true;
  }

  if (options.minimum_price_per_night && options.maximum_price_per_night) {
    queryParams.push(`${options.minimum_price_per_night*100}`);
    queryParams.push(`${options.maximum_price_per_night*100}`);
    if(!input){
    queryString += `WHERE cost_per_night between $${queryParams.length-1} AND $${queryParams.length} `;
    }else {
      queryString += `AND cost_per_night between $${queryParams.length-1} AND $${queryParams.length} `;
    }
    input = true;
  }
 

  // 4
 
  queryString += `
  GROUP BY properties.id `;

  if (options.minimum_rating) {
    queryParams.push(`${options.minimum_rating}`);
 
    queryString += `HAVING avg(property_reviews.rating) >= $${queryParams.length} `
    
  }

  queryParams.push(limit);
  queryString+=
  `ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;

  // 5
  console.log(queryString, queryParams);

  // 6
  return pool.query(queryString, queryParams).then((res) => res.rows);


}
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function (property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
}
exports.addProperty = addProperty;
