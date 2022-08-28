import classes from "../../styles/ChartDonut.module.css";

const Chart: React.FC<{ amount: number }> = (props) => {
	const progress = props.amount;
	return (
		<div
			style={{
				background: `conic-gradient(#31BAAE ${progress}%, #555D67 ${progress}%)`,
			}}
			className={`${classes.pie_chart} ${classes.pie_chart__donut}`}
		>
			<span className={classes.pie_chart__value}>{`${progress}%`}</span>
		</div>
	);
};

export default Chart;
