import { userAttachmentRepo, userRepo } from "../data-access-layer/index.js";
import fs from "fs";
import userNotificationsUseCase from "./userNotifications.use-case.js";
import notificationTypeEnum from "../types/notificationType.enum.js";
import { StudentUploadedDocument, StudentDocumentApprovedByAdmin } from "../notificationData/notificationData.js";
import makeUserAttachment from "../entities/userAttachment.entities.js";

async function createUserAttachmentUseCase(userAttachmentInfo) {
  userAttachmentInfo.dateUploaded = new Date().toISOString().slice(0, 10);
  userAttachmentInfo.status = "pending";
  const newUserAttachment = await makeUserAttachment({
    ...userAttachmentInfo,
    isUpdate: true,
  });
  await userAttachmentRepo.insert(newUserAttachment);
  // getting user info
  const userName = await userRepo.findById(newUserAttachment.user).then((user) => user.subModel.firstName + " " + user.subModel.lastName);
  await userNotificationsUseCase.createUserNotificationsUseCase(
    notificationTypeEnum.STUDENT_UPLOADED_DOCUMENT,
    newUserAttachment.user,
    new StudentUploadedDocument(userName, newUserAttachment.name)
  );
}

async function getUserAttachmentsUseCase(userAttachmentInfo, status, visible, attachmentType) {
  return await userAttachmentRepo.findByUserId(userAttachmentInfo, status, visible, attachmentType);
}

async function getUserAttachmentByIdUseCase(userAttachmentId) {
  return await userAttachmentRepo.findById(userAttachmentId);
}

async function removeUserAttachmentByIdUseCase(userAttachmentId) {
  let attachment = await userAttachmentRepo.findById(userAttachmentId);
  let exists = await userAttachmentRepo.isUserAttachmentIdUsedInApplication(userAttachmentId);
  if (!exists) {
    let url = attachment.attachment.replace(/^[a-zA-Z]{3,5}\:\/{2}[a-zA-Z0-9_.:-]+\//, "");
    await fs.unlinkSync(url);
  }
  return await userAttachmentRepo.removeUserAttachmentById(userAttachmentId);
}

async function updateUserAttachmentByIdUseCase(userAttachmentId, userAttachmentInfo) {
  let oldUserAttachment = await userAttachmentRepo.findByIdWithoutPopulate(userAttachmentId);
  if (!oldUserAttachment) throw new Error("User attachment not found");
  let update = { ...oldUserAttachment._doc, ...userAttachmentInfo };
  const newUserAttachment = await makeUserAttachment(update);

  await userAttachmentRepo.updateById(userAttachmentId, newUserAttachment);

  if (newUserAttachment.status == "approved") {
    // getting user info
    const userName = await userRepo.findById(newUserAttachment.user).then((user) => user.subModel.firstName + " " + user.subModel.lastName);
    await userNotificationsUseCase.createUserNotificationsUseCase(
      notificationTypeEnum.STUDENT_DOCUMENT_APPROVED_BY_ADMIN,
      newUserAttachment.user,
      new StudentDocumentApprovedByAdmin(userName, newUserAttachment.name)
    );
  }
  if(newUserAttachment.status == "rejected"){
    //delete file
    let url = newUserAttachment.attachment.replace(/^[a-zA-Z]{3,5}\:\/{2}[a-zA-Z0-9_.:-]+\//, "");
    await fs.unlinkSync(url);
    await userAttachmentRepo.removeUserAttachmentById(userAttachmentId);
  }
}

async function getAllFilteredUserAttachmentsUseCase(status, visible, attachmentType) {
  return await userAttachmentRepo.findAllFiltered(status, visible, attachmentType);
}

export default {
  createUserAttachmentUseCase,
  getUserAttachmentByIdUseCase,
  getUserAttachmentsUseCase,
  updateUserAttachmentByIdUseCase,
  removeUserAttachmentByIdUseCase,
  getAllFilteredUserAttachmentsUseCase,
};
