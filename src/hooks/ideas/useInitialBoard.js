import { useEffect, useState } from 'react';

const useInitialBoard = () => {
  const [boardId, setBoardId] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedId = localStorage.getItem('b');
      if (savedId) {
        setBoardId(savedId === 'null' ? null : savedId);
      }
    }
  }, []);

  const updateBoardId = (newBoardId) => {
    setBoardId(newBoardId);
    if (typeof window !== 'undefined') {
      localStorage.setItem('b', String(newBoardId ?? 'null'));
    }
  };

  return { boardId, setBoardId: updateBoardId };
};

export default useInitialBoard;
