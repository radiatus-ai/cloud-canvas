import { useCallback, useState } from 'react';

const useNodeInteractions = () => {
  const [isDebugMode, setIsDebugMode] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  const toggleDebugMode = useCallback(() => {
    setIsDebugMode((prev) => !prev);
  }, []);

  return { isDebugMode, isExpanded, toggleExpand, toggleDebugMode };
};

export default useNodeInteractions;
