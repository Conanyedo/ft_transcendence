import Styles from "styles/Chat/Message.module.css";
import { MsgData } from "./ChatMessages";
import { InviteMsg } from "./inviteMsg";

export const Message = ({ Sender, GameInvite, Content, Date }: MsgData) => {
  return (
    <>
      {!GameInvite ? (
        <div className={!Sender ? Styles.right : Styles.left}>
          <div className={Styles.MsgContainer}>
            <div
              className={`${Styles.MsgBox} ${Sender && Styles.SenderMsgBox}`}
            >
              {/* {Channel <h2>Sender Name</h2>} */}
              {Content}
            </div>
            <div
              className={`${Styles.MsgDate} ${Sender && Styles.SenderMsgDate}`}
            >
              {Date}
            </div>
          </div>
        </div>
      ) : (
        <div className={!Sender ? Styles.right : Styles.left}>
          <div className={Styles.MsgContainer}>
            <div className={Styles.InviteMsgBox}>
              <div className={Styles.InviteMsginfo}>
                <img
                  src="https://static.wikia.nocookie.net/berserk/images/4/40/Manga_V38_Guts.png/revision/latest?cb=20170919104357"
                  alt="UserAvatar"
                ></img>
                <div className={Styles.InviteMsgProfile}>
                  <div>
                    <div className={Styles.InviteMsgProfileName}>
                      Abdellah Belhachmi
                    </div>
                    <div className={Styles.InviteMsgStatus}>Status</div>
                  </div>
                </div>
              </div>
              < div className={Styles.InviteMsgButton}>
              </div>
            </div>
            <div
              className={`${Styles.MsgDate} ${Sender && Styles.SenderMsgDate}`}
            >
              {Date}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
