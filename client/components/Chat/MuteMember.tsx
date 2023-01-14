import Styles from "@styles/Chat/MuteMember.module.css";
import CloseIcon from "@public/Cross.svg";

export const MuteMember = () => {
  return (
    <>
      <form className={Styles.MuteMemberContainer}>
        <div className={Styles.MuteMemberHeader}>
          <div> Mute Member</div>
        </div>
        <p className={Styles.MuteMemberDescription}>
          The member won’t be able to send and receive any message from the
          channel
        </p>
        <div className={Styles.MuteMemberOptionsContainer}>
          <div className={Styles.MuteMemberOption}>
            1 Hour
            <label className={Styles.CustomRadioBtn}>
            <input
              type={"radio"}
              name="muteMemberOption"
              value="1Hour"
            ></input>
            </label>
          </div>
          <div className={Styles.MuteMemberOption}>
            8 Hour
            <label className={Styles.CustomRadioBtn}>
            <input
              type={"radio"}
              name="muteMemberOption"
              value="8Hour"
            ></input>
            </label>
          </div>
          <div className={Styles.MuteMemberOption}>
            12 Hour
            <label className={Styles.CustomRadioBtn}>
            <input
              type={"radio"}
              name="muteMemberOption"
              value="12Hour"
            ></input>
            </label>
          </div>
          <div className={Styles.MuteMemberOption}>
            24 Hour
            <label className={Styles.CustomRadioBtn}>
            <input
              type={"radio"}
              name="muteMemberOption"
              value="24Hour"
            ></input>
            </label>
          </div>
          <div className={Styles.MuteMemberOption}>
            7 Days
            <label className={Styles.CustomRadioBtn}>
            <input
              type={"radio"}
              name="muteMemberOption"
              value="7Days"
            ></input>
            </label>
          </div>
        </div>
        <input type="submit" value="Mute" />
      </form>
    </>
  );
};
