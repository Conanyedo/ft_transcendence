import classes from './sideBar.module.css'

const Section = (props: {elm: any}) => {
    return (
        <div className={classes["projects-section"]}>
            {props.elm}
        </div>
    );
}

export default Section;