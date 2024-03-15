import {
  userRepo,
  userAttachmentRepo,
  notificationTypeRepo,
  notificationMethodRepo,
  profileViewsRepo,
  userNotificationsRepo,
  institutionRepo,
  companyRepo,
} from "../data-access-layer/index.js";
import jwt from "../helper/jwt.js";
import { comparePassword } from "../helper/password-hash.js";
import { makeCompany, makeInstitution, makeUser, makeUserNotifications } from "../entities/index.js";
import mongoose from "mongoose";
import UserVersionRepo from "../data-access-layer/repos/userVersion.repo.js";
import CompanyVersionRepo from "../data-access-layer/repos/companyVersion.repo.js";

import fs from "fs/promises";
import path from "path";
const __dirname = path.resolve();

import studentUseCase from "./student.use-case.js";
import mentorUseCase from "./mentor.use-case.js";
import institutionUseCase from "./institution.use-case.js";
import companyUseCase from "./company.use-case.js";
import userNotificationsUseCase from "./userNotifications.use-case.js";
import userTypesModelNames from "../types/userTypesModelNames.enum.js";
import studentProfilePercentage from "../types/studentProfilePercentage.enum.js";
import notificationTypeEnum from "../types/notificationType.enum.js";
import studentModel from "../data-access-layer/models/student.model.js";
import userTypesModelNamesEnum from "../types/userTypesModelNames.enum.js";
import {
  AfterMentorVerification,
  AfterStudentVerification,
  CompanyApprovedByAdmin,
  CompanyAwaitsForApprovalFromAdminAfterProfileUpdate,
  CompanySignup,
  CompanyVerification,
  InstitutionApprovedByAdmin,
  InstitutionAwaitsForApprovalFromAdminAfterProfileUpdate,
  InstitutionSignup,
  MentorVerification,
  PasswordReset,
  StudentMentorAccountUpdate,
  StudentVerification,
  UserChangedPassword,
} from "../notificationData/notificationData.js";
import companyVersionRepo from "../data-access-layer/repos/companyVersion.repo.js";
import userModel from "../data-access-layer/models/user.model.js";
import userVersionModel from "../data-access-layer/models/userVersion.model.js";
import companyVersionModel from "../data-access-layer/models/companyVersion.model.js";
import userVersionRepo from "../data-access-layer/repos/userVersion.repo.js";
import institutionVersionRepo from "../data-access-layer/repos/institutionVersion.repo.js";
import institutionVersionModel from "../data-access-layer/models/institutionVersion.model.js";
import { verifyCaptcha } from "../helper/helper.js";
import mentorModel from "../data-access-layer/models/mentor.model.js";

async function updatePasswordUseCase(userId, userInfo) {
  const existingUser = await userRepo.findByIdWithoutPopulate(userId);
  // existingUser.city = existingUser.city?._id;
  // existingUser.country = existingUser.country?._id;
  if (!existingUser) throw new Error("Wrong User ID");
  if (!(await comparePassword(userInfo.oldPassword, existingUser.password))) throw new Error("invalid password");
  existingUser.password = userInfo.newPassword;
  const user = await makeUser(existingUser);

  let userModel = await userRepo.findById(userId);
  // getting user name
  const userName = userModel.subModel.name ? userModel.subModel.name : userModel.subModel.firstName + " " + userModel.subModel.lastName;
  // send a message with the token, and decide which notification type to use based on user model
  await userNotificationsUseCase.createUserNotificationsUseCase(
    notificationTypeEnum.USER_CHANGED_PASSWORD,
    user._id,
    new UserChangedPassword(userName)
  );
  return await userRepo.updateById(existingUser._id, user);
}

async function userLoginUseCase(userInfo) {
  // await verifyCaptcha(userInfo.captchaValue);
  //email to lowe case
  userInfo.email = userInfo.email.toLowerCase();
  const user = await userRepo.findByEmail(userInfo.email);

  if (!user) throw new Error("wrong email or password");
  if (!(await comparePassword(userInfo.password, user.password))) throw new Error("wrong email or password");

  const token = await jwt.sign({ _id: user._id, role: user.role });
  return {
    token,
    user,
  };
}

