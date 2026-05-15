'use client'
export const SCENARIO = {
  name: 'Bangalore Flood Emergency',
  active_disaster: 'Flash Flood · Bangalore North',
  hebbal_water_rate_cm_per_min: 8,
  spread_vector: 'North-East toward Yelahanka',
  flood_eta_yelahanka_min: 47,
  affected_people: 12400,
  wind_kmph: 67,
  wind_direction: 'SW',
  rainfall_mm_last_3h: 84,
  rescue_teams: ['NDRF Alpha', 'Med Echo', 'KSP Delta'],
  shelters: ['Yelahanka Community Hall', 'Hebbal Stadium', 'Mekhri Circle School', 'Sankey Tank Ground', 'RT Nagar Sports Complex'],
  hebbal_pos: [13.0358, 77.5970],
  yelahanka_pos: [13.1007, 77.5963],
  hazard_polygon_start: [
    [13.040, 77.585], [13.045, 77.605], [13.040, 77.612], [13.030, 77.610],
    [13.025, 77.600], [13.028, 77.588]
  ],
  hazard_polygon_end: [
    [13.110, 77.580], [13.115, 77.620], [13.090, 77.635], [13.050, 77.640],
    [13.020, 77.625], [13.010, 77.595], [13.030, 77.575], [13.080, 77.570]
  ],
  shelter_pins: [
    { name: 'Yelahanka Community Hall', pos: [13.1066, 77.6080], cap: 1600 },
    { name: 'Hebbal Stadium', pos: [13.0480, 77.6230], cap: 2200 },
    { name: 'Mekhri Circle School', pos: [13.0190, 77.5840], cap: 900 },
    { name: 'Sankey Tank Ground', pos: [13.0078, 77.5751], cap: 1100 },
    { name: 'RT Nagar Sports Complex', pos: [13.0270, 77.6020], cap: 1300 },
  ],
  rescue_pins: [
    { name: 'NDRF Alpha', pos: [13.1007, 77.5963], type: 'Heavy Rescue', status: 'DEPLOYED' },
    { name: 'Med Echo', pos: [13.0358, 77.5970], type: 'Field Hospital', status: 'DEPLOYED' },
    { name: 'KSP Delta', pos: [13.0190, 77.5840], type: 'Crowd Control', status: 'DEPLOYED' },
  ],
  // approximate Bangalore North bounding box
  bn_bbox: { latMin: 12.97, latMax: 13.15, lngMin: 77.52, lngMax: 77.70 },
}
