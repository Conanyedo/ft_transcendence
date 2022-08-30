import classes from "../../styles/slideUpMsg.module.css";

const MsgSlideUp: React.FC<{
	msg: string;
	colorCtn: string;
	colorMsg: string;
}> = (props) => {
	return (
		<>
			<div className={classes.Errorctn}>
				<span
					className={classes.msgError}
					style={{
						backgroundColor: `${props.colorCtn}`,
						color: `${props.colorMsg}`,
					}}
				>
					{props.msg}
				</span>
			</div>
		</>
	);
};

export default MsgSlideUp;
