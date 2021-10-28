import { useCallback, useEffect, useState } from 'react';

let hidePanelTimeout = null;

const useAutoHidePanel = (menuRef, floating, showPanelOverride, HIDETIME = 900) => {
  const [showPanel, setShowPanel] = useState(() => showPanelOverride);

  const handleClickOutside = useCallback(
    (event) => {
      if (showPanel && menuRef.current && !menuRef.current.contains(event.target)) {
        hidePanelTimeout = setTimeout(() => {
          setShowPanel(false);
          document.removeEventListener('mouseover', handleClickOutside);
        }, HIDETIME);
      } else {
        clearTimeout(hidePanelTimeout);
      }
    },
    [HIDETIME, menuRef, showPanel]
  );

  useEffect(() => {
    if (floating) {
      document.addEventListener('mouseover', handleClickOutside);
    }
    return () => {
      // Unbind the event listener on clean up
      clearTimeout(hidePanelTimeout);
      document.removeEventListener('mouseover', handleClickOutside);
    };
  }, [showPanel, floating, handleClickOutside]);

  return [showPanel, setShowPanel];
};

export default useAutoHidePanel;
