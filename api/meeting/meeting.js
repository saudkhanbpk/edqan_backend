import dotEnv from "dotenv";
dotEnv.config();
import axios from 'axios';

import httpClient from "../httpClient/httpClient.js";

const auth_token_url = "https://zoom.us/oauth/token"
const api_base_url = "https://api.zoom.us/v2"

export default async function generateMeeting(user1, user2) {

  // get access token
  const authResponse = await httpClient.createPostRequest(
    `${auth_token_url}?grant_type=account_credentials&account_id=${process.env.ZOOM_ACCOUNT_ID}`, null, null,
    {
      auth: {
        username: process.env.ZOOM_CLIENT_ID,
        password: process.env.ZOOM_CLIENT_SECRET
      }
    }
  );
  const accessToken = authResponse.access_token;

  const headers = {
    authorization: "Bearer " + accessToken,
    "content-type": "application/json",
  };
  
  // setting meeting details
  const meetingDetails = {
    topic: "Edqan meeting",
    type: 3,
    settings: {
      host_video: "true",
      participant_video: "true",
      join_before_host: true,
    },
  };

  let meeting = await httpClient.createPostRequest(
    "https://api.zoom.us/v2/users/me/meetings",
    JSON.stringify(meetingDetails),
    headers
  );

  let meetingInviteUser1 = {
    attendees: [
      {
        name: user1,
      },
    ],
  };
  let meetingInviteUser2 = {
    attendees: [
      {
        name: user2,
      },
    ],
  };
  let user1Invite = await httpClient.createPostRequest(
    "https://api.zoom.us/v2/meetings/" + meeting.id + "/invite_links",
    JSON.stringify(meetingInviteUser1),
    headers
  );
  let user2Invite = await httpClient.createPostRequest(
    "https://api.zoom.us/v2/meetings/" + meeting.id + "/invite_links",
    JSON.stringify(meetingInviteUser2),
    headers
  );

  return { user1: user1Invite.attendees[0].join_url, user2: user2Invite.attendees[0].join_url }

}
