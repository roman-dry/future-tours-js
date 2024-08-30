import React, { useState } from "react";
import StarWarsText from "../star-wars-text/StarWarsText";
import { useSelector } from "react-redux";

import "./home.css";

const Home = () => {
    const [isAnimating, setIsAnimating] = useState(true);
    const isSkiped = useSelector(state => state.introReducer.intro.intro);

    const toggleAnimation = () => {
        setIsAnimating(!isAnimating);
    };

    return (
        <div className="home-block">
            <StarWarsText />
            {
                isSkiped && <div className="banner" style={{ marginTop: "120px", position: "relative" }}>
                <div className="slider" style={{ '--quantity': 12, animationPlayState: isAnimating ? 'running' : 'paused' }}>
                    <div className="item" style={{ '--position': 1 }}>
                        <h3 style={{ color: "white" }}>22nd century</h3>
                        <img src="/images/Tour_22.png" width="150px" alt="tour-22" />
                    </div>
                    <div className="item" style={{ '--position': 2 }}>
                        <h3 style={{ color: "white" }}>23rd century</h3>
                        <img src="/images/Tour_23.png" width="150px" alt="tour-23" />
                    </div>
                    <div className="item" style={{ '--position': 3 }}>
                        <h3 style={{ color: "white" }}>24th century</h3>
                        <img src="/images/Tour_24.png" width="150px" alt="tour-24" />
                    </div>
                    <div className="item" style={{ '--position': 4 }}>
                        <h3 style={{ color: "white" }}>25th century</h3>
                        <img src="/images/Tour_25.png" width="150px" alt="tour-25" />
                    </div>
                    <div className="item" style={{ '--position': 5 }}>
                        <h3 style={{ color: "white" }}>26th century</h3>
                        <img src="/images/Tour_26.png" width="150px" alt="tour-26" />
                    </div>
                    <div className="item" style={{ '--position': 6 }}>
                        <h3 style={{ color: "white" }}>27th century</h3>
                        <img src="/images/Tour_27.png" width="150px" alt="tour-27" />
                    </div>
                    <div className="item" style={{ '--position': 7 }}>
                        <h3 style={{ color: "white" }}>28th century</h3>
                        <img src="/images/Tour_28.png" width="150px" alt="tour-28" />
                    </div>
                    <div className="item" style={{ '--position': 8 }}>
                        <h3 style={{ color: "white" }}>29th century</h3>
                        <img src="/images/Tour_29.png" width="150px" alt="tour-29" />
                    </div>
                    <div className="item" style={{ '--position': 9 }}>
                        <h3 style={{ color: "white" }}>30th century</h3>
                        <img src="/images/Tour_30.png" width="150px" alt="tour-30" />
                    </div>
                    <div className="item" style={{ '--position': 10 }}>
                        <h3 style={{ color: "white" }}>31st century</h3>
                        <img src="/images/Tour_31.png" width="150px" alt="tour-31" />
                    </div>
                    <div className="item" style={{ '--position': 11 }}>
                        <h3 style={{ color: "white" }}>32sd century</h3>
                        <img src="/images/Tour_32.png" width="150px" alt="tour-32" />
                    </div>
                    <div className="item" style={{ '--position': 12 }}>
                        <h3 style={{ color: "white" }}>33rd century</h3>
                        <img src="/images/Tour_33.png" width="150px" alt="tour-33" />
                    </div>
                </div>
                <button onClick={toggleAnimation} style={{ marginTop: "210px", borderRadius: "5px", position: "absolute" }}>
                    {isAnimating ? 'Pause' : 'Resume'}
                </button>
            </div>
            }
            
        </div>
    )
}

export default Home;