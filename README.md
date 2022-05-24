# Track Active User
Track if the user is still active on the page in a few lines of javascript (and in react version!)

The goal is to know if the user is still carrying out actions on our page or if he has stopped his navigation.

## Javascript
We have a complex function called `checkUserActivity` which has its own `init` method to which we will pass some simple configuration parameters.
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
This function is called every time the user performs an action, so the very first thing to do is to set the user's status to active `userIsActive = true;`

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