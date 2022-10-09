import ProfileInfo from "../../components/profile/profileInfo";
import Achievements from "../../components/profile/achievements";
import OverView from "../../components/profile/OverView/overView";
import MatchHistory from "../../components/profile/MatchHistory";
import classes from "../../styles/Profile.module.css";
import { getCookie } from "cookies-next";
import { useDispatch } from "react-redux";
import { Toggle } from "@store/UI-Slice";
import { eraseCookie } from "@hooks/Functions";
import { useEffect, useState } from "react";

const Profile = () => {
  const dispatch = useDispatch();
  const firstTime = getCookie("isFirst");
  const [isMounted, setisMounted] = useState(false);
  useEffect(() => {
    if (firstTime) {
      dispatch(Toggle());
      eraseCookie("isFirst");
    }
    setisMounted(true);
  }, []);
  return (
    <>
      {isMounted && (
        <div className={classes.profileCtn}>
          <ProfileInfo />
          <Achievements id="" />
          <OverView />
          <MatchHistory />
        </div>
      )}
    </>
  );
};
export default Profile;
