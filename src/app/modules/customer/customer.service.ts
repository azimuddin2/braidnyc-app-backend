import { FreelancerRegistration } from '../freelancerRegistration/freelancerRegistration.model';
import { OwnerRegistration } from '../ownerRegistration/ownerRegistration.model';

const getAllRecommendOwnerFromDB = async (query: Record<string, unknown>) => {
  let baseQuery: any = { isDeleted: false };

  // 📍 Geo Location Filter (5km default)
  if (query.coordinates) {
    const [lng, lat] = (query.coordinates as string)
      .split(',')
      .map((v) => Number(v.trim()));

    if (!isNaN(lng) && !isNaN(lat)) {
      const radiusKm = query.radius ? Number(query.radius) : 10; // default = 10km
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

const getTopFeaturedStylistFromDB = async () => {
  const [topOwner] = await FreelancerRegistration.aggregate([
    // 1️⃣ Match only active owners
    { $match: { isDeleted: false } },

    // 2️⃣ Populate user info
    {
      $lookup: {
        from: 'users',
        localField: 'user',
        foreignField: '_id',
        as: 'user',
      },
    },
    { $unwind: '$user' },

    // 3️⃣ Lookup reviews
    {
      $lookup: {
        from: 'reviews',
        localField: '_id',
        foreignField: 'owner',
        as: 'reviews',
      },
    },

    // 4️⃣ Add reviewCount & avgRating
    {
      $addFields: {
        reviewCount: { $size: '$reviews' },
        avgRating: {
          $cond: [
            { $gt: [{ $size: '$reviews' }, 0] },
            { $avg: '$reviews.rating' },
            0,
          ],
        },
      },
    },

    // 5️⃣ Sort by reviewCount DESC, then avgRating DESC
    { $sort: { reviewCount: -1, avgRating: -1 } },

    // 6️⃣ Take only the top profile
    { $limit: 1 },

    // 7️⃣ Remove unnecessary fields
    {
      $project: {
        reviews: 0,
        'user.password': 0,
        'user.needsPasswordChange': 0,
      },
    },
  ]);

  return topOwner;
};

export const CustomerService = {
  getAllRecommendOwnerFromDB,
  getTopFeaturedStylistFromDB,
};
