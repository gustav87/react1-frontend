import './Carousel.css';
import { useEffect, useRef, useState } from "react";

function Carousel() {
  const [index, setIndex] = useState<number>(0);
  const [intervalHandle, setIntervalHandle] = useState<ReturnType<typeof setTimeout>>();
  const itemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
      const handle = setInterval(handleSetIndex, 3000);
      setIntervalHandle(handle);
      return () => clearInterval(intervalHandle);
  }, []);

  const items = [
    {
      name: "a",
      content: "aaa",
      color: "red",
    },
    {
      name: "b",
      content: "bbb",
      color: "green",
    },
    {
      name: "c",
      content: "ccc",
      color: "blue",
    },
  ];

  const handleSetIndex = () => {
    fadeOutItem();
    setTimeout(() => {
      setIndex((i) => i >= items.length - 1 ? 0 : i + 1);
      fadeInItem();
    }, 400);
  }

  const fadeOutItem = (): void => {
    if (!itemRef.current) return;
    itemRef.current.style.animation = "fade-out 500ms ease-out";
  }

  const fadeInItem = (): void => {
    if (!itemRef.current) return;
    itemRef.current.style.animation = "fade-in 500ms ease-in";
  }

  const manualToggle = (i: number) => {
    if (index === i) return;
    fadeOutItem();
    setTimeout(() => {
      setIndex(i);
      fadeInItem();
    }, 400);
  };

  return (
    <div className="flex justify-around w-2/4">
      <div className="flex flex-col" onMouseOver={() => clearInterval(intervalHandle)}>
        <div className="carousel">
          <div ref={itemRef} className="carousel-item fade-out fade-in" style={{backgroundColor: items[index].color}}></div>
        </div>
        <div className="flex justify-center mt-1">
          {items.map((x, i) => (
            <div className={`carousel-navigation ${index === i ? "navActive" : ""}`} key={x.name} title={`${i}`} onClick={() => manualToggle(i)}></div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Carousel;
