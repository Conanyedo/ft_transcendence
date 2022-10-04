import { AnyAction } from "@reduxjs/toolkit";
import { ShowErrorMsg } from "@store/UI-Slice";
import { filterCnvs } from "@utils/chat";
import axios from "axios";
import socket_game from "config/socketGameConfig";
import { CookieValueTypes, getCookie } from "cookies-next";
import Router, { NextRouter } from "next/router";
import { Dispatch, SetStateAction } from "react";
import { baseUrl } from "../config/baseURL";
import socket_notif from "../config/socketNotif";
import { UserTypeNew } from "../Types/dataTypes";
import { eraseCookie } from "./Functions";

export const getQRcodeOrdisableCode = async (
  status: string,
  route: NextRouter
): Promise<string> => {
  const token = getCookie("jwt");
  const params = new URLSearchParams();
  params.append("is2faEnabled", status);
  return await axios({
    method: "post",
    url: `${baseUrl}auth/2faEnabling`,
    data: params,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  })
    .then((res) => {
      return res.data.data;
    })
    .catch((err) => {
      if (err.response.status === 401) {
        eraseCookie("jwt");
        socket_notif.disconnect();
        route.replace("/");
      }
    });
};

export const Is2FAEnaled = (set: any, setP: any, route: NextRouter) => {
  const token = getCookie("jwt");
  axios
    .get(`${baseUrl}auth/is2faEnabled`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    })
    .then((result) => {
      set(result.data.data);
      setP(result.data.data);
    })
    .catch((err) => {
      if (err.response.status === 401) {
        eraseCookie("jwt");
        socket_notif.disconnect();
        route.replace("/");
      }
    });
};

export const check2FACode = async (
  code: string,
  route: NextRouter
): Promise<boolean> => {
  const token = getCookie("jwt");
  const params = new URLSearchParams();
  params.append("code", code);
  return await axios({
    method: "post",
    url: `${baseUrl}auth/2faValidate`,
    data: params,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  })
    .then(() => {
      return true;
    })
    .catch((err) => {
      if (err.response.status === 401) {
        eraseCookie("jwt");
        socket_notif.disconnect();
        route.replace("/");
      }
      return false;
    });
};

export const LogOut = (route: NextRouter) => {
  const token = getCookie("jwt");
  axios
    .get(`${baseUrl}auth/logout`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    })
    .then(() => {
      socket_notif.disconnect();
      socket_game.disconnect();
      route.replace("/");
    })
    .catch((err) => {
      eraseCookie("jwt");
      socket_notif.disconnect();
      socket_game.disconnect();
      route.replace("/");
    });
};

export const updateChnlInfo = async (
  formData: any,
  router: any,
  login: any
) => {
  // /chat/updateChannel
  // the data should be as follows {name, type, password, avatar, oldPath}
  const token = getCookie("jwt");
  // const json = JSON.stringify(data);
  return await axios({
    method: "post",
    url: `${baseUrl}chat/updateChannel`,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    data: formData,
    withCredentials: true,
  })
    .then((res) => {
      if (res.data == true) {
        router.push(`/chat?login=${login}`);
      }
      // set(res.data);
      return true;
    })
    .catch((err) => {
      return false;
    });
};

export const updateUserInfo = async (
  nameRef: React.MutableRefObject<any>,
  ImageRef: React.MutableRefObject<any>,
  OldData: { name: string; image: string },
  token: CookieValueTypes
) => {
  const params = new FormData();
  const currentName = nameRef.current;
  const currentImage = ImageRef.current;
  const Name: string = currentName!.value;
  const Image = currentImage!.files;
  if (OldData.name !== Name) params.append("fullname", nameRef.current!.value);
  if (Image.length === 1) {
    params.append("avatar", Image![0]);
    params.append("oldPath", OldData.image);
  }
  await axios
    .post(`${baseUrl}user/editProfile`, params, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    })
    .catch((err) => {
      if (err.response.status === 401) {
        eraseCookie("jwt");
        socket_notif.disconnect();
      }
    });
};

export const fetchUserInfo = async (
  OldData: { name: string; image: string },
  token: CookieValueTypes,
  router: NextRouter,
  setUserData: React.Dispatch<React.SetStateAction<UserTypeNew>>
) => {
  await axios
    .get(`${baseUrl}user/header`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    })
    .then((res) => {
      OldData.name = res.data.data.fullname;
      OldData.image = res.data.data.avatar;
      setUserData(res.data.data);
    })
    .catch((err) => {
      if (err.response.status === 401) {
        eraseCookie("jwt");
        socket_notif.disconnect();
        router.replace("/");
      }
    });
};

