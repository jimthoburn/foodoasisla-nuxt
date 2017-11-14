
// Define the icons
const MARKER_OPTIONS = {
  'Community Garden': {
    // Specify a class name we can refer to in CSS.
    className: 'community-garden-marker',
    // Set marker width and height
    iconSize: [30, 46],
    iconAnchor: [15, 40],
    popupAnchor: [0, -23]
  },
  'Farmers Market': {
    // Specify a class name we can refer to in CSS.
    className: 'farmers-market-marker',
    // Set marker width and height
    iconSize: [30, 46],
    iconAnchor: [15, 40],
    popupAnchor: [0, -23]
  },
  'Food Pantry': {
    // Specify a class name we can refer to in CSS.
    className: 'food-pantry-marker',
    // Set marker width and height
    iconSize: [30, 46],
    iconAnchor: [15, 40],
    popupAnchor: [0, -23]
  },
  'Orchard': {
    // Specify a class name we can refer to in CSS.
    className: 'orchard-marker',
    // Set marker width and height
    iconSize: [30, 46],
    iconAnchor: [15, 40],
    popupAnchor: [0, -23]
  },
  'Pop Up Market': {
    // Specify a class name we can refer to in CSS.
    className: 'pop-up-market-marker',
    // Set marker width and height
    iconSize: [30, 46],
    iconAnchor: [15, 40],
    popupAnchor: [0, -23]
  },
  'Restaurant': {
    // Specify a class name we can refer to in CSS.
    className: 'restaurant-marker',
    // Set marker width and height
    iconSize: [30, 46],
    iconAnchor: [15, 40],
    popupAnchor: [0, -23]
  },
  'Summer Lunch': {
    // Specify a class name we can refer to in CSS.
    className: 'summer-lunch-marker',
    // Set marker width and height
    iconSize: [30, 46],
    iconAnchor: [15, 40],
    popupAnchor: [0, -23]
  },
  'Supermarket': {
    // Specify a class name we can refer to in CSS.
    className: 'farmers-market-marker',
    // Set marker width and height
    iconSize: [30, 46],
    iconAnchor: [15, 40],
    popupAnchor: [0, -23]
  },
  'Cultivate LA': {
    // Specify a class name we can refer to in CSS.
    className: 'cultivate-la-marker',
    // Set marker width and height
    iconSize: [30, 46],
    iconAnchor: [15, 40],
    popupAnchor: [0, -23]
  }
}

const FOOD_DESERTS_SOURCE = {
  'type': 'vector',
  'url': 'mapbox://foodoasisla.d040onrj'
}

const FOOD_DESERTS_LAYER = {
  'id': 'Food Deserts',
  'type': 'fill',
  'source': 'Food Deserts',
  'layout': {
    'visibility': 'visible'
  },
  'paint': {
    'fill-color': '#FF0000',
    'fill-opacity': 0.1
  },
  'filter': ['==', 'LI LA De_4', '1'],
  'source-layer': 'USDA_Food_Desert_Tracts_2010-65gavx'
}

// Los Angeles County boundaries
const MAP_BOUNDS = [
  [-119.9442369, 32.7089729], // Southwest coordinates
  [-116.63282912, 35.8275538] // Northeast coordinates
]

const MAP_STYLE = 'mapbox://styles/mapbox/basic-v9'

export default { MARKER_OPTIONS, FOOD_DESERTS_SOURCE, FOOD_DESERTS_LAYER, MAP_BOUNDS, MAP_STYLE }
