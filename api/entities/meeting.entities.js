import { isNumeric, isAlphaNumeric, isValidUrl, isValidDate, isObjectId, isEmail } from "../helper/validation.js";
import { trimAndRemoveSpaces, toBoolean } from "../helper/helper.js";
import { RequiredParameterError, InvalidPropertyError } from "../error/errors.js";
import meetingStatusEnum from "../types/meetingStatus.enum.js";
import meetingTypeEnum from "../types/meetingType.enum.js";
import meetingDurationModel from "../data-access-layer/models/meetingDuration.model.js";

let meetingDurationTime = await meetingDurationModel.find();
meetingDurationTime = meetingDurationTime[0]?.durationMinutes;

function makeMeeting({ user1, user2, date, mentorShipSession, status, meetingType, startTime, endTime, duration = meetingDurationTime }) {
  //#region user validation
  if (typeof user1 === "object") {
    if (!user1.user) throw new RequiredParameterError("user");
    if (!isObjectId(user1.user)) throw new InvalidPropertyError("enter a valid user ID");

    // user1.userUrl = trimAndRemoveSpaces(user2.userUrl);
  }

  if (typeof user2 === "object") {
    if (!user2.user) throw new RequiredParameterError("user");
    if (!isObjectId(user2.user)) throw new InvalidPropertyError("enter a valid user ID");

    // user2.userUrl = trimAndRemoveSpaces(user2.userUrl);
  }

  //#endregion user validation

  //#region meetingType validation
  meetingType = trimAndRemoveSpaces(meetingType);
  if (!meetingType) throw new RequiredParameterError(" meetingType");
  if (!Object.values(meetingTypeEnum).includes(meetingType)) throw new InvalidPropertyError("enter a valid  meetingType");
  //#endregion meetingType validation

  //#region status validation
  if (status) {
    status = trimAndRemoveSpaces(status);
    if (!Object.values(meetingStatusEnum).includes(status))
      throw new InvalidPropertyError("enter a valid  status");
  }
  //#endregion status validation

  if (meetingType == meetingTypeEnum.SESSION) {
    if (typeof mentorShipSession === "object") {
      //#region mentorShipType validation
      if (mentorShipSession.mentorShipType) {
        mentorShipSession.mentorShipType = trimAndRemoveSpaces(mentorShipSession.mentorShipType);
        if (!mentorShipSession.mentorShipType) throw new RequiredParameterError("mentor ship type");
        if (!isObjectId(mentorShipSession.mentorShipType)) throw new InvalidPropertyError("enter a valid mentor ship type ID");
      }
      //#endregion mentorShipType validation

      //#region preferredLanguage validation
      mentorShipSession.preferredLanguage = trimAndRemoveSpaces(mentorShipSession.preferredLanguage);
      if (!mentorShipSession.preferredLanguage) throw new RequiredParameterError("preferred Language");
      if (!isObjectId(mentorShipSession.preferredLanguage)) throw new InvalidPropertyError("enter a valid preferred Language ID");
      //#endregion mentorShipSession.preferredLanguage validation

      //#region status validation
      mentorShipSession.status = trimAndRemoveSpaces(mentorShipSession.status);
      if (!mentorShipSession.status) throw new RequiredParameterError("mentorship session status");
      if (!Object.values(meetingStatusEnum).includes(mentorShipSession.status))
        throw new InvalidPropertyError("enter a valid mentorship session status");
      //#endregion status validation

      //#region enterYourLinkedinOrSocialMediaSite validation
      if (mentorShipSession.enterYourLinkedinOrSocialMediaSite) {
        mentorShipSession.enterYourLinkedinOrSocialMediaSite = trimAndRemoveSpaces(mentorShipSession.enterYourLinkedinOrSocialMediaSite);
        if (!isValidUrl(mentorShipSession.enterYourLinkedinOrSocialMediaSite))
          throw new InvalidPropertyError("Please provide the website URL in correct format with 'http://' or 'https://' and no spaces or special characters");
      }
      //#endregion enterYourLinkedinOrSocialMediaSite validation

      //#region domain validation
      if (mentorShipSession.domain) {
        mentorShipSession.domain = trimAndRemoveSpaces(mentorShipSession.domain);
        if (!isValidUrl(mentorShipSession.domain)) throw new InvalidPropertyError("Please provide the website URL in correct format with 'http://' or 'https://' and no spaces or special characters");
      }
      //#endregion domain validation

      //#region startUpEmail validation
      if (mentorShipSession.startUpEmail) {
        mentorShipSession.startUpEmail = trimAndRemoveSpaces(mentorShipSession.startUpEmail);
        if (!isEmail(mentorShipSession.startUpEmail)) throw new InvalidPropertyError("Please provide the website URL in correct format with 'http://' or 'https://' and no spaces or special characters");
      }
      //#endregion startUpEmail validation

      //#region mentorRating validation\
      if (mentorShipSession.mentorRating) {
        if (Object.keys(mentorShipSession.mentorRating).length === 0) throw new RequiredParameterError("mentor rating");

        //#region rate validation
        mentorShipSession.mentorRating.rate = trimAndRemoveSpaces(mentorShipSession.mentorRating.rate);
        // if (!mentorShipSession.mentorRating.rate) throw new RequiredParameterError('mentor rating rate');
        if (!isNumeric(mentorShipSession.mentorRating.rate)) throw new InvalidPropertyError("mentor rating rate should only contain numbers");
        //#endregion rate validation

        //#region mentorShipSession.mentorRating.whatYouLiked validation
        if (mentorShipSession.mentorRating.whatYouLiked) {
          mentorShipSession.mentorRating.whatYouLiked = trimAndRemoveSpaces(mentorShipSession.mentorRating.whatYouLiked);
        }
        // if (!isAlphaNumeric(mentorShipSession.mentorRating.whatYouLiked)) throw new InvalidPropertyError('mentor rating what mentor liked should only contain letters and numbers');
        // if (!mentorShipSession.mentorRating.whatYouLiked)
        //   throw new RequiredParameterError("mentor rating what mentor liked");
        //#endregion mentorShipSession.mentorRating.whatYouLiked validation

        //#region mentorShipSession.mentorRating.improvementSuggestion validation
        if (mentorShipSession.mentorRating.improvementSuggestion) {
          mentorShipSession.mentorRating.improvementSuggestion = trimAndRemoveSpaces(mentorShipSession.mentorRating.improvementSuggestion);
        }
        // if (
        //   !isAlphaNumeric(
        //     mentorShipSession.mentorRating.improvementSuggestion
        //   )
        // )
        // throw new InvalidPropertyError(
        //   "mentor rating improvements suggestions should only contain letters and numbers"
        // );
        // if (!mentorShipSession.mentorRating.improvementSuggestion)
        //   throw new RequiredParameterError(
        //     "mentor rating improvements suggestions"
        //   );
        //#endregion mentorRating.improvementSuggestion validation

        //#region whatIsOutcomeYouAreLookingFor validation
        mentorShipSession.whatIsOutcomeYouAreLookingFor = trimAndRemoveSpaces(mentorShipSession.whatIsOutcomeYouAreLookingFor);
        if (!isAlphaNumeric(mentorShipSession.whatIsOutcomeYouAreLookingFor))
          throw new InvalidPropertyError("whatIsOutcomeYouAreLookingFor should only contain letters and numbers");
        if (!mentorShipSession.whatIsOutcomeYouAreLookingFor) throw new RequiredParameterError("whatIsOutcomeYouAreLookingFor");
        //#endregion whatIsOutcomeYouAreLookingFor validation

        //#region WhyYouWouldLikeMentorShip validation
        mentorShipSession.WhyYouWouldLikeMentorShip = trimAndRemoveSpaces(mentorShipSession.WhyYouWouldLikeMentorShip);
        if (!isAlphaNumeric(mentorShipSession.WhyYouWouldLikeMentorShip))
          throw new InvalidPropertyError("WhyYouWouldLikeMentorShip should only contain letters and numbers");
        if (!mentorShipSession.WhyYouWouldLikeMentorShip) throw new RequiredParameterError("WhyYouWouldLikeMentorShip");
        //#endregion WhyYouWouldLikeMentorShip validation

        //#region additionalInformation validation
        if (mentorShipSession.additionalInformation) {
          mentorShipSession.additionalInformation = trimAndRemoveSpaces(mentorShipSession.additionalInformation);
          if (!isAlphaNumeric(mentorShipSession.additionalInformation))
            throw new InvalidPropertyError("additionalInformation should only contain letters and numbers");
        }
        //#endregion additionalInformation validation
      }

      //#endregion mentorRating validation

      if (mentorShipSession.menteeRating) {
        //#region mentorShipSession.menteeRating validation
        if (Object.keys(mentorShipSession.menteeRating).length === 0) throw new RequiredParameterError("mentee rating");

        //#region rate validation
        mentorShipSession.menteeRating.rate = trimAndRemoveSpaces(mentorShipSession.menteeRating.rate);
        if (!mentorShipSession.menteeRating.rate) throw new RequiredParameterError("mentee rating rate");
        if (!isNumeric(mentorShipSession.menteeRating.rate)) throw new InvalidPropertyError("mentee rating rate should only contain numbers");
        //#endregion rate validation

        //#region mentorShipSession.menteeRating.whatYouLiked validation
        if (mentorShipSession.menteeRating.whatYouLiked) {
          mentorShipSession.menteeRating.whatYouLiked = trimAndRemoveSpaces(mentorShipSession.menteeRating.whatYouLiked);
        }
        // if (!isAlphaNumeric(mentorShipSession.menteeRating.whatYouLiked))
        //   throw new InvalidPropertyError(
        //     "mentee rating what mentor liked should only contain letters and numbers"
        //   );
        // if (!mentorShipSession.menteeRating.whatYouLiked)
        //   throw new RequiredParameterError("mentee rating what mentor liked");
        //#endregion mentorShipSession.menteeRating.whatYouLiked validation

        //#region mentorShipSession.menteeRating.improvementSuggestion validation
        if (mentorShipSession.menteeRating.improvementSuggestion) {
          mentorShipSession.menteeRating.improvementSuggestion = trimAndRemoveSpaces(mentorShipSession.menteeRating.improvementSuggestion);
        }

        //#endregion menteeRating.improvementSuggestion validation
      }

      //#endregion menteeRating validation

      //#region mentorShipSession approved validation
      if (mentorShipSession.approved) {
        //#region status validation
        mentorShipSession.approved = trimAndRemoveSpaces(mentorShipSession.approved);
        if (!mentorShipSession.approved) throw new RequiredParameterError("mentorship session approved status");
        if (!Object.values(meetingStatusEnum).includes(mentorShipSession.approved))
          throw new InvalidPropertyError("enter a valid mentorship session approved status");
        //#endregion status validation
      }
    }
  }

  //#region date validation
  if (!date) throw new RequiredParameterError("date");
  if (!isValidDate(date)) throw new InvalidPropertyError("enter a valid date");
  //#endregion date validation

  //#region time validation
  if (!startTime) throw new RequiredParameterError("time");


  endTime = new Date(startTime);

  // Add the duration in minutes to endTime
  endTime.setMinutes(endTime.getMinutes() + duration);

  //#endregion time validation
  // if (typeof date === "string") {
  //   const [year, month, day] = date.split("-");
  //   const [hours, minutes] = startTime.split(":");
  //   startTime = new Date(year, month - 1, day, hours, minutes);

  //   // Create a new Date object based on startTime
  //   endTime = new Date(startTime);

  //   // Add the duration in minutes to endTime
  //   endTime.setMinutes(endTime.getMinutes() + duration);
  //   //#endregion time validation
  // }

  return Object.freeze({
    user1,
    user2,
    date,
    mentorShipSession,
    meetingType,
    startTime,
    endTime,
    status
  });
}

export default makeMeeting;
