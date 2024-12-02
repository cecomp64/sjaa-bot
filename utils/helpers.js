require('dotenv').config();

//  compute_column
//
//  Translate column_number into a Google Sheets row
//  'A-Z', 'AA-AZ' and so on
function compute_column(column_number, base=26) {
  var n = column_number;
  var d = Math.max(0, Math.floor(Math.log(n) / Math.log(base)));

  // Start with the highest dimension, d, and work our way
  // down
  return compute_digits(n, d, base);
}

//  compute_digits
//
//  Do the heavy lifiting to convert base-n number to base-base letter
function compute_digits(n, d, base) {
  //console.debug(`n: ${n}, d: ${d}, base: ${base}`);
  if( d==0 ) {
    // The last dimension is just the remainder (n * base^0)
    var char = String.fromCharCode(65 + n);
    //console.debug(`char: ${char}`);

    return char;
  } else {
    var char;

    // Subtract out one multuple of base^d for this place
    var np = n - (base**d);
    np = (np < 0) ? n : np;

    // Compute how many additional multupiples of base^d there are
    var l = Math.floor(np / (base ** d));
    char = String.fromCharCode(65 + l);
    //console.debug(`np: ${np}, l: ${l}, char: ${char}`);

    // Recurse for the remainder, np - l(base^d)
    return char + compute_digits((np - (l*(base**d))), d-1, base);
  }
}

//  find_discord_user
//
//  Given membership data, return the rows associated with the member
//  data, if any.  Empty array if no matches.
function find_discord_user(data, id) {
    const discord_index = data[0].findIndex ( value => value == process.env.MEMBERSHIP_SHEET_DISCORD_ID);
    return data.slice(1).filter( row => row[discord_index] == id);
}

module.exports = { compute_column, compute_digits, find_discord_user }