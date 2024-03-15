import { mentorRepo, userRepo, meetingDurationRepo, meetingRepo, profileViewsRepo } from "../data-access-layer/index.js";
import meetingModel from "../data-access-layer/models/meeting.model.js";
import meetingDurationModel from "../data-access-layer/models/meetingDuration.model.js";
import { makeMentor } from "../entities/index.js";
import { differenceInMinutes, format } from "date-fns";

async function createMentorUseCase(mentorInfo) {
  if (mentorInfo.industries) mentorInfo.industries = JSON.parse(mentorInfo?.industries);
  if (mentorInfo.majors) mentorInfo.majors = JSON.parse(mentorInfo?.majors);
  // if (mentorInfo.major) mentorInfo.major = JSON.parse(mentorInfo?.major);
  if (mentorInfo.mentorShipTypes) mentorInfo.mentorShipTypes = JSON.parse(mentorInfo?.mentorShipTypes);
  if (mentorInfo.featuredAsPublic) mentorInfo.featuredAsPublic = JSON.parse(mentorInfo?.featuredAsPublic);
  if (mentorInfo.agreeToTerms) mentorInfo.agreeToTerms = JSON.parse(mentorInfo?.agreeToTerms);
  if (mentorInfo.countries) mentorInfo.countries = JSON.parse(mentorInfo?.countries);
  if (mentorInfo.areaOfInterest) mentorInfo.areaOfInterest = JSON.parse(mentorInfo?.areaOfInterest);
  const newMentor = await makeMentor({
    ...mentorInfo,
    _id: mentorInfo.subModel,
  });
  return await mentorRepo.insert(newMentor);
}

async function getMentorsUseCase(query, paginationQuery) {
  const UpdateMentors = await mentorRepo.findAllWithoutPopulate();

  const currentDate = new Date();


  // Update availability time for each mentor
  let mentors = UpdateMentors.map((mentor) => {
    mentor.availabilityTime = mentor.availabilityTime.filter((slotDate) => {
      // Remove the entire slot if the date is less than the current date
      if (slotDate < currentDate) {
        return false;
      }

      return true;
    });

    // return
    mentorRepo.updateById(mentor._id, mentor);
  });
  return await mentorRepo.findAllWithAvaTime(query?.mentorShipType, query?.preferredLanguage, paginationQuery);
}

async function getMentorsConnectionUseCase(userId, query, paginationQuery) {
  return await mentorRepo.findAllConnection(userId, query?.almaMater, query?.major, query?.industry, query?.areaOfInterest, paginationQuery);
}

async function getMentorByIdUseCase(mentorId) {
  return await mentorRepo.findById(mentorId);
}

async function updateMentorByIdUseCase(mentorId, mentorInfo) {

  //loop over mentorInfo and check if any field is empty then set it to undefined
  for (const [key, value] of Object.entries(mentorInfo)) {
    if (value == ''||value == 'null'||value == null) {
      if(mentorInfo[key] == 'educationLevel')
      {
        mentorInfo[key] = null
      }
      if(mentorInfo[key] == 'almaMater')
      {
        mentorInfo[key] = null
      }
      else{
        mentorInfo[key] = null
      }
    }
  }

  let mentor = await mentorRepo.findByIdWithOutPopulation(mentorId);

  if (mentorInfo.industries) mentorInfo.industries = JSON.parse(mentorInfo?.industries);
  if (mentorInfo.majors) mentorInfo.majors = JSON.parse(mentorInfo?.majors);
  if (mentorInfo.mentorShipTypes) mentorInfo.mentorShipTypes = JSON.parse(mentorInfo?.mentorShipTypes);
  if (mentorInfo.featuredAsPublic) mentorInfo.featuredAsPublic = JSON.parse(mentorInfo?.featuredAsPublic);
  if (mentorInfo.agreeToTerms) mentorInfo.agreeToTerms = JSON.parse(mentorInfo?.agreeToTerms);
  if (mentorInfo.countries) mentorInfo.countries = JSON.parse(mentorInfo?.countries);
  if (mentorInfo.mentoringLanguages) mentorInfo.mentoringLanguages = JSON.parse(mentorInfo?.mentoringLanguages);
  if (mentorInfo.addresses) mentorInfo.addresses = JSON.parse(mentorInfo?.addresses);

  if (mentorInfo.areaOfInterest) mentorInfo.areaOfInterest = JSON.parse(mentorInfo?.areaOfInterest);

  // if (mentorInfo.availabilityTime) mentorInfo.availabilityTime = JSON.parse(mentorInfo?.availabilityTime);
  if (mentorInfo?.graduationDate == 'null' || mentorInfo?.graduationDate == null) {
    mentorInfo.graduationDate = undefined
  }
  // if (mentorInfo?.almaMater == 'null' || mentorInfo?.almaMater == null) {
  //   mentorInfo.almaMater = undefined
  // }
  let newMentor = { ...mentor, ...mentorInfo, _id: mentorId };
  const checkMentor = await makeMentor(newMentor);
  return await mentorRepo.updateById(mentorId, checkMentor);
}

