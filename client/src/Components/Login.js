import React from 'react';
import { Formik } from "formik";
import * as Yup from "yup";

const Login = ({changeRoute, routeState}) => (

    <Formik
        initialValues={{ email: "", password: "" }}
        onSubmit={(values) => {
            fetch('/api/user/login', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: values.email
                    , password: values.password
                })
            })
            .then(response => response.json())
            .then(response => {                
                if (response.token) {
                    window.localStorage.clear();
                    window.localStorage.setItem('token', response.token);
                    window.localStorage.setItem('email', response.email);
                    window.localStorage.setItem('firstname', response.firstName);
                    window.localStorage.setItem('lastname', response.lastName);
                    changeRoute('home');
                    //TODO store the user info in state if needed?
                } else if (response.error === 'Invalid email/password') {
                    //TODO show error
                    changeRoute("invalid");
                } else {
                    //TODO show please try again
                }
                    
            })    
        }}

        validationSchema={Yup.object().shape({
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
                        <fieldset id="sign_in" className="ba b--transparent ph0 mh0">
                        <legend className="f1 fw6 ph0 mh0">Sign In</legend>
                        {
                            routeState === 'invalid'
                            ?<div className="input-feedback">Incorrect username/password</div>
                            :<div></div>
                        }
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
                            Sign in
                        </button>
                        </div>
                        <div className="lh-copy mt3">
                        <p className="f6 link dim black db pointer" onClick = {() => changeRoute('register')}>Register</p>
                        </div>
                    </div>
                    </form>
                </article>
            );
        }}
    </Formik>
    
)

export default Login;