async function createUserUseCase(userInfo, isAdminUpdatingInfoNotUser) {
  // if (!isAdminUpdatingInfoNotUser) await verifyCaptcha(userInfo.captchaValue);
  //loop over userInfo and check if any field is empty then set it to undefined
  let modelName = userInfo.model
  for (const [key, value] of Object.entries(userInfo)) {
    if (value === "" || value == null || value === undefined) {
      delete userInfo[key];
    }
  }

  let subModelId = new mongoose.Types.ObjectId();
  const _id = new mongoose.Types.ObjectId();
  userInfo.subModel = subModelId;
  userInfo.user = _id;

  let subModelData;
  if (userInfo.socialMediaLinks) userInfo.socialMediaLinks = JSON.parse(userInfo.socialMediaLinks);

  if (userInfo.model === userTypesModelNames.STUDENT) {
    //handle if seconder email is ' '
    if (userInfo.secondaryEmail) {
      if (userInfo.secondaryEmail.trim() === "") {
        delete userInfo.secondaryEmail;
      }
    }

    /**************************************************************email validation ********************************************* */
    // Check if secondary email is the same as the primary email
    if (userInfo.email === userInfo.secondaryEmail) {
      throw new Error("Secondary email must not be the same as the primary email");
    }

    // Check if email is used in studentModel as a secondary email
    let studentWithPrimaryEmail = await studentModel.findOne({ secondaryEmail: userInfo.email });
    if (studentWithPrimaryEmail) {
      throw new Error(userInfo.email + " is already used as a secondary email.");
    }

    // Check if secondary email is already used in student model
    if (userInfo.secondaryEmail !== undefined) {
      let studentWithSecondaryEmail = await studentModel.findOne({ secondaryEmail: userInfo.secondaryEmail });

      if (studentWithSecondaryEmail) {
        throw new Error(userInfo.secondaryEmail + " is already used as a secondary email.");
      }
    }

    // Check if secondary email is used as an email in the user model
    let userWithSecondaryEmail = await userModel.findOne({ email: userInfo.secondaryEmail });

    if (userWithSecondaryEmail) {
      throw new Error(userInfo.secondaryEmail + " is already used as an email.");
    }

    /**********************************end of email validation *************************************/

    subModelData = await studentUseCase.createStudentUseCase(userInfo);
  } else if (userInfo.model === userTypesModelNames.MENTOR) {
    subModelData = await mentorUseCase.createMentorUseCase(userInfo);
  } else if (userInfo.model === userTypesModelNames.INSTITUTION) {
    subModelData = await institutionUseCase.createInstitutionUseCase(userInfo);
    // verify and approve institution on creation
    userInfo.verified = true;
    userInfo.approved = true;
  } else if (userInfo.model === userTypesModelNames.COMPANY) {
    subModelData = await companyUseCase.createCompanyUseCase(userInfo);
  }

  userInfo._id = _id;
  userInfo.subModel = subModelData._id;
  let newUser;
  let user;
  try {
    newUser = await makeUser(userInfo);
    user = await userRepo.insert(newUser);

  } catch (error) {
    if (modelName === userTypesModelNames.STUDENT) {
      console.log(userInfo.subModel)
      await studentModel.findByIdAndDelete(userInfo.subModel);
    } else if (modelName === userTypesModelNames.MENTOR) {
      await mentorModel.findByIdAndDelete(userInfo.subModel);
    } else if (modelName === userTypesModelNames.INSTITUTION) {
      await institutionModel.findByIdAndDelete(userInfo.subModel);
    } else if (modelName === userTypesModelNames.COMPANY) {
      await companyModel.findByIdAndDelete(userInfo.subModel);
    }
    throw new Error(error);
  }
  //check if submodelData has error
  if (subModelData.error) {
    await userRepo.deleteById(user._id);
    throw new Error(subModelData.error);
  }


  // create a user notification entry
  const newUserNotification = makeUserNotifications({ user: user._id });
  await userNotificationsRepo.insert(newUserNotification);

  // create a user notifications settings according to the notification types
  await adjustUserNotificationsAccordingToNotificationTypesUseCase([user]);

  const token = await jwt.sign({ _id: user._id });

  if (userInfo.model === userTypesModelNames.STUDENT) {
    await generateAndSendUserVerificationUseCase(newUser._id);
  }
  if (userInfo.model === userTypesModelNames.MENTOR) {
    await generateAndSendUserVerificationUseCase(newUser._id);
  }

  // sends signup notifications
  if (newUser.model === userTypesModelNames.COMPANY) {
    await generateAndSendUserVerificationUseCase(newUser._id);
  } else if (newUser.model === userTypesModelNames.INSTITUTION) {
    await userNotificationsUseCase.createUserNotificationsUseCase(
      notificationTypeEnum.INSTITUTION_SIGN_UP,
      user._id,
      new InstitutionSignup(subModelData.name, process.env.APPLICATION_URL)
    );

    await generateAndSendUserPasswordResetUseCase(user.email);
  }

  return {
    token,
    user,
  };
}

