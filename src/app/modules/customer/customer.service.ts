import { OwnerRegistration } from '../ownerRegistration/ownerRegistration.model';

const getAllRecommendOwnerFromDB = async (query: Record<string, unknown>) => {
  let baseQuery: any = { isDeleted: false };

  // 📍 Geo Location Filter (5km default)
  if (query.coordinates) {
    const [lng, lat] = (query.coordinates as string)
      .split(',')
      .map((v) => Number(v.trim()));

    if (!isNaN(lng) && !isNaN(lat)) {
      const radiusKm = query.radius ? Number(query.radius) : 5; // default = 5km
      const maxDistance = radiusKm * 1000; // km → meters

      baseQuery.location = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [lng, lat],
          },
          $maxDistance: maxDistance,
        },
      };
    }
  }

  // 🔎 Simple Query (No pagination)
  const result = await OwnerRegistration.find(baseQuery).populate({
    path: 'user',
    select: '-password -needsPasswordChange',
  });

  return result;
};

export const CustomerService = {
  getAllRecommendOwnerFromDB,
};
