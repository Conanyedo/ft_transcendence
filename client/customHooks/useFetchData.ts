import { AnyAction } from "@reduxjs/toolkit";
import { ShowErrorMsg } from "@store/UI-Slice";
import axios from "axios";
import socket_game from "config/socketGameConfig";
import { NextRouter } from "next/router";
import path from "path";
import { Dispatch, SetStateAction } from "react";
import { baseUrl } from "../config/baseURL";
import socket_notif from "../config/socketNotif";
import { ChannelData, channelMembers, UserTypeNew } from "../Types/dataTypes";

export const getQRcodeOrdisableCode = async (
  status: string,
  route: NextRouter
): Promise<string> => {
  const json = JSON.stringify({ is2faEnabled: status });
  return await axios({
    method: "post",
    url: `${baseUrl}auth/2faEnabling`,
    data: json,
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  })
    .then((res) => {
      if (res.data.err) return;
      return res.data.data;
    })
    .catch((err) => {
      if (err.response.status === 401) {
        socket_notif.disconnect();
        route.replace("/");
      }
    });
};

export const Is2FAEnaled = (set: any, setP: any, route: NextRouter) => {
  axios
    .get(`${baseUrl}auth/is2faEnabled`, {
      headers: {},
      withCredentials: true,
    })
    .then((result) => {
      if (result.data.err) return;
      set(result.data.data);
      setP(result.data.data);
    })
    .catch((err) => {
      if (err.response.status === 401) {
        socket_notif.disconnect();
        route.replace("/");
      }
    });
};

export const check2FACode = async (
  code: string,
  route: NextRouter
): Promise<boolean> => {
  const json = JSON.stringify({ code: code });
  return await axios({
    method: "post",
    url: `${baseUrl}auth/2faValidate`,
    data: json,
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  })
    .then((res) => {
      if (res.data.err) return false;
      return true;
    })
    .catch((err) => {
      if (err.response.status === 401) {
        socket_notif.disconnect();
        route.replace("/");
      }
      return false;
    });
};

export const LogOut = (route: NextRouter) => {
  axios
    .get(`${baseUrl}auth/logout`, {
      headers: {},
      withCredentials: true,
    })
    .then(() => {
      socket_notif.disconnect();
      socket_game.disconnect();
      route.replace("/");
    })
    .catch((err) => {
      socket_notif.disconnect();
      socket_game.disconnect();
      route.replace("/");
    });
};

export const updateUserInfo = async (
  nameRef: React.MutableRefObject<any>,
  ImageRef: React.MutableRefObject<any>,
  OldData: { name: string; image: string }
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
      headers: {},
      withCredentials: true,
    })
    .catch((err) => {
      if (err.response.status === 401) {
        socket_notif.disconnect();
      }
    });
};

