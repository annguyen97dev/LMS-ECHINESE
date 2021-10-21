import { time } from "console";
import React, { useState, useEffect } from "react";

// import './styles.module.scss';

const CountDown = (props) => {
  const add_minutes = props.addMinutes;

  const calculateTimeLeft = () => {
    let timeLeft = {};
    let difference = +add_minutes - +new Date();

    let calSeconds = Math.floor((difference / 1000) % 60);
    let calMinutes = Math.floor((difference / 1000 / 60) % 60);

    if (difference >= 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: calMinutes < 10 ? "0" + calMinutes : calMinutes,
        seconds: calSeconds < 10 ? "0" + calSeconds : calSeconds,
      };
    } else {
      // setShowPopup(true);
      props.onFinish && props.onFinish();
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState<any>(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearTimeout(timer);
  });

  return (
    <div className="countdown">
      {timeLeft.hours > 0 && <span className="hours">{timeLeft.hours}</span>}
      <span className="minutes">{timeLeft.minutes}</span>
      <span className="seconds">{timeLeft.seconds}</span>
    </div>
  );
};

export default CountDown;