async function adjustUserNotificationsAccordingToNotificationTypesUseCase(users) {
  // if this use case haven't received users, it will update all users data, this will ensure that the use case will be used in the future to update all users data
  if (!users) users = await (await userRepo.findAll()).queryResult;
  //get notification type from notification type model
  const notificationTypes = await notificationTypeRepo.findAll();
  //get notification type from notification type model
  const notificationMethods = await notificationMethodRepo.findAll();
  //loop on users
  users = users.map((user) => {
    // initialize the notification settings array
    user.notificationSettings = [];
    // loop on notification types to add them to user's notification settings
    notificationTypes.forEach((notificationType) => {
      // checks if the notification type is not mandatory and the user model is included in the notification type models, to add it in user's notifications settings
      if (!notificationType.isMandatory && notificationType.models.includes(user.model)) {
        // create a notification setting object, with all notification methods included in the notification type
        let notificationSetting = {
          notificationType: notificationType.kind,
          notificationMethod: notificationMethods.map((notificationMethod) => notificationMethod.kind),
        };
        // push the notification setting to the user's notification settings array
        user.notificationSettings.push(notificationSetting);
      }
    });
    // return modified user
    return user;
  });
  // bulk save modified users
  await userRepo.bulkSave(users);
}

async function getUsersUseCase(query, paginationQuery, approved) {
  if (query.model) query.model = query.model.split(",");
  return await userRepo.findAll(query, paginationQuery, approved);
}

async function getUserByIdUseCase(userId) {
  let user = await userRepo.findById(userId, true);

  if (user.model == userTypesModelNamesEnum.STUDENT) {
    // getting the count of user attachments
    user.uploadedDocuments = await userAttachmentRepo.findByIdCount(user._id);

    /**percentage calculation */
    let profilePercentage = {};
    user.subModel.volunteers?.length !== 0
      ? (profilePercentage["Work & Volunteer Experience"] = {
        current: studentProfilePercentage.volunteers,
        max: studentProfilePercentage.volunteers,
      })
      : (profilePercentage["Work & Volunteer Experience"] = { current: 0, max: studentProfilePercentage.volunteers });

    user.subModel.projects?.length !== 0
      ? (profilePercentage["Notable Projects"] = { current: studentProfilePercentage.projects, max: studentProfilePercentage.projects })
      : (profilePercentage["Notable Projects"] = { current: 0, max: studentProfilePercentage.projects });

    user.subModel.organizations?.length !== 0
      ? (profilePercentage["Committee/Organizations"] = {
        current: studentProfilePercentage.organizations,
        max: studentProfilePercentage.organizations,
      })
      : (profilePercentage["Committee/Organizations"] = { current: 0, max: studentProfilePercentage.organizations });

    profilePercentage["Education, Skills and Language Proficiency & Fluency"] = {
      current:
        (user.subModel.education?.length !== 0 ? studentProfilePercentage.education : 0) +
        (user.subModel.skills?.length !== 0 ? studentProfilePercentage.skills : 0) +
        (user.subModel.fluentLanguage?.length !== 0 ? studentProfilePercentage.fluentLanguage : 0) +
        (user.subModel.proficientLanguage?.length !== 0 ? studentProfilePercentage.proficientLanguage : 0),
      max:
        studentProfilePercentage.education +
        studentProfilePercentage.skills +
        studentProfilePercentage.fluentLanguage +
        studentProfilePercentage.proficientLanguage,
    };
    user.subModel.profileCompletion = profilePercentage;

    /**end of percentage calculation */

    // Convert "from" and "to" dates to display months and calculate the difference
    user.subModel.projects?.forEach((project) => {
      if (project.startingDate && project.endingDate) {
        const startingDate = new Date(project.startingDate);
        const endingDate = new Date(project.endingDate);

        const monthsDiff = endingDate.getMonth() - startingDate.getMonth();
        const yearsDiff = endingDate.getFullYear() - startingDate.getFullYear();

        if (yearsDiff > 0 || monthsDiff > 0) {
          // If there are years or months difference, include it
          project.duration =
            (yearsDiff > 0 ? (yearsDiff > 1 ? yearsDiff + " years" : "1 year") : "") +
            (yearsDiff > 0 && monthsDiff > 0 ? " " : "") +
            (monthsDiff > 0 ? (monthsDiff > 1 ? monthsDiff + " months" : "1 month") : "");
        } else {
          // If no years or months difference, set duration to "0 month"
          project.duration = "0 month";
        }
      }
    });

    // Convert "from" and "to" dates to display months and and calculate the difference
    // Convert "from" and "to" dates to display months and calculate the difference for volunteers
    user.subModel.volunteers?.forEach((volunteer) => {
      if (volunteer.startingDate && volunteer.endingDate) {
        const startingDate = new Date(volunteer.startingDate);
        const endingDate = new Date(volunteer.endingDate);

        const monthsDiff = endingDate.getMonth() - startingDate.getMonth();
        const yearsDiff = endingDate.getFullYear() - startingDate.getFullYear();

        if (yearsDiff > 0 || monthsDiff > 0) {
          // If there are years or months difference, include it
          volunteer.duration =
            (yearsDiff > 0 ? (yearsDiff > 1 ? yearsDiff + " years" : "1 year") : "") +
            (yearsDiff > 0 && monthsDiff > 0 ? " " : "") +
            (monthsDiff > 0 ? (monthsDiff > 1 ? monthsDiff + " months" : "1 month") : "");
        } else {
          // If no years or months difference, set duration to "0 month"
          volunteer.duration = "0 month";
        }
      }
    });
  } else if (user.model == userTypesModelNamesEnum.MENTOR) {
    await profileViewsRepo.createOrUpdateProfileView({ userId });
    // let modelUser = await mentorRepo.findById(user.subModel);
    // user.subModel = modelUser;
  } else if (user.model == userTypesModelNamesEnum.INSTITUTION) {
    await profileViewsRepo.createOrUpdateProfileView({ userId });

    // let modelUser = await institutionRepo.findById(user.subModel);
    // user.subModel = modelUser;
  } else if (user.model == userTypesModelNamesEnum.COMPANY) {
    await profileViewsRepo.createOrUpdateProfileView({ userId });

    // let modelUser = await companyRepo.findById(user.subModel);
    // user.subModel = modelUser;
  }
  return user;
}

