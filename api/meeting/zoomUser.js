import dotEnv from "dotenv";
dotEnv.config();

import jwt from "jsonwebtoken"; // to be replaced with a facade for JWT (to be checked)
import httpClient from "../httpClient/httpClient.js";

export default async function generateUser() {
  let token = await jwt.sign(
    {
      iss: "HTaeP9zfT6OyU3Ozflifiw",
      exp: new Date().getTime() + 5000,
    },
    "5UuQV1X8yMhEvfDHbwtAp1FAQ2U595fgn3O9",
    {
      algorithm: "HS256",
    }
  );

  const userDetails = {
    action: "custCreate",
    user_info: {
      email: "kareemnegm.dev@gmail.com",
      first_name: "negm",
      last_name: "gouda",
      display_name: "gouda arbab",
      password: "FekryNegm@",
      type: 1,
      feature: {
        zoom_phone: true,
        zoom_one_type: 16,
      },
      plan_united_type: "1",
    },
  };
  // const meetingInvite ={
  //     "attendees": [
  //       {
  //         "name": "Jill Chill"
  //       }
  //     ],
  //     "ttl": 1000
  //   }
  const headers = {
    authorization: "Bearer " + token,
    "content-type": "application/json",
  };

  let data = await httpClient.createPostRequest(
    "https://api.zoom.us/v2/users/",
    JSON.stringify(userDetails),
    headers
  );
  // let invite= await httpClient.createPostRequest('https://api.zoom.us/v2/meetings/'+meeting.id+'/invite_links', JSON.stringify(meetingInvite), headers);
}