export const fetchAchievements = async (
  setAchievementsids: React.Dispatch<React.SetStateAction<number[]>>,
  router: NextRouter,
  login: string
) => {
  const token = getCookie("jwt");
  let Id: string = "";
  if (login) Id = "/" + login;
  await axios
    .get(`${baseUrl}user/achievements${Id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    })
    .then((res) => {
      if (res.data.data) setAchievementsids(res.data.data.achievements);
    })
    .catch((err) => {
      if (err.response.status === 401) {
        eraseCookie("jwt");
        socket_notif.disconnect();
        router.replace("/");
      }
    });
};

export const fetchDATA = async (set: any, router: NextRouter, Path: string) => {
  const token = getCookie("jwt");
  await axios
    .get(`${baseUrl}${Path}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    })
    .then((res) => {
      if (res.data.data) set(res.data.data);
    })
    .catch((err) => {
      if (err.response.status === 401) {
        eraseCookie("jwt");
        socket_notif.disconnect();
        router.replace("/");
      }
    });
};

export const fetchUserLogin = async (
  set: any,
  router: NextRouter,
  login: string
) => {
  const token = getCookie("jwt");
  await axios
    .get(`${baseUrl}chat/loginInfo/${login}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    })
    .then((res) => {
      set(res.data.data);
    })
    .catch((err) => {
      if (err.response.status === 401) {
        eraseCookie("jwt");
        socket_notif.disconnect();
        router.replace("/");
      }
    });
};

export const JoinChannel = async (
  set: any,
  router: NextRouter,
  data: any
) => {
  const token = getCookie("jwt");
  await axios
    .post(`${baseUrl}chat/joinChannel`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: data,
      withCredentials: true,
    })
    .then((res) => {
      console.log(res.data);
      return (true);
      // set(res.data.data);
    })
    .catch((err) => {
      if (err.response.status === 401) {
        router.replace("/");
        return (false);
      }
    });
};



export const addMembers = async (data: any) => {
  // POST /chat/addMembers
  const token = getCookie("jwt");
  const json = JSON.stringify(data);
  return await axios({
    method: "post",
    url: `${baseUrl}chat/addMembers`,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    data: json,
    withCredentials: true,
  })
    .then((res) => {
      // console.log(res);
      // set(res.data);
      return true;
    })
    .catch((err) => {
      return false;
    });
};

export const banMemberFromChannel = async (data: any) => {
  // /chat/banMember
  const token = getCookie("jwt");
  const json = JSON.stringify(data);
  return await axios({
    method: "post",
    url: `${baseUrl}chat/banMember`,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    data: json,
    withCredentials: true,
  })
    .then((res) => {
      // console.log(res);
      // set(res.data);
      return true;
    })
    .catch((err) => {
      return false;
    });
};

export const muteMemberFromChnl = async (data: any) => {
  // /chat/banMember
  const token = getCookie("jwt");
  const json = JSON.stringify(data);
  return await axios({
    method: "post",
    url: `${baseUrl}chat/muteMember`,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    data: json,
    withCredentials: true,
  })
    .then((res) => {
      return true;
    })
    .catch((err) => {
      return false;
    });
};

export const UnmuteMemberFromChnl = async (data: any) => {
  // /chat/banMember
  const token = getCookie("jwt");
  const json = JSON.stringify(data);
  return await axios({
    method: "post",
    url: `${baseUrl}chat/unmuteMember`,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    data: json,
    withCredentials: true,
  })
    .then((res) => {
      return true;
    })
    .catch((err) => {
      return false;
    });
};

export const checkCode2FA = async (code: string, router: NextRouter) => {
  const token = getCookie("jwt-2fa");
  const params = new URLSearchParams();
  params.append("code", code);
  return await axios({
    method: "post",
    url: `${baseUrl}auth/2faLogin`,
    data: params,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  })
    .then((res) => {
      router.replace("/");
      return true;
    })
    .catch((err) => {
      if (err.response.status === 401) {
        eraseCookie("jwt-2fa");
        socket_notif.disconnect();
        router.replace("/");
      }
      return false;
    });
};

export const postChannel = async (set: any, router: NextRouter, data: any) => {
  const token = getCookie("jwt");
  const json = JSON.stringify(data);
  return await axios({
    method: "post",
    url: `${baseUrl}chat/createChannel`,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    data: json,
    withCredentials: true,
  })
    .then((res) => {
      // console.log("create channel response", res);
      set(res.data);
      router.push("/chat?login=" + res.data.login);
      return true;
    })
    .catch((err) => {
      return false;
    });
};

export const changeMemberRole = async (data: any, set: any) => {
  // POST /chat/setMemberStatus
  const token = getCookie("jwt");
  const json = JSON.stringify(data);
  return await axios({
    method: "post",
    url: `${baseUrl}chat/setMemberStatus`,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    data: json,
    withCredentials: true,
  })
    .then((res) => {
      return true;
    })
    .catch((err) => {
      return false;
    });
};

export const getFriends = async (setInitialState: any) => {
  const token = getCookie("jwt");
  return await axios({
    method: "get",
    url: `${baseUrl}friendship/friends`,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    withCredentials: true,
  })
    .then((res) => {
      // console.log('get friend', res.data.data);
      setInitialState(res.data.data);
      return true;
    })
    .catch((err) => {
      return false;
    });
};

export const getChannelProfile = async (convId: any, set: any) => {
  // POST /chat/channelProfile
  const token = getCookie("jwt");
  const json = { convId: convId };
  return await axios({
    method: "post",
    url: `${baseUrl}chat/channelProfile`,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    data: json,
    withCredentials: true,
  })
    .then((res) => {
      console.log(res);
      return res;
    })
    .catch((err) => {
      return false;
    });
};

export const leaveChannel = async (
  convId: any,
  router: NextRouter,
  setNewData: any,
  prevData: any
) => {
  // console.log(convId);
  const token = getCookie("jwt");
  const json = JSON.stringify({ convId: convId });
  return await axios({
    method: "post",
    url: `${baseUrl}chat/leaveChannel`,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    data: json,
    withCredentials: true,
  })
    .then((res) => {
      // console.log(res);
      // console.log(JSON.parse(res.config.data));
      setNewData(filterCnvs(prevData, res.config.data));
      router.push("/chat");
      return true;
    })
    .catch((err) => {
      console.log(err);
      return false;
    });
};

export const getLoginInfo = async (
  login: any,
  user: boolean,
  setChnlData: any
) => {
  const token = getCookie("jwt");

  return await axios({
    method: "get",
    url:`${baseUrl}chat/channelInfo/${login}`,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    withCredentials: true,
  })
    .then((res) => {
      if (res.data.err) {
        Router.push('/chat');
      } else {
        if (res.data?.data === true) {
          setChnlData({type: 'Public',convId: ''});
        }
        else {
          setChnlData(res.data.data);
        }
      }
    })
    .catch((err) => {
      return false;
    });
};

export const check2FA_JWT = async (
  jwt: CookieValueTypes,
  set: any,
  router: NextRouter
) => {
  await axios({
    method: "get",
    url: `${baseUrl}auth/is2faAuthorized`,
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
    withCredentials: true,
  })
    .then(() => {
      set(true);
    })
    .catch((err) => {
      if (err.response.status === 401) {
        eraseCookie("jwt-2fa");
        socket_notif.disconnect();
        router.replace("/");
        set(false);
      }
    });
};

export const checkJWT = async (
  router: NextRouter,
  set: Dispatch<SetStateAction<boolean>>
) => {
  const token = getCookie("jwt");
  await axios({
    method: "get",
    url: `${baseUrl}auth/isAuthorized`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  })
    .then(() => {
      router.push("/profile");
      eraseCookie("jwt-2fa");
    })
    .catch((err) => {
      if (err.response.status === 401) {
        eraseCookie("jwt-2fa");
        socket_notif.disconnect();
        router.replace("/");
        set(false);
      }
    });
};

export const requests = async (
  login: string,
  path: string,
  router: NextRouter
) => {
  const token = getCookie("jwt");
  const params = new URLSearchParams();
  params.append("login", login);
  return await axios({
    method: "post",
    url: `${baseUrl}${path}`,
    data: params,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  })
    .then((res) => {
      return true;
    })
    .catch((err) => {
      if (err.response.status === 401) {
        eraseCookie("jwt");
        socket_notif.disconnect();
        router.replace("/");
      }
      return false;
    });
};

export const requestsChannel = async (
  convId: string,
  path: string,
  router: NextRouter
) => {
  const token = getCookie("jwt");
  const params = new URLSearchParams();
  params.append("convId", convId);
  return await axios({
    method: "post",
    url: `${baseUrl}${path}`,
    data: params,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  })
    .then((res) => {
      return true;
    })
    .catch((err) => {
      if (err.response.status === 401) {
        eraseCookie("jwt");
        socket_notif.disconnect();
        router.replace("/");
      }
      return false;
    });
};

export const userExists = async (
  set: any,
  login: string,
  router: NextRouter,
  dispatch: Dispatch<AnyAction>
) => {
  const token = getCookie("jwt");
  const params = new URLSearchParams();
  params.append("login", login);
  const res = await axios({
    method: "post",
    url: `${baseUrl}user/isExist`,
    data: params,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  })
    .then((res) => {
      if (res.data.data) set(login);
      else {
        dispatch(ShowErrorMsg());
        router.push("/profile");
      }
    })
    .catch((err) => {
      if (err.response.status === 401) {
        eraseCookie("jwt");
        socket_notif.disconnect();
        router.replace("/");
      }
      dispatch(ShowErrorMsg());
      router.push("/profile");
    });
  return res;
};
