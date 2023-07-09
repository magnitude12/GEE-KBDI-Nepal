var aoi = geometry;
//coordinates as an import directly to gee (through a polygon selector later edited to fit bounds)
/*type: Polygon
coordinates: List (1 element)
0: List (5 elements)
0: [78.58198600305957,24.218427667660116]
1: [90.93061881555957,24.218427667660116]
2: [90.93061881555957,33.03769366744443]
3: [78.58198600305957,33.03769366744443]
4: [78.58198600305957,24.218427667660116]
geodesic: false */
Map.addLayer(aoi, {}, 'Nepal');
Map.setCenter(86.81, 28.33, 7);

// Range of time
var end = ee.Date(new Date());
var start = end.advance(-7, 'day');

// Load KBDI collection and filter according to data collection type
var s1 = ee.ImageCollection('UTOKYO/WTLAB/KBDI/v1')
  .filterBounds(aoi)
  .filterDate(start, end)
  .select('KBDI');
  
var S1 = s1.map(function(image) { return image.clip(aoi); });

var palette = [
  "001a4d", "003cb3", "80aaff", "336600", "cccc00", "cc9900", "cc6600",
  "660033"
];
var op = 1.0;

// Add first image to map to get an idea of what a KBDI image looks like  
Map.addLayer(S1.sort('system:time_start', false).limit(1), { min: 0, max: 800, opacity: op, palette: palette }, 'KBDI Drought Index');

// Create a GIF client-side and display it
var gifParams = {
  'region': aoi,
  'scale': 550, // Increase the scale to reduce the number of pixels
  'framesPerSecond': 1
};

var mask = S1.map(function(image) {
  return image.visualize({ min: 0, max: 800, palette: palette });
});

var gif = mask.getVideoThumbURL(gifParams);

print('Generated GIF:', gif);