async function addAvailabilityMentorByIdUseCase(userId, mentorInfo) {
  let mentor = await mentorRepo.findByUserWithOutPopulation(userId);

  if (!Array.isArray(mentor.availabilityTime)) mentor.availabilityTime = [];

  const mentorAVTimes = mentor.availabilityTime;

  const mentorInfoDateStr = mentorInfo.availabilityTime; // Date string in "yyyy-MM-ddTHH:mm:ss" format
  const mentorInfoDate = new Date(mentorInfoDateStr);

  // Check if the date and time already exists
  const existingMentorAVTime = mentorAVTimes.find((mentorAVTime) => {
    return mentorAVTime.getTime() === mentorInfoDate.getTime();
  });

  if (existingMentorAVTime) {
    throw new Error("Availability for this date and time already exists.");
  }

  // Check if the provided date is in the past
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  if (mentorInfoDate < currentDate) {
    throw new Error("Date must be greater than or equal to the current date.");
  }


  const currentDateTime = new Date();
  // Check if the dates are equal
  const mentorDateStr = mentorInfoDate.toISOString().substring(0, 10);
  const currentDateStr = currentDateTime.toISOString().substring(0, 10);

  if (mentorDateStr == currentDateStr) {
    // Extract time components from the Date objects
    const mentorInfoHours = mentorInfoDate.getUTCHours();
    const mentorInfoMinutes = mentorInfoDate.getUTCMinutes();

    const currentHours = currentDateTime.getUTCHours();
    const currentMinutes = currentDateTime.getUTCMinutes();

    // Compare the time components
    if (mentorInfoHours < currentHours || (mentorInfoHours === currentHours && mentorInfoMinutes <= currentMinutes)) {
      throw new Error("Time must be greater than the current time.");
    }



  }



  // meeting duration
  const meetingDuration = await meetingDurationModel.find();
  const meetingDurationTime = meetingDuration[0].durationMinutes;
  // Define insertIndex and set it to -1
  let insertIndex = -1;
  if (mentorAVTimes.length > 0) {
    // Sort the existing dates in ascending order
    mentorAVTimes.sort((a, b) => a - b);



    // Find the index where the new date should be inserted
    insertIndex = mentorAVTimes.findIndex((date) => date > mentorInfoDate);

    if (insertIndex === -1) {
      // If insertIndex is -1, the new date should be inserted at the end
      insertIndex = mentorAVTimes.length;
    }

    if (insertIndex > 0) {
      const prevDate = mentorAVTimes[insertIndex - 1];
      const timeDifference = (mentorInfoDate.getTime() - prevDate.getTime()) / (1000 * 60);

      if (timeDifference < meetingDurationTime) {
        throw new Error("Time must be at least " + meetingDurationTime + " minutes after the previous time.");
      }
    }

    if (insertIndex < mentorAVTimes.length) {
      const nextDate = mentorAVTimes[insertIndex];
      const timeDifference = (nextDate.getTime() - mentorInfoDate.getTime()) / (1000 * 60);

      if (timeDifference < meetingDurationTime) {
        throw new Error("Time must be at least " + meetingDurationTime + " minutes before the next time.");
      }
    }
  }
  // Check if the day has more than 5 different times
  const mentorInfoDateDay = mentorInfoDate.toISOString().substring(0, 10);
  const timesOnSameDay = mentorAVTimes.filter((date) => date.toISOString().substring(0, 10) === mentorInfoDateDay);

  if (timesOnSameDay.length >= 5) {
    throw new Error("A day cannot have more than 5 different times.");
  }

  // Check if the date is within 2 months from the current date
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 2);

  if (mentorInfoDate > maxDate) {
    throw new Error("Availability time cannot be stored more than 2 months later from the current month.");
  }

  // Insert the new date into the sorted array
  mentorAVTimes.splice(insertIndex, 0, mentorInfoDate);

  return await mentorRepo.updateWithoutPopulate(mentor._id, {
    availabilityTime: mentorAVTimes,
  });
}














async function findMentorshipSessionByMentorAndDateUseCase(mentorId, query) {
  return await meetingRepo.findMentorshipSessionByMentorAndDate(mentorId, query.startDate, query.endDate, query.status);
}

async function findAllUsersWhoViewedAProfileUseCase(mentorId, query) {
  return await profileViewsRepo.findAllUsersWhoViewedAProfile(mentorId, query.startDate, query.endDate);
}

//latest meeting where mentorShipSession status is ongoing
async function findByMentorOngoingSessionsUseCase(mentorId, query) {
  return await meetingRepo.findByMentorOngoingSessions(mentorId, query);
}

async function findByMentorSessionsUseCase(mentorId, query) {
  return await meetingRepo.findByMentorSessions(mentorId, query);
}

async function removeDateFromMentorAvailability(userId, dateIndex) {
  let mentor = await mentorRepo.findByUserWithOutPopulation(userId);

  if (!Array.isArray(mentor.availabilityTime)) mentor.availabilityTime = [];

  if (dateIndex < 0 || dateIndex >= mentor.availabilityTime.length) {
    throw new Error("Invalid date index.");
  }

  // Remove the date at the specified index
  mentor.availabilityTime.splice(dateIndex, 1);

  // Update the mentor's availability time
  return await mentorRepo.updateWithoutPopulate(mentor._id, {
    availabilityTime: mentor.availabilityTime,
  });
}






export default {
  createMentorUseCase,
  getMentorsUseCase,
  getMentorByIdUseCase,
  updateMentorByIdUseCase,
  addAvailabilityMentorByIdUseCase,
  getMentorsConnectionUseCase,
  findMentorshipSessionByMentorAndDateUseCase,
  findAllUsersWhoViewedAProfileUseCase,
  findByMentorOngoingSessionsUseCase,
  findByMentorSessionsUseCase,
  removeDateFromMentorAvailability
};
