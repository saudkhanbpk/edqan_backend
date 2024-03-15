import profileViewsModel from "../models/profileViews.model.js";

//analytics
// make function return count of users who viewed a profile in a time range
async function findAllUsersWhoViewedAProfile(userId, startDate, endDate) {
  return await profileViewsModel
    .find({
      user: userId,
      "views.date": {
        $gte: new Date(startDate).toISOString(),
        $lte: new Date(endDate).toISOString(),
      },
    })
    .countDocuments();
}
async function createOrUpdateProfileView(query) {
  const currentDate = new Date();
  let result = await profileViewsModel.findById(query.userId);

  if (result) {
    // Update existing profile view
    result.views.push({ date: currentDate });
    result = await result.save();
  } else {
    // Create new profile view
    let user = query.userId;
    result = await profileViewsModel.create({
      user,
      views: [{ date: currentDate }],
    });
  }
}

export default { findAllUsersWhoViewedAProfile, createOrUpdateProfileView };
