import { useEffect, useRef, useState } from 'react';
import './App.style.css'
import randomImage from './radomImage';
function App() {
  const [scrollPos,setScrollPos] = useState(0);
  const randomCards = useRef(Array.from({length : 200}, ()=>parseInt(Math.random() * 100) % randomImage.length)).current;
  const NodePadding = 2;
  const windowHeight = window.innerHeight;

  function onScroll() {
    setScrollPos(window.scrollY);
  }
  useEffect(() => {
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);  
  return (
    <div className="layout">
      <div className='container FC'>
        {randomCards.map((v,i)=>(
          <div key={i} className='cardContainer FC'>

            <div className='cardImageContainer FC'>
              {scrollPos < 420 * (i + 1 + NodePadding) && (scrollPos + windowHeight) > 420 * (i - 1 - NodePadding) ? <img className='cardImage' src={randomImage[v]}></img> :<div className='skeleton'></div>}
              {/* <img className='cardImage' src={randomImage[v]}></img> */}
            </div>
            <div className='textContainer'>
              {scrollPos < 420 * (i + 1 + NodePadding) && (scrollPos + windowHeight) > 420 * (i - 1 - NodePadding)? 'virtual' : 'hide'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