export const fetchUserInfo = async (
  OldData: { name: string; image: string },
  router: NextRouter,
  setUserData: React.Dispatch<React.SetStateAction<UserTypeNew>>
) => {
  await axios
    .get(`${baseUrl}user/header/@me`, {
      headers: {},
      withCredentials: true,
    })
    .then((res) => {
      OldData.name = res.data.data.fullname;
      OldData.image = res.data.data.avatar;
      setUserData(res.data.data);
    })
    .catch((err) => {
      if (err.response.status === 401) {
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
  let Id: string = "/@me";
  if (login) Id = "/" + login;
  await axios
    .get(`${baseUrl}user/achievements${Id}`, {
      headers: {},
      withCredentials: true,
    })
    .then((res) => {
      if (res.data.data) setAchievementsids(res.data.data.achievements);
    })
    .catch((err) => {
      if (err.response.status === 401) {
        socket_notif.disconnect();
        router.replace("/");
      }
    });
};

export const fetchDATA = async (set: any, router: NextRouter, Path: string) => {
  await axios
    .get(`${baseUrl}${Path}`, {
      headers: {},
      withCredentials: true,
    })
    .then((res) => {
      if (res.data.data) set(res.data.data);
      else router.push("/profile");
    })
    .catch((err) => {
      if (err.response.status === 401) {
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
  await axios
    .get(`${baseUrl}chat/loginInfo/${login}`, {
      headers: {},
      withCredentials: true,
    })
    .then((res) => {
      set(res.data.data);
    })
    .catch((err) => {
      if (err.response.status === 401) {
        socket_notif.disconnect();
        router.replace("/");
      }
    });
};

export const joinChannel = async (convId: string, password: string) => {
  const data = { password: password } || {};
  const json = JSON.stringify(data);
  axios
    .post(`${baseUrl}chat/JoinChannel/${convId}`, json, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    })
    .then((res) => {
      if (res.data.err) return false;
      return true;
    })
    .catch((err) => {
      return false;
    });
};

export const JoinChannel = async (
  data: any,
  setError: Dispatch<SetStateAction<string>>
) => {
  const json = JSON.stringify({ convId: data.convId, password: data.password });

  return await axios({
    method: "post",
    url: `${baseUrl}chat/joinChannel`,
    headers: {
      "Content-Type": "application/json",
    },
    data: json,
    withCredentials: true,
  })
    .then((res) => {
      setError(res.data.err);
      if (res.data.err) return false;
      return true;
    })
    .catch((err) => {
      setError(err);
      if (err.response.status === 401) {
        socket_notif.disconnect();
      }
      return false;
    });
};

export const fetchAddChnlMembers = async (data: string[], convId: string) => {
  const json = JSON.stringify({ members: data });
  return await axios({
    method: "post",
    url: `${baseUrl}chat/addMembers/${convId}`,
    headers: {
      "Content-Type": "application/json",
    },
    data: json,
    withCredentials: true,
  })
    .then((response) => {
      if (response.data.err) return false;
      return true;
    })
    .catch((err) => {
      return false;
    });
};

export const checkCode2FA = async (code: string, router: NextRouter) => {
  const json = JSON.stringify({ code: code });
  return await axios({
    method: "post",
    url: `${baseUrl}auth/2faLogin`,
    data: json,
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  })
    .then((res) => {
      if (res.data.err) return false;
      router.replace("/");
      return true;
    })
    .catch((err) => {
      if (err.response.status === 401) {
        socket_notif.disconnect();
        router.replace("/");
      }
      return false;
    });
};

export const fetchUpdateChannel = async (
  data: ChannelData,
  convId: string,
  imgFileRef: React.MutableRefObject<any>,
  setResponseError: Dispatch<SetStateAction<string>>
) => {
  const params = new FormData();
  params.append("name", data.name);
  if (data.type !== "Protected" || (data.password && data.password?.length > 0))
    params.append("type", data.type);
  if (data.password) params.append("password", data.password);
  const imgFile = imgFileRef?.current?.files;
  if (data.avatar && imgFile.length > 0) {
    params.append("oldPath", data.avatar);
    params.append("avatar", imgFile[0]);
  }
  await axios
    .post(`${baseUrl}chat/updateChannel/${convId}`, params, {
      headers: {},
      withCredentials: true,
    })
    .then((res) => {
      if (res.data.err !== undefined) {
        setResponseError(res.data.err);
      } else {
        setResponseError("");
        return true;
      }
    })
    .catch((err) => {
      return false;
    });
};

export const fetchCreateChannel = async (
  set: Dispatch<SetStateAction<string>>,
  data: any,
  setResponseError: Dispatch<SetStateAction<string>>
) => {
  if (data.type !== "Protected") delete data.password;
  const json = JSON.stringify({
    name: data.name,
    type: data.type,
    members: [...data.members],
    password: data.password,
  });
  return await axios({
    method: "post",
    url: `${baseUrl}chat/createChannel`,
    headers: {
      "Content-Type": "application/json",
    },
    data: json,
    withCredentials: true,
  })
    .then((res) => {
      if (res.data.err !== undefined) {
        setResponseError(res.data.err);
      } else {
        setResponseError("");
        set(res.data.data.convId);
        return true;
      }
    })
    .catch((err) => {
      return false;
    });
};

export const fetchMuteMember = async (
  data: { member: string; duration: number },
  convId?: string
) => {
  const json = JSON.stringify({
    member: data.member,
    seconds: data.duration,
  });

  return await axios({
    method: "post",
    url: `${baseUrl}chat/muteMember/${convId}`,
    headers: {
      "Content-Type": "application/json",
    },
    data: json,
    withCredentials: true,
  })
    .then((res) => {
      if (res.data.err) return false;
      return true;
    })
    .catch((err) => {
      return false;
    });
};

export const fetchUnmuteMmeber = async (
  data: { member: string },
  convId: string
) => {
  const json = JSON.stringify({ member: data.member });
  return await axios({
    method: "post",
    url: `${baseUrl}chat/unmuteMember/${convId}`,
    headers: {
      "Content-Type": "application/json",
    },
    data: json,
    withCredentials: true,
  })
    .then((res) => {
      if (res.data.err) return false;
      return true;
    })
    .catch((err) => {
      return false;
    });
};

export const fetchBanMember = async (
  data: { member: string },
  convId: string
) => {
  const json = JSON.stringify({ member: data.member });

  return await axios({
    method: "post",
    url: `${baseUrl}chat/banMember/${convId}`,
    headers: {
      "Content-Type": "application/json",
    },
    data: json,
    withCredentials: true,
  })
    .then((res) => {
      if (res.data.err) return false;
      return true;
    })
    .catch((err) => {
      return false;
    });
};

export const fetchLeaveChannel = async (convId: string) => {
  const json = JSON.stringify({ convId: convId });
  return await axios({
    method: "post",
    url: `${baseUrl}chat/leaveChannel/${convId}`,
    headers: {
      "Content-Type": "application/json",
    },
    data: json,
    withCredentials: true,
  })
    .then((res) => {
      if (res.data.err) return false;
      return true;
    })
    .catch((err) => {
      return false;
    });
};

export const fetchChannelMembers = async (
  convId: string,
  setChnlMember: Dispatch<SetStateAction<channelMembers>>
) => {
  const json = JSON.stringify({ convId: convId });
  return await axios({
    method: "post",
    url: `${baseUrl}chat/channelProfile/${convId}`,
    headers: {
      "Content-Type": "application/json",
    },
    data: json,
    withCredentials: true,
  })
    .then((response) => {
      if (response.data.data) {
        setChnlMember(response.data.data);
      } else return false;
    })
    .catch((err) => {
      return false;
    });
};

export const fetchBlockUnblockUser = async (login: string, path: string) => {
  const json = JSON.stringify({ login: login });
  return await axios({
    method: "post",
    url: `${baseUrl}${path}`,
    headers: {
      "Content-Type": "application/json",
    },
    data: json,
    withCredentials: true,
  })
    .then((res) => {
      if (res.data.err) return false;
      return true;
    })
    .catch((err) => {
      return false;
    });
};

export const getChannelProfile = async (convId: string, set: any) => {
  const json = JSON.stringify({ convId: convId });

  return await axios({
    method: "post",
    url: `${baseUrl}chat/channelProfile`,
    headers: {
      "Content-Type": "application/json",
    },
    data: json,
    withCredentials: true,
  })
    .then((res) => {
      if (res.data.err) return false;
      return res;
    })
    .catch((err) => {
      return false;
    });
};

export const fetchChangeMemberStatus = async (data: any, convId: string) => {
  const json = JSON.stringify(data);

  return await axios({
    method: "post",
    url: `${baseUrl}chat/setMemberStatus/${convId}`,
    headers: {
      "Content-Type": "application/json",
    },
    data: json,
    withCredentials: true,
  })
    .then((res) => {
      if (res.data.err) return false;
      return true;
    })
    .catch((err) => {
      return false;
    });
};

export const changeMemberRole = async (data: any, set: any) => {
  const json = JSON.stringify(data);

  return await axios({
    method: "post",
    url: `${baseUrl}chat/setMemberStatus`,
    headers: {
      "Content-Type": "application/json",
    },
    data: json,
    withCredentials: true,
  })
    .then((res) => {
      if (res.data.err) return false;
      return true;
    })
    .catch((err) => {
      return false;
    });
};

export const getFriends = async (setInitialState: any) => {
  return await axios({
    method: "get",
    url: `${baseUrl}friendship/friends`,
    headers: {},
    withCredentials: true,
  })
    .then((res) => {
      if (res.data.err) return false;
      setInitialState(res.data.data);
      return true;
    })
    .catch((err) => {
      return false;
    });
};

export const leaveChannel = async (
  convId: any,
  router: NextRouter,
  set: any
) => {
  const json = JSON.stringify({ convId: convId });

  return await axios({
    method: "post",
    url: `${baseUrl}chat/leaveChannel`,
    headers: {
      "Content-Type": "application/json",
    },
    data: json,
    withCredentials: true,
  })
    .then((res) => {
      if (res.data.err) return false;
      set(false);
      router.push("/chat");
      return true;
    })
    .catch((err) => {
      return false;
    });
};

export const fetchLoginInfo = async (login: string) => {
  return await axios({
    method: "get",
    url: `${baseUrl}chat/loginInfo/${login}`,
    headers: {},
    withCredentials: true,
  })
    .then((res) => {
      if (res.data.err) return undefined;
      else return res.data.data;
    })
    .catch((err) => {
      return false;
    });
};

export const check2FA_JWT = async (set: any, router: NextRouter) => {
  await axios({
    method: "get",
    url: `${baseUrl}auth/is2faAuthorized`,
    withCredentials: true,
  })
    .then((res) => {
      if (res.data.err) return set(false);
      set(true);
    })
    .catch((err) => {
      if (err.response.status === 401) {
        socket_notif.disconnect();
        router.replace("/");
        set(false);
      }
    });
};

export const isAuthorized = async (
  router: NextRouter,
  set: Dispatch<SetStateAction<number>>
) => {
  set(2);
  await axios({
    method: "get",
    url: `${baseUrl}auth/isAuthorized`,
    withCredentials: true,
  })
    .then((res) => {
      if (res.data.err) return set(0);
      set(1);
    })
    .catch((err) => {
      if (err.response.status === 401) {
        socket_notif.disconnect();
        set(0);
      }
    });
};

export const requests = async (
  login: string,
  path: string,
  router: NextRouter
) => {
  const json = JSON.stringify({ login: login });
  return await axios({
    method: "post",
    url: `${baseUrl}${path}`,
    data: json,
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  })
    .then((res) => {
      if (res.data.err) return false;
      return true;
    })
    .catch((err) => {
      if (err.response.status === 401) {
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
  const json = JSON.stringify({ convId: convId });
  return await axios({
    method: "post",
    url: `${baseUrl}${path}`,
    data: json,
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  })
    .then((res) => {
      if (res.data.err) return false;
      return true;
    })
    .catch((err) => {
      if (err.response.status === 401) {
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
  const json = JSON.stringify({ login: login });
  const res = await axios({
    method: "post",
    url: `${baseUrl}user/isExist`,
    data: json,
    headers: {
      "Content-Type": "application/json",
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
        socket_notif.disconnect();
        router.replace("/");
      }
      dispatch(ShowErrorMsg());
      router.push("/profile");
    });
  return res;
};