async function getUserVersionByIdUseCase(userId) {
  return await userVersionRepo.findById(userId);
}

async function updateUserByIdUseCase(userId, userInfo, isUserUpdatingInfoNotAdmin) {
  if (isUserUpdatingInfoNotAdmin) delete userInfo.approved;

  let oldUser = await userVersionRepo.findByIdWithoutPopulate(userId);

  if (oldUser == null) {
    oldUser = await userRepo.findByIdWithoutPopulate(userId);
  }
  let subModelData;
  if (userInfo.profileImage && oldUser.profileImage) {
    oldUser.profileImage = oldUser.profileImage.split(process.env.SERVER_URL)[1];
    async function checkFileExists(filePath) {
      try {
        await fs.access(filePath);
        return true;
      } catch (err) {
        return false;
      }
    }

    if (await checkFileExists(__dirname + "/" + oldUser.profileImage)) {
      await fs.unlink(__dirname + "/" + oldUser.profileImage);
    }
  }
  if (userInfo.socialMediaLinks) userInfo.socialMediaLinks = JSON.parse(userInfo.socialMediaLinks);

  if (oldUser.model === userTypesModelNames.STUDENT) {
    // Check if secondary email is the same as the primary email
    if (userInfo?.email && userInfo?.secondaryEmail && userInfo?.email === userInfo?.secondaryEmail) {
      throw new Error("Secondary email must not be the same as the primary email");
    }

    // Check if the primary email is used in studentModel's secondaryEmail
    if (userInfo?.email) {
      let studentEmailCheck = await studentModel.findOne({ secondaryEmail: userInfo?.email, _id: { $ne: oldUser.subModel } });
      if (studentEmailCheck) {
        throw new Error(userInfo?.email + " is already used as a secondary email.");
      }
    }

    // Check if the secondary email is used as an email in the user model, excluding the current user
    if (userInfo?.secondaryEmail && oldUser.email !== userInfo?.secondaryEmail) {
      let userWithSecondaryEmail = await userModel.findOne({ email: userInfo?.secondaryEmail, _id: { $ne: oldUser.id } });
      if (userWithSecondaryEmail) {
        throw new Error(userInfo?.secondaryEmail + " is already used as an email.");
      }
    }

    // Check if the secondary email is used in student model, excluding the current user
    if (userInfo?.secondaryEmail) {
      let studentEmailCheck = await studentModel.findOne({ secondaryEmail: userInfo?.secondaryEmail, _id: { $ne: oldUser.subModel } });
      if (studentEmailCheck) {
        throw new Error(userInfo?.secondaryEmail + " is already used as a secondary email.");
      }

      // Check if the secondary email is also used as a primary email in the user model, excluding the current user
      if (userInfo?.email && oldUser.email !== userInfo?.secondaryEmail) {
        if (studentEmailCheck?.secondaryEmail === userInfo?.email) {
          throw new Error(userInfo?.email + " is already used as a secondary email.");
        }
      }
    }
  }
  // if user updating his own data we store this data in newData field until admin approves it
  if (isUserUpdatingInfoNotAdmin && (oldUser.model == userTypesModelNames.INSTITUTION || oldUser.model == userTypesModelNames.COMPANY)) {
    let newUser = { ...oldUser, ...userInfo };
    newUser._id = oldUser._id;
    let existUserVersion = await userVersionRepo.findByIdWithoutPopulate(oldUser._id);
    if (existUserVersion != null) {
      await UserVersionRepo.updateById(existUserVersion._id, newUser);
    } else {
      await UserVersionRepo.insert(newUser);
    }

    /**companyyy */

    if (oldUser.model == userTypesModelNames.COMPANY) {
      if (userInfo.headQuarters && typeof userInfo.headQuarters === "string") userInfo.headQuarters = JSON.parse(userInfo.headQuarters);
      if (userInfo.addresses && typeof userInfo.addresses === "string") userInfo.addresses = JSON.parse(userInfo.addresses);
      if (userInfo.industries && typeof userInfo.industries === "string") userInfo.industries = JSON.parse(userInfo.industries);
      if (userInfo.toBeDeletedImages && typeof userInfo.toBeDeletedImages === "string")
        userInfo.toBeDeletedImages = JSON.parse(userInfo.toBeDeletedImages);
      if (userInfo.jobApplicationMessages && typeof userInfo.jobApplicationMessages === "string")
        userInfo.jobApplicationMessages = JSON.parse(userInfo.jobApplicationMessages);

      let oldCompany = await companyVersionRepo.findByIdWithoutPopulate(oldUser.subModel);
      if (!oldCompany) {
        oldCompany = await companyRepo.findByIdWithoutPopulate(oldUser.subModel);
      }
      //delete old images
      if (userInfo.toBeDeletedImages) {
        const promises = userInfo.toBeDeletedImages.map(async (imageIndex) => {
          // Gets the path of the image by using the index of the image to be deleted to get its URL from old company data
          let toBeDeletedCompanyMediaPath = oldCompany.companyMedia[imageIndex];

          // Splitting the company media path to get the path of the image
          toBeDeletedCompanyMediaPath = toBeDeletedCompanyMediaPath.split(process.env.SERVER_URL)[1];

          // Check if the image exists in the fs or not, and avoid errors if it doesn't exist
          // try {
          //   await fs.promises.readdir(toBeDeletedCompanyMediaPath);
          //   // Deleting the image from the fs
          //   await fs.promises.unlink(__dirname + "/" + toBeDeletedCompanyMediaPath);
          // } catch (error) {
          //   // Handle error, if needed
          // }

          return imageIndex; // Return the image index to be used later in the filtering step
        });

        // Wait for all the fs operations to complete before continuing
        const deletedImageIndexes = await Promise.all(promises);

        // Remove the deleted image indexes from the company media array using filter
        oldCompany.companyMedia = oldCompany.companyMedia.filter((_, index) => !deletedImageIndexes.includes(index));

        // Removing the toBeDeletedImages property from the userInfo object
        delete userInfo.toBeDeletedImages;
      }

      //pushing new images to old images
      if (userInfo.companyMedia) {
        if (!oldCompany.companyMedia) oldCompany.companyMedia = [];
        if (!Array.isArray(userInfo.companyMedia)) oldCompany.companyMedia.push(userInfo.companyMedia);
        else if (userInfo.companyMedia.length >= 6) {
          oldCompany.companyMedia = userInfo.companyMedia;
        } else {
          oldCompany.companyMedia.push(...userInfo.companyMedia);
        }
        delete userInfo.companyMedia;
      }

      oldCompany = { ...oldCompany, ...userInfo, _id: oldCompany._id };
      let updateCompany = makeCompany(oldCompany);
      // updateCompany._id = oldCompany._id;

      let existCompanyVersion = await companyVersionModel.findById(oldCompany._id);
      if (existCompanyVersion) {
        await CompanyVersionRepo.updateById(existCompanyVersion._id, updateCompany);
      } else {
        await CompanyVersionRepo.insert(updateCompany);
      }
    }

    /** end of company */

    if (oldUser.model == userTypesModelNames.INSTITUTION) {
      let oldInstitution = await institutionVersionRepo.findByIdWithoutPopulate(oldUser.subModel);
      if (!oldInstitution) {
        oldInstitution = await institutionRepo.findByIdWithoutPopulate(oldUser.subModel);
      }
      if (userInfo.careerAdvisingLocation) userInfo.careerAdvisingLocation = JSON.parse(userInfo.careerAdvisingLocation);
      if (userInfo.addresses) userInfo.addresses = JSON.parse(userInfo.addresses);

      oldInstitution = { ...oldInstitution, ...userInfo, _id: oldInstitution._id };

      const newInstitution = makeInstitution(oldInstitution);

      let existInstitutionVersion = await institutionVersionModel.findById(oldInstitution._id);
      if (existInstitutionVersion) {
        await institutionVersionRepo.updateById(existInstitutionVersion._id, newInstitution);
      } else {
        await institutionVersionRepo.insert(newInstitution);
      }
    }

    if (oldUser.model == userTypesModelNames.COMPANY) {
      subModelData = await companyUseCase.getCompanyByIdUseCase(oldUser.subModel);
      await userNotificationsUseCase.createUserNotificationsUseCase(
        notificationTypeEnum.COMPANY_WAITS_FOR_APPROVAL_FROM_ADMIN_AFTER_PROFILE_UPDATE,
        newUser._id,
        new CompanyAwaitsForApprovalFromAdminAfterProfileUpdate(subModelData.name)
      );
    } else {
      subModelData = await institutionUseCase.getInstitutionByIdUseCase(oldUser.subModel);
      await userNotificationsUseCase.createUserNotificationsUseCase(
        notificationTypeEnum.INSTITUTION_WAITS_FOR_APPROVAL_FROM_ADMIN_AFTER_PROFILE_UPDATE,
        newUser._id,
        new InstitutionAwaitsForApprovalFromAdminAfterProfileUpdate(subModelData.name)
      );
    }
    //update user newUpdate field
    await userRepo.updateById(oldUser._id, { newUpdate: true });

    return {
      message: "Your data will be reviewed by the admin and you will be notified once it is approved",
    };
  }
  //end of userInfo update with oldData

  oldUser = { ...oldUser, ...userInfo };

  if (oldUser.model === userTypesModelNames.STUDENT) {
    subModelData = await studentUseCase.updateStudentByIdUseCase(oldUser.subModel, oldUser);
    //check if subModel Student completed fields or not
  } else if (oldUser.model === userTypesModelNames.MENTOR) {
    subModelData = await mentorUseCase.updateMentorByIdUseCase(oldUser.subModel, oldUser);
  } else if (oldUser.model === userTypesModelNames.INSTITUTION) {
    subModelData = await institutionUseCase.updateInstitutionByIdUseCase(oldUser.subModel, oldUser);
  } else if (oldUser.model === userTypesModelNames.COMPANY) {
    subModelData = await companyUseCase.updateCompanyByIdUseCase(oldUser.subModel, oldUser);
  }

  let completed = await userRepo.areAllFieldsFilled(userId);
  if (completed) {
    oldUser.completed = true;
  } else {
    oldUser.completed = false;
  }
  const newUser = await makeUser({ ...oldUser, isUpdate: true });
  const user = await userRepo.updateById(newUser._id, newUser);

  // // checks if the user is updating his info not an admin
  if (isUserUpdatingInfoNotAdmin) {
    // sends notification to the either student or company
    await userNotificationsUseCase.createUserNotificationsUseCase(
      notificationTypeEnum.STUDENT_MENTOR_ACCOUNT_UPDATE,
      newUser._id,
      new StudentMentorAccountUpdate(subModelData.firstName + " " + subModelData.lastName)
    );
  } // checks if the approved state changes then checks if the user is an institution or company, to send a notification to the user once it's approved, and the approved flag can't be changed unless the issuer is admin, and it's controlled by access control
  else if (!isUserUpdatingInfoNotAdmin && newUser.approved != oldUser.approved) {
    if (oldUser.model === userTypesModelNames.INSTITUTION) {
      await userNotificationsUseCase.createUserNotificationsUseCase(
        notificationTypeEnum.INSTITUTION_APPROVED_BY_ADMIN,
        newUser._id,
        new InstitutionApprovedByAdmin(subModelData.name)
      );
    } else if (oldUser.model === userTypesModelNames.COMPANY) {
      await userNotificationsUseCase.createUserNotificationsUseCase(
        notificationTypeEnum.COMPANY_APPROVED_BY_ADMIN,
        newUser._id,
        new CompanyApprovedByAdmin(subModelData.name)
      );
    }
  }

  return user;
}

