# Track Active User
Track if the user is still active on the page in react version!

The goal is to know if the user is still carrying out actions on our page or if he has stopped his navigation

## React Mode
The same game can be played with react and it's more fun.
All I'm going to do is create a React Hook called **useIsActive**.

### The Hook
So, in my src folder I create a file called `useIsActive.js`
I import the native functionality of react **useState, useEffect, useRef**

```javascript
import {useState, useEffect, useRef} from "react";
```

Now I create my hook with an export function that I will call **useIsActive** which takes as a parameter the `time` (expressed in milliseconds) and which returns as a result the user's status as a boolean value.

```javascript
export function useIsActive(time) {
    return userIsActive;
}
```

Inside this function, to change the user's status we use react's useState functionality.
So I create my state called userIsActive, define the function that will handle it by calling it "setActive" and set it by default with useState in true.
I also create a reference for my timer and map in an array the types of events that will signal me that the user is active.

```javascript
const [userIsActive, setActive] = useState(true);
const timer = useRef();
const eventsList = [
  'keypress', 'mousemove', 'touchmove', 'click', 'scroll'
]
```

With useEffect I'm going to manage my user's status changes based on his actions, maintaining the same logic used for the vanilla javascript version.

For each event mapped in the eventsList array I launch an event listener that executes the `handleActivity` callback.

Since **handleActivity** is called as a callback when the user executes a page action, I set his state to true with `setActive (true)`, then I check if there is already a timer and stop it with the `clearTimeout` and I initialize a new one with the `setTimeout` which will set the user's status to false after the time defined in milliseconds that we are passing to our hook.

```javascript
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
```

As written above the result of my hook will be a boolean value. Let's move on to the visual result

### What happens in App.js?

First of all I import my hook

```javascript
import {useIsActive} from './useIsActive';
```

Then in the App function I create a const that will manage the result of the hook to allow our application to react and manipulate the result according to the user state.
Based on the `true` or `false` that is returned by `userIsActive` the container and the h1 will have an active or inactive class, I also change the message shown inside the h1.


```javascript
function App() {
  const userIsActive = useIsActive(3000);
  return (
    <>
      <div  className={`content ${userIsActive ? 'active' : 'inactive'}`}>
        <h1 className={userIsActive ? 'active' : 'inactive'}>
          {userIsActive ? 'Ehila!' : 'Are you still here?'}
        </h1>
      </div>
    </> 
  );
}
export default App;
```