# 가상 스크롤 구현

필요 이상으로 긴 스크롤을 효과적으로 관리하기 위한 가상 스크롤 구현.


## 구현 목적

무한 스크롤 혹은 긴 스크롤은 화면에 출력되지 않는 부분도 렌더링이 된 상태이기 때문에 리소스가 낭비가 된다.
이를 해결하기 위해서 화면에 나타나지 않는 부분은 스켈레톤 혹은 빈 영역으로 출력하면 리소스를 최소화 할 수 있다. 

## 구현 방법
우선 가상 스크롤이 구현되지 않은 간단한 포스팅 리스트이다.

```jsx
import { useEffect, useRef, useState } from 'react';
import './App.style.css'
import randomImage from './radomImage';
function App() {
  const randomCards = useRef(Array.from({length : 200}, ()=>parseInt(Math.random() * 100) % randomImage.length)).current;

  return (
    <div className="layout">
      <div className='container FC'>
        {randomCards.map((v,i)=>(
          <div key={i} className='cardContainer FC'>
            <div className='cardImageContainer FC'>
              <img className='cardImage' src={randomImage[v]}></img>
            </div>
            <div className='textContainer'>
              display
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
```

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/57f4b6e8-409e-45e5-9130-7909fa1a8cbc/Untitled.png)

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/c2d6583a-458f-4d61-85ca-1dfc9ec5df05/Untitled.png)

개발자 도구에서 확인하면 모든 게시물이 렌더링이 된 것을 확인할 수 있다.

이제 차근차근 가상 스크롤을 구현해보자 

### 1. 스크롤 위치 확인

가상 스크롤을 구현하기 위해서 가장 먼저 해야 할 부분은 현재 스크롤이 어디에 위치하고 있는지 확인하는 것이다.

현재 스크롤 위치를 확인하기 위해서 scroll EventListener를 추가해보자.

```jsx
const [scrollPos,setScrollPos] = useState(0);

...

function onScroll() {
    setScrollPos(window.scrollY);
  }
  
  useEffect(() => {
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

console.log(scrollPos);
...
```

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/0425eedc-7ed9-4f0a-b428-e8cb0ab9cdf5/Untitled.png)

콘솔 창에 현재 스크롤 위치를 출력하는 것을 확인할 수 있다.

### 2. 현재 창의 크기 확인하기

스크롤 위치를 확인하였으면 현재 창의 크기를 확인해야한다.

현재 창의 크기를 확인해야 한 화면에 몇 개의 포스팅이 들어가는지 확인할 수 있기 때문이다.

현재 창 크기를 확인하는 방법은 window.innerHeight로 쉽게 확인할 수 있다.

```jsx
const windowHeight = window.innerHeight;
```

### 3. 보여지는 부분만 실제 데이터 넣기.

현재 보여지는 부분만 실제 데이터를 넣기 위해 조건문을 추가해준다.

```jsx
...

return (
    <div className="layout">
      <div className='container FC'>
        {randomCards.map((v,i)=>(
          <div key={i} className='cardContainer FC'>
            <div className='cardImageContainer FC'>
							//해당 부분의 420은 포스팅 하나의 height이다.
              {scrollPos < 420 * (i + 1) && (scrollPos + windowHeight) > 420 * (i) 
								? <img className='cardImage' src={randomImage[v]}></img> 
								:<div className='skeleton'></div>}
            </div>
            <div className='textContainer'>
              {scrollPos < 420 * (i + 1) && (scrollPos + windowHeight) > 420 * (i)
								? 'display' 
								: 'hide'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

...

```

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/8ad28368-1ddc-4743-bee1-29f814e2a0f3/Untitled.png)

현재 보여지는 3개의 포스팅만 display로 표기가 되어 있고, 다른 포스팅은 모두 hide처리가 된 것을 확인할 수 있다.

### 4. NodePadding 추가하기

가상 스크롤을 위와 같이 화면에 보여지는 것만 출력하면 성능적으로 좋기는 하지만 빠르게 스크롤 할 경우 데이터 로드가 느려 데이터가 안 보일 수 있다. 

그렇기 때문에 보여지는 부분에 더해 여유분을 미리 로드해두는 것이 nodePadding이다.

nodePadding을 추가하는 것은 간단하다.

```jsx
...

const NodePadding = 2;

...

{randomCards.map((v,i)=>(
          <div key={i} className='cardContainer FC'>
            <div className='cardImageContainer FC'>
              {scrollPos < 420 * (i + 1 + NodePadding) && (scrollPos + windowHeight) > 420 * (i - 1 - NodePadding) ? <img className='cardImage' src={randomImage[v]}></img> :<div className='skeleton'></div>}
            </div>
            <div className='textContainer'>
              {scrollPos < 420 * (i + 1 + NodePadding) && (scrollPos + windowHeight) > 420 * (i - 1 - NodePadding)? 'display' : 'hide'}
            </div>
          </div>
        ))}

...

```

## 마치며

최근 프로젝트 성능을 높이기 위해 다양한 방법을 찾아보며 알게 된 가상 스크롤을 직접 구현해보았는데 구현은 매우 간단하지만 성능 향상은 매우 좋다는 것을 알았다.

이후에는 디바운스 추가를 통한 성능 추가 개선, 동적 크기의 포스팅 관리 등 다양한 개선을 추가적으로 할 수 있을 것 같다.
