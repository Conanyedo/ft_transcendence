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
  const json = JSON.stringify({ is2faEnabled: status });
  return await axios({
    method: "post",
    url: `${baseUrl}auth/2faEnabling`,
    data: json,
    headers: {
      Authorization: `Bearer ${token}`,
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
      if (result.data.err) return;
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
  const json = JSON.stringify({ code: code });
  return await axios({
    method: "post",
    url: `${baseUrl}auth/2faValidate`,
    data: json,
    headers: {
      Authorization: `Bearer ${token}`,
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
  const token = getCookie("jwt");
  return await axios({
    method: "post",
    url: `${baseUrl}chat/updateChannel`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: formData,
    withCredentials: true,
  })
    .then((res) => {
      if (res.data.data == true) {
        router.push(`/chat?channel=${login}`);
      }
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
	const token = getCookie("jwt")
	await axios
		.get(`${baseUrl}${Path}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
			withCredentials: true,
		})
		.then((res) => {
			if (res.data.data) set(res.data.data)
			else router.push("/profile")
		})
		.catch((err) => {
			if (err.response.status === 401) {
				eraseCookie("jwt")
				socket_notif.disconnect()
				router.replace("/")
			}
		})
}

export const fetchUserLogin = async (set: any, router: NextRouter, login: string) => {
	const token = getCookie("jwt")
	await axios
		.get(`${baseUrl}chat/loginInfo/${login}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
			withCredentials: true,
		})
		.then((res) => {
			set(res.data.data)
		})
		.catch((err) => {
			if (err.response.status === 401) {
				eraseCookie("jwt")
				socket_notif.disconnect()
				router.replace("/")
			}
		})
}

export const JoinChannel = async (
  set: any,
  router: NextRouter,
  data: any,
  setError: Dispatch<SetStateAction<string>>
) => {
	const token = getCookie("jwt")
	const json = JSON.stringify({ convId: data.convId, password: data.password })

	return await axios({
		method: "post",
		url: `${baseUrl}chat/joinChannel`,
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
		},
		data: json,
		withCredentials: true,
	})
		.then((res) => {
      setError(res.data.err);
			if (res.data.err) return false
			return true
		})
		.catch((err) => {
			setError(err)
			if (err.response.status === 401) {
				eraseCookie("jwt")
				socket_notif.disconnect()
			}
			return false
		})
}

export const addMembers = async (data: any, setData: any) => {
  // POST /chat/addMembers
  const json = JSON.stringify({ convId: data.convId, members: data.members });

  const token = getCookie("jwt");
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
      if (res.data.err) return false;
      setData(res.data.data);
      return true;
    })
    .catch((err) => {
      return false;
    });
};

export const banMemberFromChannel = async (data: any) => {
  const token = getCookie("jwt");
  const json = JSON.stringify({ convId: data.convId, member: data.member });

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
      if (res.data.err) return false;
      return true;
    })
    .catch((err) => {
      return false;
    });
};

export const muteMemberFromChnl = async (data: any) => {
  const json = JSON.stringify({
    convId: data.convId,
    member: data.member,
    seconds: data.seconds,
  });

  const token = getCookie("jwt");
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
      if (res.data.err) return false;
      return true;
    })
    .catch((err) => {
      return false;
    });
};

export const UnmuteMemberFromChnl = async (data: any) => {
  // /chat/banMember
  const json = JSON.stringify({ convId: data.convId, member: data.member });

  const token = getCookie("jwt");
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
      if (res.data.err) return false;
      return true;
    })
    .catch((err) => {
      return false;
    });
};

export const checkCode2FA = async (code: string, router: NextRouter) => {
	const token = getCookie("jwt-2fa")
	const json = JSON.stringify({ code: code })
	return await axios({
		method: "post",
		url: `${baseUrl}auth/2faLogin`,
		data: json,
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
		},
		withCredentials: true,
	})
		.then((res) => {
			if (res.data.err) return false
			// router.replace("/")
			return true
		})
		.catch((err) => {
			if (err.response.status === 401) {
				eraseCookie("jwt-2fa")
				socket_notif.disconnect()
				router.replace("/")
			}
			return false
		})
}

export const postChannel = async (set: any, router: NextRouter, data: any, setError: any) => {
	const token = getCookie("jwt")
	const json = JSON.stringify({
		name: data.name,
		type: data.type,
		members: [...data.members],
		password: data.password,
	})
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
			if (res.data.err !== undefined) {
				setError(res.data.err)
			} else {
				setError("")
				set(res.data)
				if (res.data.data.membersNum > 0) router.push("/chat?channel=" + res.data.data.name)
				else router.push("/chat?login=" + res.data.data.login)
			}
		})
		.catch((err) => {
			return false
		})
}

export const changeMemberRole = async (data: any, set: any) => {
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
      if (res.data.err) return false;
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
    },
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

export const getChannelProfile = async (convId: any, set: any) => {
  // POST /chat/channelProfile
  const token = getCookie("jwt");
  const json = JSON.stringify({ convId: convId });

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
      if (res.data.err) return false;
      return res;
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

  const token = getCookie("jwt");
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
      if (res.data.err) return false;
      set(false);
      router.push("/chat");
      return true;
    })
    .catch((err) => {
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
      url: `${baseUrl}chat/channelInfo/${login}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    })
      .then((res) => {
        if (res.data.err) return false;
        else {
          if (res.data?.data === true) {
            setChnlData({ type: "", convId: "" });
          } else {
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
    .then((res) => {
      if (res.data.err) return set(false);
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
    .then((res) => {
      if (res.data.err) return set(false);
      eraseCookie("jwt-2fa");
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

export const requests = async (
  login: string,
  path: string,
  router: NextRouter
) => {
  const token = getCookie("jwt");
  const json = JSON.stringify({ login: login });
  return await axios({
    method: "post",
    url: `${baseUrl}${path}`,
    data: json,
    headers: {
      Authorization: `Bearer ${token}`,
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
  const json = JSON.stringify({ convId: convId });
  return await axios({
    method: "post",
    url: `${baseUrl}${path}`,
    data: json,
    headers: {
      Authorization: `Bearer ${token}`,
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
  const json = JSON.stringify({ login: login });
  const res = await axios({
    method: "post",
    url: `${baseUrl}user/isExist`,
    data: json,
    headers: {
      Authorization: `Bearer ${token}`,
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
        eraseCookie("jwt");
        socket_notif.disconnect();
        router.replace("/");
      }
      dispatch(ShowErrorMsg());
      router.push("/profile");
    });
  return res;
};
