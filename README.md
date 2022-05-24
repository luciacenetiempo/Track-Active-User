# Track Active User
Track if the user is still active on the page in a few lines of javascript (and in react version!)

The goal is to know if the user is still carrying out actions on our page or if he has stopped his navigation.

## Vanilla Javascript Mode
We have a complex function called `checkUserActivity` which has its own `init` method to which we will pass some simple configuration parameters.

```javascript
const checkUserActivity = (
  () => {
    const config = (milliseconds, element) => {
      ...
    }
    ....
    return {
      init: config,
    };
  }
)();
checkUserActivity.init(3000, 'h1');
``` 


First of all in the function I declare and initialize some variables that I will use later:

```javascript
let userIsActive = false;
let timer = false;
var time;
var elementSelector;
``` 

I create an array with all the events that report user actions to me

```javascript
const eventsList = [
  'keypress', 'mousemove', 'touchmove', 'click', 'scroll'
]
```

### The config function

Let's now enter the heart of the script.
The first function I create is that of config which will receive two parameters from the init method.

The parameters are: **time (expressed in milliseconds)** in which the user remains stationary before our callBack starts and **element** with which we want to interact.

In this function I then start the event Listener on all the events that I have mapped in the **eventsList** array and for each one of this event I start the function **handleActivity** that handles the user activity

```javascript
const config = (milliseconds, element) => {
  time = milliseconds;
  elementSelector = document.querySelector(element);
  eventsList.forEach(
    (event) => document.addEventListener(event, handleActivity)
  )
}
```

### What does **handleActivity** do?

This is the function that changes the user's status from active to inactive and vice versa.
This function is called every time the user performs an action, so the very first thing to do is to set the user's status to active.

```javascript
userIsActive = true;
```

I then check if a timer is already active and deactivate it by immediately invoking the callback function with the user status `active` as a parameter.
In the meantime I initialize a new timer with the **setTimeout** that will execute the callback with the user status `inactive` when the user stopped his navigation

```javascript
if (timer) {
  clearTimeout(timer);
  checkActivity(userIsActive);
}
timer = window.setTimeout(
  () => {
    userIsActive = false;
    checkActivity(userIsActive);
  }, time
)
```

### Let's move on to the callback

With **checkActivity** I do some manipulations on the dom based on the user's status.
***This is where you can make anything happen.*** 
For example you can show a popup or as in my case change classes and text of the `elementSelector`


```javascript
const checkActivity = userIsActive => {
  userIsActive ? elementSelector.classList.remove('inactive') : elementSelector.classList.add('inactive');
  userIsActive ? elementSelector.innerText = 'Ehila!' : elementSelector.innerText = 'Are you still here?';
  userIsActive ? document.querySelector('.content').classList.remove('inactive') : document.querySelector('.content').classList.add('inactive');
}
```


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