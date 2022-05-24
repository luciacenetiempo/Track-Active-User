import { useIsActive } from './useIsActive';
import './App.css';

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
