export class StudentCreatesReview {
  constructor(studentName, companyName) {
    this.studentName = studentName;
    this.companyName = companyName;
  }
}
export class MentorVerification {
  constructor(mentorName, verificationUrl, mentorEmail) {
    this.mentorName = mentorName;
    this.verificationUrl = verificationUrl;
    this.mentorEmail = mentorEmail;
  }
}
export class AfterMentorVerification {
  constructor(mentorName, loginUrl) {
    this.mentorName = mentorName;
    this.loginUrl = loginUrl;
  }
}
export class RemindMentorToReviewMentee {
  constructor(mentorName, menteeName, reviewUrl) {
    this.mentorName = mentorName;
    this.menteeName = menteeName;
    this.reviewUrl = reviewUrl;
  }
}
export class RemindMenteeToReviewMentor {
  constructor(mentorName, menteeName, reviewUrl) {
    this.mentorName = mentorName;
    this.menteeName = menteeName;
    this.reviewUrl = reviewUrl;
  }
}
export class JobApplicationStatusChanged {
  constructor(studentName, companyName, jobName, applicationUrl) {
    this.studentName = studentName;
    this.companyName = companyName;
    this.jobName = jobName;
    this.applicationUrl = applicationUrl;
  }
}
export class StudentAppliedForJob {
  constructor(studentName, companyName, jobName, receivedJobApplicationMessage) {
    this.studentName = studentName;
    this.companyName = companyName;
    this.jobName = jobName;
    this.receivedJobApplicationMessage = receivedJobApplicationMessage;
  }
}
export class StudentUploadedDocument {
  constructor(studentName, documentName) {
    this.studentName = studentName;
    this.documentName = documentName;
  }
}
export class StudentDocumentApprovedByAdmin {
  constructor(studentName, documentName) {
    this.studentName = studentName;
    this.documentName = documentName;
  }
}
export class StudentVerification {
  constructor(studentName, verificationUrl) {
    this.studentName = studentName;
    this.verificationUrl = verificationUrl;
  }
}
export class AfterStudentVerification {
  constructor(studentName, loginUrl) {
    this.studentName = studentName;
    this.loginUrl = loginUrl;
  }
}
export class MentorDeclineSession {
  constructor(studentName, mentorName, mentorshipType) {
    this.studentName = studentName;
    this.mentorName = mentorName;
    this.mentorshipType = mentorshipType;
  }
}
export class StudentAppliesForJob {
  constructor(studentName, companyName, jobName) {
    this.studentName = studentName;
    this.companyName = companyName;
    this.jobName = jobName;
  }
}
export class CompanyAwaitsForApprovalFromAdminAfterProfileUpdate {
  constructor(companyName) {
    this.companyName = companyName;
  }
}
export class CompanySignup {
  constructor(companyName) {
    this.companyName = companyName;
  }
}

export class CompanyVerification {
  constructor(companyName, verificationUrl) {
    this.companyName = companyName;
    this.verificationUrl = verificationUrl;
  }
}

export class InstitutionSignup {
  constructor(institutionName, loginUrl) {
    this.institutionName = institutionName;
    this.loginUrl = loginUrl;
    this.currentYear = new Date().getFullYear();
  }
}
export class CompanyUpdatedJobPost {
  constructor(companyName, jobName) {
    this.companyName = companyName;
    this.jobName = jobName;
  }
}
export class CompanyPostedJob {
  constructor(companyName, jobName) {
    this.companyName = companyName;
    this.jobName = jobName;
  }
}
export class JobApprovedByAdmin {
  constructor(companyName, jobName, jobUrl) {
    this.companyName = companyName;
    this.jobName = jobName;
    this.jobUrl = jobUrl;
  }
}
export class CompanyApprovedByAdmin {
  constructor(companyName) {
    this.companyName = companyName;
  }
}
export class InstitutionApprovedByAdmin {
  constructor(institutionName) {
    this.institutionName = institutionName;
  }
}
export class InstitutionAwaitsForApprovalFromAdminAfterProfileUpdate {
  constructor(institutionName) {
    this.institutionName = institutionName;
  }
}
export class UserChangedPassword {
  constructor(userName) {
    this.userName = userName;
  }
}
export class MessageReceived {
  constructor(userName, senderName, inboxUrl) {
    this.userName = userName;
    this.senderName = senderName;
    this.inboxUrl = inboxUrl;
  }
}
export class PasswordReset {
  constructor(userName, passwordResetUrl) {
    this.userName = userName;
    this.passwordResetUrl = passwordResetUrl;
  }
}
export class MentorApprovesSessionForMentor {
  constructor(mentorName, adminDurationForSession, menteeName, meetingStartTime, meetingDate, userMeetingUrl) {
    this.mentorName = mentorName;
    this.adminDurationForSession = adminDurationForSession;
    this.menteeName = menteeName;
    this.meetingStartTime = meetingStartTime;
    this.meetingDate = meetingDate;
    this.userMeetingUrl = userMeetingUrl;
  }
}
export class MentorApprovesSessionForStudent {
  constructor(mentorName, adminDurationForSession, menteeName, meetingStartTime, meetingDate, userMeetingUrl) {
    this.mentorName = mentorName;
    this.adminDurationForSession = adminDurationForSession;
    this.menteeName = menteeName;
    this.meetingStartTime = meetingStartTime;
    this.meetingDate = meetingDate;
    this.userMeetingUrl = userMeetingUrl;
  }
}
export class StudentMentorAccountUpdate {
  constructor(studentOrMentorName) {
    this.studentOrMentorName = studentOrMentorName;
  }
}
export class ReviewIsApprovedByAdminForStudent {
  constructor(studentName, companyName, jobTitle) {
    this.studentName = studentName;
    this.companyName = companyName;
    this.jobTitle = jobTitle;
  }
}
export class ReviewIsApprovedByAdminForCompany {
  constructor(companyName, reviewsPageUrl) {
    this.companyName = companyName;
    this.reviewsPageUrl = reviewsPageUrl;
  }
}
export class InfoAboutSession {
  constructor(studentName, mentorName) {
    this.studentName = studentName;
    this.mentorName = mentorName;
  }
}
export class MentorReceiveSessionRequest {
  constructor(studentName, mentorName, mentorShipType, mentorMentorShipsPageUrl) {
    this.studentName = studentName;
    this.mentorName = mentorName;
    this.mentorShipType = mentorShipType;
    this.mentorMentorShipsPageUrl = mentorMentorShipsPageUrl;
  }
}