async function updateUserNotificationPreferencesUseCase(userId, notificationPreferencesData) {
  if (!Array.isArray(notificationPreferencesData)) throw new Error("enter valid notification data");

  // validates that notification settings kinds (types and methods) are available in there models
  for (let i = 0; i < notificationPreferencesData.length; i++) {
    // validate that the value is included in the model
    let notificationType = await notificationTypeRepo.findByKind(notificationPreferencesData[i].notificationType);
    if (!notificationType) throw new Error("enter a valid notification type value");

    //validate the notification methods same as the notification type
    for (let j = 0; j < notificationPreferencesData[i].notificationMethod.length; j++) {
      // validate that the value is included in the model
      let notificationMethod = await notificationMethodRepo.findByKind(notificationPreferencesData[i].notificationMethod[j]);
      if (!notificationMethod) throw new Error("enter a valid notification type value");
    }
  }

  let oldUser = await userRepo.findByIdWithoutPopulate(userId);

  oldUser = { ...oldUser, notificationSettings: notificationPreferencesData };

  let updatedUser = await makeUser({ ...oldUser, isUpdate: true });

  return await userRepo.updateById(userId, updatedUser);
}

async function getUserNotificationPreferencesUseCase(userId) {
  const user = await userRepo.findById(userId);
  return user.notificationSettings;
}

