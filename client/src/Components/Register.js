import React from 'react';
import { Formik } from "formik";
import * as Yup from "yup";


const Register = ({changeRoute}) => (
    
    <Formik
        initialValues={{firstname: "", lastname: "", email: "", password: "" }}
        onSubmit={(values) => {          
            fetch('/api/user/register', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: values.email
                    , password: values.password
                    , firstName: values.firstname
                    , lastName: values.lastname
                })
            })
            .then(response => response.json())
            .then(response => {                
                if (response.response) {
                    changeRoute('signin');
                } else if (response.error === 'Email already exists') {
                    //TODO: show error "Email already exist"
                } else {
                    //TODO: show error "Please try again"
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
        email: Yup.string()
            .email()
            .required("Required"),
        password: Yup.string()
            .required("No password provided.")
            .min(8, "Password is too short - should be 8 chars minimum.")
            .matches(/(?=.*[0-9])/, "Password must contain a number.")
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
                        <fieldset id="register" className="ba b--transparent ph0 mh0">
                        <legend className="f1 fw6 ph0 mh0">Register</legend>
                        <div className="mt3 tl">
                            <label className="db fw6 lh-copy f6" htmlFor="firstname">First Name</label>
                            <input
                                name="firstname"
                                type="text"
                                placeholder="Enter your first name"
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
                            <label className="db fw6 lh-copy f6" htmlFor="lastname">Last Name</label>
                            <input
                                name="lastname"
                                type="text"
                                placeholder="Enter your last name"
                                value={values.lastname}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={errors.lastname && touched.lastname && "error"}
                            />
                            {errors.lastname && touched.lastname && (
                                <div className="input-feedback">{errors.lastname}</div>
                            )}
                        </div>
                        <div className="mt3 tl">
                            <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
                            <input
                                name="email"
                                type="text"
                                placeholder="Enter your email"
                                value={values.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={errors.email && touched.email && "error"}
                            />
                            {errors.email && touched.email && (
                                <div className="input-feedback">{errors.email}</div>
                            )}
                        </div>
                        <div className="mv3 tl">
                            <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
                            <input
                                name="password"
                                type="password"
                                autoComplete="on"
                                placeholder="Enter your password"
                                value={values.password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={errors.password && touched.password && "error"}
                            />
                            {errors.password && touched.password && (
                                <div className="input-feedback">{errors.password}</div>
                            )}
                        </div>
                        </fieldset>
                        <div className="">
                        <button className="b ph3 pv2 input-reset ba b--black bg-transparent pointer f6 dib" type="submit">
                            Register
                        </button>
                        </div>
                    </div>
                    </form>
                </article>
            );
        }}
    </Formik>

)

export default Register;