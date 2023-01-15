import styles from "@styles/Chat/ChatMessages.module.css";

export const SettingOption = (props: {name : string, optionClickHandler : () => void}) => {
  
  const isred : boolean = (props.name === "Block user" || props.name === "Leave channel" || props.name === "Unblock user" || props.name === "Remove member");
  
  return (
    <>
      <div
        style={
          isred
            ? { color: "#FF6482"}
            : {}
        }
        className={styles.SettingOptionContainer}
        onClick={props.optionClickHandler}
      >
        {props.name}
      </div>
    </>
  );
};
