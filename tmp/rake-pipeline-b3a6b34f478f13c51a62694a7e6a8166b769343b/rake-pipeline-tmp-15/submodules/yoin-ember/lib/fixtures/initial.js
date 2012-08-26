minispade.register('yoin-ember/fixtures/initial', function() {Yn.Category.FIXTURES = [
  {"id": "1", "name": "Restaurantes", "order": 2, "icon": "l", "resource_uri": "1", "subcategory": 0}, 
  {"id": "2", "name": "Cafe", "order": 3, "icon": "d", "resource_uri": "2", "subcategory": 0}, 
  {"id": "3", "name": "Ropa", "order": 4, "icon": "j", "resource_uri": "3", "subcategory": 0}, 
  {"id": "5", "name": "Promo", "order": 1, "icon": "R", "resource_uri": "5", "subcategory": 1}, 
  {"id": "6", "name": "Tarjeta Regalo", "order": 6, "icon": "K", "resource_uri": "6", "subcategory": 2}, 
  {"id": "4", "name": "Bebida", "order": 5, "icon": "n", "resource_uri": "4", "subcategory": 0}
];

Yn.City.FIXTURES = [
  {"id": "9", "lat": 51.508129, "lon": -0.128005, "name": "London", "is_default": true},
  {"id": "10", "lat": 51.508129, "lon": -0.128005, "name": "Madrid", "is_default": false},
  {"id": "11", "lat": 51.508129, "lon": -0.128005, "name": "Barcelona", "is_default": false},
  {"id": "12", "lat": 51.508129, "lon": -0.128005, "name": "Sevilla", "is_default": false},
  {"id": "13", "lat": 51.508129, "lon": -0.128005, "name": "Paris", "is_default": false}
];


Yn.Brand.FIXTURES = [
  {"id": "21", "name": "Casio London", "picture": "./assets/fixtures/logos/casio_london.png", "resource_uri": "21"},
  {"id": "20", "name": "Tattershall Castle", "picture": "./assets/fixtures/logos/tattershall_castle.png", "resource_uri": "20"},
  {"id": "19", "name": "The archduke", "picture": "./assets/fixtures/logos/the_archduke.png", "resource_uri": "19"},
  {"id": "18", "name": "Yacht London", "picture": "./assets/fixtures/logos/yacht_london.png", "resource_uri": "18"},
  {"id": "17", "name": "Mishkin's", "picture": "./assets/fixtures/logos/mishkins.png", "resource_uri": "17"},
  {"id": "16", "name": "Joe Allen", "picture": "./assets/fixtures/logos/joe_allen.png", "resource_uri": "16"},
  {"id": "15", "name": "Pizza Express", "picture": "./assets/fixtures/logos/pizza_express.png", "resource_uri": "15"},
  {"id": "14", "name": "Armani", "picture": "./assets/fixtures/logos/armani.png", "resource_uri": "14"},
  {"id": "13", "name": "Costa Cafe", "picture": "./assets/fixtures/logos/costa_cafe.png", "resource_uri": "13"},
  {"id": "6", "name": "Zara", "picture": "./assets/fixtures/logos/zara.png", "resource_uri": "6"},
  {"id": "4", "name": "Starbucks", "picture": "./assets/fixtures/logos/starbucks.png", "resource_uri": "4"},
  {"id": "2", "name": "Burger King", "picture": "./assets/fixtures/logos/burguer_king.png", "resource_uri": "2"},
  {"id": "12", "name": "Mcdonalds", "picture": "./assets/fixtures/logos/macdonalds.png", "resource_uri": "12"}
];


Yn.Venue.FIXTURES = [
  {"distance": 3, "users":["15", "13", "16"], "address": "85 Gloucester Road South Kensington", "brand": "2", "city": "9", "id": "236", "lat": 51.494439, "lon": -0.182407, "name": "Burger King", "products": ["4"], "resource_uri": "236", "zip_code": "SW7 4SS"}, 
  {"distance": 30, "users":["15", "13", "16"], "address": "142-144 Wardour Street City of Westminster, W1F 8, United Kingdom", "brand": "2", "city": "9", "id": "235", "lat": 51.514175, "lon": -0.134597, "name": "Burger King", "products": ["4"], "resource_uri": "235", "zip_code": "W1F 8"},
  {"distance": 50, "users":["15", "13", "16"], "address": "85 Gloucester Road South Kensington, London SW7 4SS, United ", "brand": "6", "city": "9", "id": "248", "lat": 51.494439, "lon": -0.182407, "name": "Zara", "products": ["31"], "resource_uri": "248", "zip_code": "SW7 4SS"},
  {"distance": 3, "users":["15", "13", "16"], "address": "Tattershall Castle\u200e Whitehall Police Station Victoria Embankment, Whitehall, Lon", "brand": "20", "city": "9", "id": "283", "lat": 51.505104, "lon": -0.126668, "name": "Tattershall Castle", "products": ["32", "27"], "resource_uri": "283", "zip_code": "UK SW1A"}, 
  {"distance": 50, "users":["15", "13", "16"], "address": "65 Sloane Avenue Chelsea, UK SW3 3, United Kingdom", "brand": "4", "city": "9", "id": "243", "lat": 51.491976, "lon": -0.164972, "name": "Starbucks", "products": ["12", "33", "13"], "resource_uri": "243", "zip_code": "UK SW3 3"}, 
  {"distance": 3, "users":["15", "13", "16"], "address": "52-56 Long Acre Covent Garden", "brand": "6", "city": "9", "id": "249", "lat": 51.511358, "lon": -0.123103, "name": "Zara", "products": ["19"], "resource_uri": "249", "zip_code": "WC2E 9JR"}, 
  {"distance": 50, "users":["15", "13", "16"], "address": "138 Camden High Street London ", "brand": "2", "city": "9", "id": "237", "lat": 51.537766, "lon": -0.141676, "name": "Burger King", "products": ["4", "36"], "resource_uri": "237", "zip_code": "NW1 0LU"}, 
  {"distance": 3, "users":["15", "13", "16"], "address": "134 Tottenham Court Road", "brand": "12", "city": "9", "id": "269", "lat": 51.524375, "lon": -0.137906, "name": "Mcdonalds", "products": ["38"], "resource_uri": "269", "zip_code": "W1T 5BA"}, 
  {"distance": 50, "users":["15", "13", "16"], "address": "Temple Pier Victoria Embankment", "brand": "18", "city": "9", "id": "281", "lat": 51.51027, "lon": -0.116707, "name": "Yacht London", "products": ["25", "42"], "resource_uri": "281", "zip_code": "WC2R 2PN"}, 
  {"distance": 3, "users":["15", "13", "16"], "address": "51 Great Russell Street London, Greater London WC1B 3BA, United Kingdom", "brand": "4", "city": "9", "id": "242", "lat": 51.518328, "lon": -0.125884, "name": "Starbucks", "products": ["39"], "resource_uri": "242", "zip_code": "WC1B 3BA"}, 
  {"distance": 50, "users":["15", "13", "16"], "address": "Unit 25 the Concourse", "brand": "12", "city": "9", "id": "267", "lat": 51.517142, "lon": -0.082633, "name": "Mcdonalds", "products": ["4"], "resource_uri": "267", "zip_code": "EC2M 7PY"}, 
  {"distance": 3, "users":["15", "13", "16"], "address": "302-304 Pentonville Road", "brand": "12", "city": "9", "id": "266", "lat": 51.53093, "lon": -0.122207, "name": "Mcdonalds", "products": ["4"], "resource_uri": "266", "zip_code": "N1 9XD"}, 
  {"distance": 50, "users":["15", "13", "16"], "address": "115 New Bond Street Mayfair, London W1S 1DP, United Kingdom", "brand": "14", "city": "9", "id": "274", "lat": 51.513035, "lon": -0.145344, "name": "Armani ", "products": ["41"], "resource_uri": "274", "zip_code": "W1S 1DP"}, 
  {"distance": 3, "users":["15", "13", "16"], "address": "191 Brompton Road", "brand": "14", "city": "9", "id": "275", "lat": 51.498012, "lon": -0.166425, "name": "Armani", "products": ["41", "21"], "resource_uri": "275", "zip_code": " SW3 1NE"}, 
  {"distance": 50, "users":["15", "13", "16"], "address": "13 New Row", "brand": "13", "city": "9", "id": "273", "lat": 51.511194, "lon": -0.126074, "name": "Costa Cafe", "products": ["40", "20"], "resource_uri": "273", "zip_code": "WC2N 4LF"}, 
  {"distance": 3, "users":["15", "13", "16"], "address": "118 King's Cross Road King's Cross", "brand": "13", "city": "9", "id": "272", "lat": 51.528529, "lon": -0.115695, "name": "Costa Cafe", "products": ["40"], "resource_uri": "272", "zip_code": "WC1X 9DS"}, 
  {"distance": 50, "users":["15", "13", "16"], "address": "39 Old Compton Street London Chinatown", "brand": "13", "city": "9", "id": "271", "lat": 51.512046, "lon": -0.129753, "name": "Costa Cafe", "products": ["20"], "resource_uri": "271", "zip_code": "W1D 5JX"}, 
  {"distance": 3, "users":["15", "13", "16"], "address": "8/10 Oxford Street Westminster", "brand": "12", "city": "9", "id": "265", "lat": 51.516383, "lon": -0.131045, "name": "Mcdonalds", "products": ["4"], "resource_uri": "265", "zip_code": "W1D 1AW"}, 
  {"distance": 50, "users":["15", "13", "16"], "address": "65 Duke Of York Square Chelsea", "brand": "6", "city": "9", "id": "247", "lat": 51.491443, "lon": -0.159392, "name": "Zara", "products": ["19"], "resource_uri": "247", "zip_code": "SW3 4LY"}, 
  {"distance": 3, "users":["15", "13", "16"], "address": "175 Tottenham Court Road Bloomsbury, London W1T 7NU, United Kingdom", "brand": "4", "city": "9", "id": "241", "lat": 51.522389, "lon": -0.135629, "name": "Starbucks", "products": ["12", "13"], "resource_uri": "241", "zip_code": "W1T 7NU"}, 
  {"distance": 50, "users":["15", "13", "16"], "address": "153 Concert Hall Approach", "brand": "19", "city": "9", "id": "282", "lat": 51.505017, "lon": -0.116069, "name": "The archduke", "products": ["26"], "resource_uri": "282", "zip_code": "SE1 8XU"}, 
  {"distance": 3, "users":["15", "13", "16"], "address": "Unit 5B (The Market), Covent Garden", "brand": "21", "city": "9", "id": "284", "lat": 51.512061, "lon": -0.122965, "name": "Casio London", "products": ["28"], "resource_uri": "284", "zip_code": "WC2E 8RA"}, 
  {"distance": 50, "users":["15", "13", "16"], "address": "Pizza Express Restaurants\u200e 147 Strand London, Greater", "brand": "15", "city": "9", "id": "276", "lat": 51.51157, "lon": -0.118355, "name": "Pizza Express", "products": ["22"], "resource_uri": "276", "zip_code": "WC2R 1JA"},
  {"distance": 3, "users":["15", "13", "16"], "address": "13 Exeter Street London", "brand": "16", "city": "9", "id": "279", "lat": 51.511652, "lon": -0.120356, "name": "Joe Allen", "products": ["23"], "resource_uri": "279", "zip_code": "WC2E 7DT"}, 
  {"distance": 50, "users":["15", "13", "16"], "address": "25 Catherine St., London, Greater London ", "brand": "17", "city": "9", "id": "280", "lat": 51.512567, "lon": -0.120512, "name": "Mishkin's", "products": ["24"], "resource_uri": "280", "zip_code": "WC2B 5JS"},
  {"distance": 3, "users":["15", "13", "16"], "address": "68/69 St Martins Lane, Westminster", "brand": "12", "city": "9", "id": "270", "lat": 51.511504, "lon": -0.127075, "name": "Mcdonalds", "products": ["30", "34", "43", "37", "38"], "resource_uri": "270", "zip_code": "WC2N 4JS"}, 
  {"distance": 50, "users":["15", "13", "16"], "address": "241 City Road, Islington", "brand": "12", "city": "9", "id": "268", "lat": 51.529169, "lon": -0.095226, "name": "Mcdonalds", "products": ["30"], "resource_uri": "268", "zip_code": "EC1V 1JQ"}, 
  {"distance": 3, "users":["15", "13", "16"], "address": "9-12 Bow Street City of Westminster, ", "brand": "15", "city": "9", "id": "277", "lat": 51.513515, "lon": -0.122804, "name": "Pizza Express", "products": ["22"], "resource_uri": "277", "zip_code": "WC2E 7AH"},
  {"distance": 50, "users":["15", "13", "16"], "address": "80-81 Saint Martin's Lane London, City of London, Greater London ,", "brand": "15", "city": "9", "id": "278", "lat": 51.511366, "lon": -0.127283, "name": "Pizza Express", "products": ["22"], "resource_uri": "278", "zip_code": "WC2N 4AA"}
];


Yn.VenueUser.FIXTURES = [];

Yn.Product.FIXTURES = [
  {"has_voted": true, "like_count": 1, "comment_count": 1, "brand": "14", "category": "6", "description": "", "icon": "K", "id": "41", "name": "Armani GiftCard", "picture": "./assets/fixtures/products/yoin_card_10.png", "price": 10.0, "resource_uri": "41"}, 
  {"has_voted": true, "like_count": 0, "comment_count": 1, "brand": "16", "category": "1", "description": "", "icon": "l", "id": "23", "name": "Joe Allen", "picture": "./assets/fixtures/products/restaurant.png", "price": 25.0,  "resource_uri": "23"}, 
  {"has_voted": true, "like_count": 5, "comment_count": 1, "brand": "12", "category": "1", "description": "", "icon": "f", "id": "37", "name": "Mcdonalds Burguer", "picture": "./assets/fixtures/products/mcdonalds_hamburguesa.png", "price": 5.0,  "resource_uri": "37"}, 
  {"has_voted": true, "like_count": 4, "comment_count": 1, "brand": "12", "category": "5", "description": "", "icon": "R", "id": "30", "name": "2x1 Mcdonalds Big Mac", "picture": "./assets/fixtures/products/mcdonalds_big_mac.png", "price": 5.0,  "resource_uri": "30"}, 
  {"has_voted": true, "like_count": 3, "comment_count": 1, "brand": "18", "category": "6", "description": "", "icon": "K", "id": "42", "name": "Yacht London Giftcard", "picture": "./assets/fixtures/products/yoin_card_10.png", "price": 10.0, "resource_uri": "42"}, 
  {"has_voted": true, "like_count": 2, "comment_count": 1, "brand": "20", "category": "6", "description": "", "icon": "K", "id": "32", "name": "Tattershall Gift Card", "picture": "./assets/fixtures/products/yoin_card_10.png", "price": 10.0,  "resource_uri": "32"}, 
  {"has_voted": true, "like_count": 1, "comment_count": 1, "brand": "2", "category": "1", "description": "", "icon": "w", "id": "6", "name": "Brownie", "picture": "./assets/fixtures/products/brownie.png", "price": 12.0,  "resource_uri": "6"}, 
  {"has_voted": true, "like_count": 2, "comment_count": 1, "brand": "15", "category": "1", "description": "", "icon": "l", "id": "22", "name": "30 % Pizza Express", "picture": "./assets/fixtures/products/30_pizza_express.png", "price": 7.0,  "resource_uri": "22"}, 
  {"has_voted": true, "like_count": 8, "comment_count": 1, "brand": "6", "category": "5", "description": "", "icon": "R", "id": "19", "name": "10\u00a3 off Purse Zara", "picture": "./assets/fixtures/products/purse_zara.png", "price": 20.0,  "resource_uri": "19"},
  {"has_voted": true, "like_count": 1, "comment_count": 1, "brand": "13", "category": "5", "description": "", "icon": "d", "id": "35", "name": "Costa Cafe", "picture": "./assets/fixtures/products/coffe_costa_cafe.png", "price": 4.0,  "resource_uri": "35"}, 
  {"has_voted": true, "like_count": 9, "comment_count": 1, "brand": "6", "category": "3", "description": "", "icon": "j", "id": "31", "name": "Suit jacket Zara", "picture": "./assets/fixtures/products/suit_jacket_zara.png", "price": 29.0, "resource_uri": "31"}, 
  {"has_voted": true, "like_count": 3, "comment_count": 1, "brand": "2", "category": "1", "description": "", "icon": "w", "id": "36", "name": "Burguer King Ice Cream", "picture": "./assets/fixtures/products/burguer_king_helado.png", "price": 2.0,  "resource_uri": "36"}, 
  {"has_voted": true, "like_count": 3, "comment_count": 1, "brand": "4", "category": "5", "description": "", "icon": "R", "id": "12", "name": "50% Coffe Starbucks", "picture": "./assets/fixtures/products/starbucks_cafe.png", "price": 10.0,  "resource_uri": "12"}, 
  {"has_voted": true, "like_count": 7, "comment_count": 1, "brand": "21", "category": "3", "description": "", "icon": "j", "id": "28", "name": "Casio watch", "picture": "./assets/fixtures/products/watch_casio_london.png", "price": 55.0,  "resource_uri": "28"}, 
  {"has_voted": true, "like_count": 9, "comment_count": 1, "brand": "20", "category": "4", "description": "", "icon": "n", "id": "27", "name": "Tattershall Castle Drink", "picture": "./assets/fixtures/products/drinks.png", "price": 12.0,  "resource_uri": "27"}, 
  {"has_voted": true, "like_count": 6, "comment_count": 1, "brand": "17", "category": "1", "description": "", "icon": "l", "id": "24", "name": "Mishkin's ", "picture": "./assets/fixtures/products/restaurant.png", "price": 20.0,  "resource_uri": "24"}, 
  {"has_voted": true, "like_count": 1, "comment_count": 1, "brand": "13", "category": "2", "description": "", "icon": "d", "id": "20", "name": "Coffe Costa Cafe", "picture": "./assets/fixtures/products/coffe_costa_cafe.png", "price": 4.0,  "resource_uri": "20"}, 
  {"has_voted": true, "like_count": 3, "comment_count": 1, "brand": "14", "category": "3", "description": "", "icon": "j", "id": "21", "name": "Armani Jeans", "picture": "./assets/fixtures/products/armani_jeans.png", "price": 120.0,  "resource_uri": "21"}, 
  {"has_voted": true, "like_count": 6, "comment_count": 1, "brand": "12", "category": "6", "description": "", "icon": "K", "id": "38", "name": "Mcdonalds Giftcard", "picture": "./assets/fixtures/products/yoin_card_10.png", "price": 10.0,  "resource_uri": "38"}, 
  {"has_voted": true, "like_count": 5, "comment_count": 1, "brand": "18", "category": "4", "description": "", "icon": "R", "id": "25", "name": "2x1 Yacht London", "picture": "./assets/fixtures/products/restaurant.png", "price": 10.0,  "resource_uri": "25"}, 
  {"has_voted": true, "like_count": 4, "comment_count": 1, "brand": "19", "category": "4", "description": "", "icon": "l", "id": "26", "name": "The Archduke's Menu", "picture": "./assets/fixtures/products/restaurant.png", "price": 9.0,  "resource_uri": "26"}, 
  {"has_voted": true, "like_count": 3, "comment_count": 1, "brand": "4", "category": "6", "description": "lala", "icon": "K", "id": "39", "name": "Starbucks Giftcard", "picture": "./assets/fixtures/products/yoin_card_10.png", "price": 10.0,  "resource_uri": "39"}, 
  {"has_voted": true, "like_count": 2, "comment_count": 1, "brand": "4", "category": "5", "description": "", "icon": "R", "id": "33", "name": "10% off Mocha Coffe", "picture": "./assets/fixtures/products/starbucks_mocha.png", "price": 5.0,  "resource_uri": "33"}, 
  {"has_voted": true, "like_count": 7, "comment_count": 1, "brand": "13", "category": "6", "description": "m", "icon": "K", "id": "40", "name": "Costa Cafe Giftcard", "picture": "./assets/fixtures/products/yoin_card_10.png", "price": 10.0,  "resource_uri": "40"},
  {"has_voted": true, "like_count": 9, "comment_count": 1, "brand": "4", "category": "2", "description": "", "icon": "d", "id": "13", "name": "Mocha Coffe", "picture": "./assets/fixtures/products/starbucks_mocha.png", "price": 10.0,  "resource_uri": "13"}, 
  {"has_voted": true, "like_count": 8, "comment_count": 1, "brand": "12", "category": "5", "description": "", "icon": "w", "id": "34", "name": "Brownie Mcdonalds", "picture": "./assets/fixtures/products/brownie.png", "price": 4.0,  "resource_uri": "34"}, 
  {"has_voted": true, "like_count": 2, "comment_count": 1, "brand": "2", "category": "5", "description": "", "icon": "R", "id": "4", "name": "Free Whopper", "picture": "./assets/fixtures/products/40_burger_king_menu.png", "price": 10.0,  "resource_uri": "4"}, 
  {"has_voted": true, "like_count": 1, "comment_count": 1, "brand": "12", "category": "2", "description": "", "icon": "d", "id": "43", "name": "Mcdonalds Coffe", "picture": "./assets/fixtures/products/mcdonalds_coffe.png", "price": 5.0,  "resource_uri": "43"}
];

Yn.User.FIXTURES = [
  {"city": "9", "id": "17", "name": "Keny West", "avatar": "./assets/images/ella.jpg", "status": "Disponible"}, 
  {"city": null, "id": "15", "name": "Empty1", "avatar": "http://flickholdr.com/48/48/jayz/bw", "status": "Disponible"},
  {"city": "9", "id": "3", "name": "Ale Lopez", "avatar": "http://flickholdr.com/48/48/jayz/bw", "status": "Disponible"}, 
  {"city": "9", "id": "11", "name": "Diego Escalante", "avatar": "http://flickholdr.com/48/48/jayz/bw", "status": "Disponible"},
  {"city": "9", "id": "16", "name": "Carlos Lagares", "avatar": "http://flickholdr.com/48/48/jayz/bw", "status": "Disponible"}, 
  {"city": "9", "id": "5", "name": "Edipotrebol", "avatar": "http://flickholdr.com/48/48/jayz/bw", "status": "Disponible"},
  {"city": "9", "id": "14", "name": "Empty2", "avatar": "http://flickholdr.com/48/48/jayz/bw", "status": "Disponible"},
  {"city": "9", "id": "2", "name": "Pepe Cano", "avatar": "http://flickholdr.com/48/48/jayz/bw", "status": "Disponible"}
];

var date = "Sat, 31 Dec 2011 00:08:16 GMT";

Yn.Invitation.FIXTURES = [
  {"id": "1", "consumed": false, "created_at": date, "dateConsumed": null,  "from_user": "17", "product": "41", "to_user": "16", "transaction_id": "000056-0011", "venue_user": null},
  {"id": "2", "consumed": false, "created_at": date, "dateConsumed": null,  "from_user": "16", "product": "43", "to_user": "17", "transaction_id": "000057-0011", "venue_user": null},
  {"id": "3", "consumed": false, "created_at": date, "dateConsumed": null,  "from_user": "16", "product": "41", "to_user": "17", "transaction_id": "000058-0011", "venue_user": null}
];


//var date = new Date("Sat, 31 Dec 2011 00:08:16 GMT");

Yn.Like.FIXTURES = [
  { "id": "1", "user": "17", "created_at": date, "product": null, "venue": "236" },
  { "id": "2", "user": "17", "created_at": date, "product": "20", "venue": null },
  { "id": "3", "user": "17", "created_at": date, "product": "23", "venue": null }
];

Yn.Comment.FIXTURES = [
  { "id": "1", "user": "17", "created_at": date, "product": "24", "venue": null, "description": " Hola hoal ahoala hoala hola jola" },
  { "id": "2", "user": "17", "created_at": date, "product": null, "venue": "236", "description": " Hola hoal ahoala hoala hola jola" },
  { "id": "3", "user": "17", "created_at": date, "product": null, "venue": "235", "description": " Hola hoal ahoala hoala hola jola" }
];


Yn.Activity.FIXTURES = [
  { "id": "1", "like": "1", "comment": null, "invitation":null },
  { "id": "2", "like": "2", "comment": null, "invitation":null },
  { "id": "3", "like": "3", "comment": null, "invitation":null },
  { "id": "4", "like": null, "comment": "1", "invitation":null },
  { "id": "5", "like": null, "comment": "2", "invitation":null },
  { "id": "6", "like": null, "comment": "3", "invitation":null },
  { "id": "7", "like": null, "comment": null, "invitation":"1" },
  { "id": "8", "like": null, "comment": null, "invitation":"2" }
];

});