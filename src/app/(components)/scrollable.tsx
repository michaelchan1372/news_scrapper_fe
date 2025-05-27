import React, { useRef, useState, useEffect } from 'react';

type ScrollableCellProps = {
  content: string;
};

export const ScrollableCell: React.FC<ScrollableCellProps> = ({ content }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollInterval = useRef<NodeJS.Timeout | null>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

  const updateArrows = () => {
    const el = scrollRef.current;
    if (!el) return;
    setShowLeft(el.scrollLeft > 0);
    setShowRight(el.scrollLeft + el.clientWidth < el.scrollWidth);
  };

  const startScroll = (direction: 'left' | 'right') => {
    stopScroll();
    scrollInterval.current = setInterval(() => {
      const el = scrollRef.current;
      if (el) {
        el.scrollLeft += direction === 'left' ? -12 : 12;
        updateArrows();
      }
    }, 30);
  };

  const stopScroll = () => {
    if (scrollInterval.current) {
      clearInterval(scrollInterval.current);
      scrollInterval.current = null;
    }
  };

  useEffect(() => {
    updateArrows();
    const el = scrollRef.current;
    if (el) el.addEventListener('scroll', updateArrows);
    return () => {
      if (el) el.removeEventListener('scroll', updateArrows);
    };
  }, []);

  return (
    <td className="py-2 px-2 max-w-2xl border-b border-gray-300" >
      <div className="relative flex items-center" onMouseLeave={stopScroll}>
        {/* Left Arrow */}
        {showLeft && (
          <div
            onMouseEnter={() => startScroll('left')}
            onMouseLeave={stopScroll}
            className="absolute left-0 z-10 h-full w-6 bg-gradient-to-r from-white to-transparent text-gray-600 flex items-center justify-center cursor-pointer"
          >
            ◀
          </div>
        )}

        {/* Scrollable Content */}
        <div
          ref={scrollRef}
          className="overflow-x-auto max-w-full custom-scrollbar px-6"
        >
          <div className="min-w-max whitespace-nowrap">{content}</div>
        </div>

        {/* Right Arrow */}
        {showRight && (
          <div
            onMouseEnter={() => startScroll('right')}
            onMouseLeave={stopScroll}
            className="absolute right-0 z-10 h-full w-6 bg-gradient-to-l from-white to-transparent text-gray-600 flex items-center justify-center cursor-pointer"
          >
            ▶
          </div>
        )}
      </div>
    </td>
  );
};

export default ScrollableCell;