async function generateAndSendUserVerificationUseCase(userId) {
  // getting user
  const user = await userRepo.findById(userId);
  // generate user verification token
  const verificationToken = await jwt.signUserVerificationToken();
  // save it in user model
  await userRepo.updateById(user._id, { verificationToken });
  // decide which notification type to use based on user model
  let notificationType;
  if (user.model === userTypesModelNames.MENTOR) {
    notificationType = notificationTypeEnum.MENTOR_VERIFICATION;
  } else if (user.model === userTypesModelNames.STUDENT) {
    notificationType = notificationTypeEnum.STUDENT_VERIFICATION;
  } else if (user.model === userTypesModelNames.COMPANY) {
    notificationType = notificationTypeEnum.COMPANY_VERIFICATION;
  }
  // decide which notification data to use based on user model
  let notificationData;
  if (user.model === userTypesModelNames.MENTOR) {
    notificationData = new MentorVerification(
      user.subModel.firstName + " " + user.subModel.lastName,
      `${process.env.SERVER_URL}user/verify/${user._id}/${verificationToken}`
    );
  } else if (user.model === userTypesModelNames.STUDENT) {
    notificationData = new StudentVerification(
      user.subModel.firstName + " " + user.subModel.lastName,
      `${process.env.SERVER_URL}user/verify/${user._id}/${verificationToken}`
    );
  } else if (user.model === userTypesModelNames.COMPANY) {
    notificationData = new CompanyVerification(user.subModel.name, `${process.env.SERVER_URL}user/verify/${user._id}/${verificationToken}`);
  } else if (user.model === userTypesModelNames.INSTITUTION) {
    notificationData = new InstitutionSignup(user.subModel.name, `${process.env.APPLICATION_URL}/login`);
  }

  // send a message with the token, and decide which notification type to use based on user model
  await userNotificationsUseCase.createUserNotificationsUseCase(notificationType, user._id, notificationData);
}

