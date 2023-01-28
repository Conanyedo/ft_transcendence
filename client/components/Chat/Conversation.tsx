import { getImageBySize } from "@hooks/Functions";
import { useRouter } from "next/router";
import Styles from "../../styles/Chat/Conversation.module.css";

interface Props {
  convId?: string;
  avatar: string;
  name: string;
  membersNum?: number;
  status: string;
  unread: number;
  type: string;
  selected: boolean;
}

export const Conversation: React.FC<Props> = ({
  convId,
  avatar,
  name,
  membersNum,
  status,
  unread,
  type,
  selected,
}) => {
  const router = useRouter();
  const convClickHandler = () => {
    if (convId && type === "Dm") router.push("/chat?login=" + convId);
    else router.push("/chat?channel=" + convId);
  };

  return (
    <div
      className={`${Styles.ConversationContainer} ${
        selected ? Styles.selected : ""
      }`}
      onClick={convClickHandler}
    >
      <div className={Styles.Convinfo}>
        <img src={getImageBySize(avatar, 70)}></img>
        <div className={Styles.ConvStatus}>
          <div className={Styles.userName}>{name}</div>
          {type !== "Dm"
            ? `${membersNum} Members`
            : status !== "Blocker" && status}
        </div>
      </div>
      {unread ? <div className={Styles.NewMsg}>{unread}</div> : null}
    </div>
  );
};
