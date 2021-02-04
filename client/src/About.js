import React from 'react';

class About extends React.Component{

    render() {
        return(
            <div>
                <div className = "tc">
                    <h1>What is Covid19 ?</h1>
                </div>
                <div className = "pa3">
                    <p>
                    Corona Virus Disease 2019(COVID-19) refers to the pneumonia caused by the 2019 coronavirus, which is a new strain of coronavirus that has never been found in humans before.
                    Common signs of people infected with coronavirus include respiratory symptoms, fever, cough, shortness of breath, and difficulty breathing. In more severe cases, infection can lead to pneumonia, 
                    severe acute respiratory syndrome, kidney failure, and even death. There is currently no specific treatment for COVID-19.
                    The main routes of transmission of the virus are the respiratory droplets and contact transmission. The transmission routes of aerosol and feces-mouth have yet to be further clarified. 
                    Epidemiological investigations have shown that most cases can be traced to close contact with confirmed cases.
                    In January 2020, COVID-19 broke out in Asia and spread to the whole world from then on. On March 11, 2020, the World Health Organization(WHO) declared the rapid spreading coronavirus outbreak a pandemic, 
                    acknowledging what has seemed clear for some time — the virus would likely spread to all countries on the globe.
                    </p>
                </div>
            </div>
            
        )
    }
}

export default About;