'use client';

import { Models } from 'appwrite';
import { useEffect, useRef, useState } from 'react';

const QuestionCard = ({ ques }: { ques: Models.Document }) => {
  const [height, setHeight] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      setHeight(ref.current.clientHeight);
    }
  }, [ref]);

  return (
    <div
        ref={ref}
        className=''
    >
    {/* TODO: Implement the UI */}
    </div>
  )

};

export default QuestionCard;
