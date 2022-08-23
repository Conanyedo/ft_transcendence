import classes from "../styles/Section.module.css";

const Section = (props: {elm: any}) => {
    return (
        <div className={classes.containerSection}>
            {props.elm}
        </div>
    );
}

export default Section;