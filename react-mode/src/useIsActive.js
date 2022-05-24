import { useState, useEffect, useRef } from "react";

export function useIsActive(time) {
    const [userIsActive, setActive] = useState(true);
    const timer = useRef();
    const eventsList = [
      'keypress', 'mousemove', 'touchmove', 'click', 'scroll'
    ]
    useEffect(
        () => { 
          const handleActivity = () => {
            setActive(true)
            if(timer.current){
              window.clearTimeout(timer.current)
            }
            timer.current = window.setTimeout(
              () => {
                setActive(false)
              }, time
            )
          }
          eventsList.forEach(
            (event) => document.addEventListener(event, handleActivity)
          )

          return () => {
            eventsList.forEach(
              (event) => document.removeEventListener(event, handleActivity)
            )
          }
        }, [time]
    );
    return userIsActive;
}