async function ResetUserPasswordUseCase(userId, passwordResetToken, newPassword) {
  // get user
  const user = await userRepo.findByIdWithoutPopulate(userId);
  if (!user) throw new Error("Invalid verification data");
  // throws an error if the token sent is not the right one that the user has
  if (user.passwordResetToken !== passwordResetToken) throw new Error("Invalid verification data");
  // verifies the token
  if (!(await jwt.verifyUserPasswordResetToken(passwordResetToken))) throw new Error("Invalid verification data");
  const updatedUser = await makeUser({
    ...user,
    country: user.country._id,
    province: user.province._id,
    city: user.city._id,
    subModel: user.subModel._id,
    password: newPassword,
    isUpdate: false,
  });
  // update user verification status
  await userRepo.updateById(userId, {
    ...updatedUser,
    passwordResetToken: null,
  });

  let userModel = await userRepo.findById(userId);
  // getting user name
  const userName = userModel.subModel.name ? userModel.subModel.name : userModel.subModel.firstName + " " + userModel.subModel.lastName;
  // send a message with the token, and decide which notification type to use based on user model
  await userNotificationsUseCase.createUserNotificationsUseCase(
    notificationTypeEnum.USER_CHANGED_PASSWORD,
    user._id,
    new UserChangedPassword(userName)
  );
}

async function areAllFieldsFilledUseCase(userId) {
  const user = await userRepo.areAllFieldsFilled(userId);
  return user;
}

async function approveOrDeclineNewDataUpdate(userId, approved) {
  approved = JSON.parse(approved);
  let subModelData;
  let oldUser = await userRepo.findByIdWithoutPopulate(userId);
  if (oldUser.newUpdate == true) {
    if (approved == true) {
      let userVersion = await UserVersionRepo.findByIdWithoutPopulate(oldUser._id);
      // update subModel sections
      if (oldUser.model === userTypesModelNames.INSTITUTION) {
        let institutionVersion = await institutionVersionRepo.findByIdWithoutPopulate(oldUser.subModel);
        //update old institution with new institution

        let oldInstitution = await institutionRepo.findByIdWithoutPopulate(oldUser.subModel);

        oldInstitution = { ...oldInstitution, ...institutionVersion, _id: oldUser.subModel };

        const newInstitution = makeInstitution(oldInstitution);

        subModelData = await institutionRepo.updateById(oldUser.subModel, newInstitution);
        await institutionVersionModel.deleteOne({ _id: institutionVersion._id });
      } else if (oldUser.model === userTypesModelNames.COMPANY) {
        //get company new update version
        let companyVersion = await CompanyVersionRepo.findByIdWithoutPopulate(oldUser.subModel);
        //update old company with new company
        // if (companyVersion.companyMedia.length == 0) {
        //   delete companyVersion.companyMedia
        // }

        subModelData = await companyUseCase.updateCompanyByIdUseCase(oldUser.subModel, companyVersion);
        await companyVersionModel.deleteOne({ _id: companyVersion._id });
      }

      // update user section
      userVersion.newUpdate = false;
      const newUser = await makeUser({ ...userVersion, isUpdate: true });
      const user = await userRepo.updateById(newUser._id, newUser);

      // notification section
      if (oldUser.model === userTypesModelNames.INSTITUTION) {
        await userNotificationsUseCase.createUserNotificationsUseCase(
          notificationTypeEnum.INSTITUTION_APPROVED_BY_ADMIN,
          newUser._id,
          new InstitutionApprovedByAdmin(subModelData.name)
        );
      } else if (oldUser.model === userTypesModelNames.COMPANY) {
        await userNotificationsUseCase.createUserNotificationsUseCase(
          notificationTypeEnum.COMPANY_APPROVED_BY_ADMIN,
          newUser._id,
          new CompanyApprovedByAdmin(subModelData.name)
        );
      }
      return user;
    } else {
      if (oldUser.model === userTypesModelNames.INSTITUTION) {
        let userVersion = await UserVersionRepo.findByIdWithoutPopulate(oldUser._id);
        let institutionVersion = await institutionVersionRepo.findByIdWithoutPopulate(userVersion.subModel);
        if (institutionVersion) {
          await institutionVersionModel.deleteOne({ _id: institutionVersion._id });
        }
        if (userVersion) {
          await userVersionModel.deleteOne({ _id: userVersion._id });
        }
      } else if (oldUser.model === userTypesModelNames.COMPANY) {
        let userVersion = await UserVersionRepo.findByIdWithoutPopulate(oldUser._id);
        let companyVersion = await CompanyVersionRepo.findByIdWithoutPopulate(userVersion.subModel);
        if (companyVersion) {
          await companyVersionModel.deleteOne({ _id: companyVersion._id });
        }
        if (userVersion) {
          await userVersionModel.deleteOne({ _id: userVersion._id });
        }
      }
      await userRepo.updateById(oldUser._id, { newUpdate: false });
    }
  }
}

