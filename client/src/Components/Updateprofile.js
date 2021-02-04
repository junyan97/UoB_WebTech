import React from 'react';
import { Formik } from "formik";
import * as Yup from "yup";

const Updateprofile = ({changeRoute}=this.props) => (

    <Formik
        initialValues={{ firstname: "", lastname: "" }}
        onSubmit={(values) => {
            fetch('/api/user/updateprofile', {
                method: 'put',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': window.localStorage.getItem('token')
                },
                body: JSON.stringify({
                    firstName: values.firstname,
                    lastName: values.lastname
                })
            })
            .then(response => response.json())
            .then(response => {                
                if (response.response) {
                    changeRoute("signin");
                    window.localStorage.setItem('firstname', values.firstname)
                    window.localStorage.setItem('lastname', values.lastname)
                    //TODO store the user info in state if needed?
                } else {
                    //TODO show please try again
                }
                    
            })    
        }}

        validationSchema={Yup.object().shape({
        firstname: Yup.string()
            .min(1, 'Too Short!')
            .max(50, 'Too Long!')
            .required("First name is required"),
        lastname: Yup.string()
            .min(1, 'Too Short!')
            .max(50, 'Too Long!')
            .required("Last name is required"),
        })}
    >
        
        {props => {
            const {
            values,
            touched,
            errors,            
            handleChange,
            handleBlur,
            handleSubmit
            } = props;
        
            return(
                <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
                    <form className="pa4 black-80 " onSubmit={handleSubmit}>
                        <div className="measure tc">
                            <fieldset id="update_profile" className="ba b--transparent ph0 mh0">
                            <legend className="f1 fw6 ph0 mh0">Update Profile</legend>
                            <div className="mt3 tl">
                                <label className="db fw6 lh-copy f6" htmlFor="oldfirstname">Previous First Name: {window.localStorage.getItem("firstname")}</label>
                                <input
                                    name="firstname"
                                    type="text"
                                    placeholder="Enter your new first name"
                                    value={values.firstname}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={errors.firstname && touched.firstname && "error"}
                                />
                                {errors.firstname && touched.firstname && (
                                    <div className="input-feedback">{errors.firstname}</div>
                                )}
                            </div>
                            <div className="mt3 tl">
                            <label className="db fw6 lh-copy f6" htmlFor="oldlastname">Previous First Name: {window.localStorage.getItem("lastname")}</label>
                                <input
                                    name="lastname"
                                    type="text"
                                    placeholder="Enter your new last name"
                                    value={values.lastname}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={errors.lastname && touched.lastname && "error"}
                                />
                                {errors.lastname && touched.lastname && (
                                    <div className="input-feedback">{errors.lastname}</div>
                                )}
                            </div>
                            </fieldset>
                            <div className="pv2">
                                <button className="b ph3 pv2 input-reset ba b--black bg-transparent pointer f6 dib" type="submit">
                                    Update
                                </button>
                            </div>
                        </div>
                    </form>
                </article>
            );
        }}
    </Formik>
    
)

export default Updateprofile;