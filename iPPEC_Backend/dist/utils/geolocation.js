// src/utils/geolocation.ts
const toRadians = (degree) => {
    return degree * (Math.PI / 180);
};
/**
 * Calculates the great-circle distance between two points on the Earth using the Haversine formula.
 * @returns Distance in kilometers.
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
    if (lat2 === null || lon2 === null)
        return Infinity;
    const R = 6371; // Earth's radius in km
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};
/**
 * Calculates a simple, practical bounding box for small-radius searches.
 * @returns An object with min/max latitude and longitude.
 */
export const calculateSimpleBoundingBox = (lat, lon, radiusKm) => {
    const lat_degree_km = 111.32;
    const lon_degree_km = lat_degree_km * Math.cos(toRadians(lat));
    const latDelta = radiusKm / lat_degree_km;
    const lonDelta = radiusKm / lon_degree_km;
    return {
        minLat: lat - latDelta,
        maxLat: lat + latDelta,
        minLon: lon - lonDelta,
        maxLon: lon + lonDelta,
    };
};
//# sourceMappingURL=geolocation.js.map