async function removeUserUseCase(userId) {
  const user = await userRepo.removeUserById(userId);
  return user;
}

async function generateAndSendUserPasswordResetUseCase(userEmail) {
  userEmail = userEmail.toLowerCase();
  const user = await userRepo.findByEmail(userEmail);
  if (!user) throw new Error("Invalid verification data");
  // generate user verification token
  const passwordResetToken = await jwt.signUserPasswordResetToken();
  // save it in user model
  await userRepo.updateById(user._id, { passwordResetToken });
  // getting user name
  const userName = user.subModel.name ? user.subModel.name : user.subModel.firstName + " " + user.subModel.lastName;
  // send a message with the token, and decide which notification type to use based on user model
  await userNotificationsUseCase.createUserNotificationsUseCase(
    notificationTypeEnum.PASSWORD_RESET,
    user._id,
    new PasswordReset(userName, `${process.env.APPLICATION_URL}reset-password?passwordResetToken=${passwordResetToken}&userId=${user._id}`)
  );
}

// get users with new data
async function getUsersWithNewDataUseCase(paginationQuery) {
  const users = await userRepo.getUsersWithNewData(paginationQuery);
  return users;
}
// verify user
async function verifyUserUseCase(userId, verificationToken) {
  // get user
  const user = await userRepo.findById(userId);
  if (!user) throw new Error("Invalid verification data");
  // throws an error if the token sent is not the right one that the user has
  if (user.verificationToken !== verificationToken) throw new Error("Invalid verification data");
  // verifies the token
  if (!(await jwt.verifyUserVerificationToken(verificationToken))) throw new Error("Invalid verification data");
  // update user verification status
  await userRepo.updateById(userId, {
    ...user,
    verified: true,
    verificationToken: null,
  });
  // getting user name
  const userName = user.subModel.name ? user.subModel.name : user.subModel.firstName + " " + user.subModel.lastName;
  // send a message with the token, and decide which notification type to use based on user model

  if (user.model === userTypesModelNames.STUDENT) {
    await userNotificationsUseCase.createUserNotificationsUseCase(
      notificationTypeEnum.AFTER_STUDENT_VERIFIED,
      user._id,
      new AfterStudentVerification(userName, process.env.APPLICATION_URL)
    );
  } else if (user.model === userTypesModelNames.MENTOR) {
    await userNotificationsUseCase.createUserNotificationsUseCase(
      notificationTypeEnum.AFTER_MENTOR_VERIFIED,
      user._id,
      new AfterMentorVerification(userName, process.env.APPLICATION_URL)
    );
  } else if (user.model === userTypesModelNames.COMPANY) {
    await userNotificationsUseCase.createUserNotificationsUseCase(notificationTypeEnum.COMPANY_SIGN_UP, user._id, new CompanySignup(userName));
  }

  return true;
}

export default {
  createUserUseCase,
  getUserByIdUseCase,
  getUsersUseCase,
  updateUserByIdUseCase,
  userLoginUseCase,
  getUserNotificationPreferencesUseCase,
  updateUserNotificationPreferencesUseCase,
  areAllFieldsFilledUseCase,
  adjustUserNotificationsAccordingToNotificationTypesUseCase,
  generateAndSendUserVerificationUseCase,
  removeUserUseCase,
  ResetUserPasswordUseCase,
  updatePasswordUseCase,
  approveOrDeclineNewDataUpdate,
  generateAndSendUserPasswordResetUseCase,
  getUsersWithNewDataUseCase,
  verifyUserUseCase,
  getUserVersionByIdUseCase,
};
