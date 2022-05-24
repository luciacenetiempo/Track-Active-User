const checkUserActivity = (
  () => {
    let userIsActive = false;
    let timer = false;
    var time;
    var elementSelector;
    const eventsList = [
      'keypress', 'mousemove', 'touchmove', 'click', 'scroll'
    ]

    const config = (milliseconds, element) => {
      time = milliseconds;
      elementSelector = document.querySelector(element);
      eventsList.forEach(
        (event) => document.addEventListener(event, handleActivity)
      )
    }

    const handleActivity = () => { 
      userIsActive = true;
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
    }

    const checkActivity = userIsActive => {
      userIsActive ? elementSelector.classList.remove('inactive') : elementSelector.classList.add('inactive');
      userIsActive ? elementSelector.innerText = 'Ehila!' : elementSelector.innerText = 'Are you still here?';
      userIsActive ? document.querySelector('.content').classList.remove('inactive') : document.querySelector('.content').classList.add('inactive');
    }
    
    return {
      init: config,
    };
  }
)();
checkUserActivity.init(3000, 'h1');