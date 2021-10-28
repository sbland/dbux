import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const ToggleBox = ({ stateIn, id, text, onChange, width, disabled }) => {
  const [state, setState] = useState(stateIn);
  const handleClick = () => {
    if (disabled) return;
    if (onChange) {
      onChange(!state, id);
    } else {
      setState(!state, id);
    }
  };

  useEffect(() => {
    setState(stateIn);
  }, [stateIn]);

  const styleOverride = text ? {} : { width };

  return (
    <div className="toggleBoxWrap">
      <button
        type="button"
        className={state ? 'button-two' : 'button-one'}
        onClick={handleClick}
        style={styleOverride}
      >
        {text || (state ? (

          <span className="emoji" role="img" aria-label="Accept">
            ✔️
          </span>

        ):
        <span className="emoji" role="img" aria-label="Reject">
        X
      </span>

        )}
      </button>
    </div>
  );
};

ToggleBox.propTypes = {
  stateIn: PropTypes.bool,
  text: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  width: PropTypes.string,
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  disabled: PropTypes.bool,
};

ToggleBox.defaultProps = {
  text: null,
  stateIn: false,
  width: '100%',
  disabled: false,
};

export default ToggleBox;

export const ToggleBoxRadioGroup = ({
  selected: selectedIn,
  className,
  children,
  onChange,
  allowDeselect,
}) => {
  const [currentSelection, setCurrentSelection] = useState(selectedIn);

  const updateSelection = (i, id) => {
    if (!allowDeselect && i === -1) return;
    if (onChange) {
      setCurrentSelection(i);
      onChange(i, id);
    } else {
      setCurrentSelection(i);
    }
  };

  const fullClassName = [className, 'list-reset'].join(' ');

  return (
    <div className="toggleBoxRadioGroup_wrap">
      <ul className={fullClassName}>
        {children.map((child, i) => {
          const newProps = {
            onChange: (j, v) => updateSelection(j ? i : -1, v),
            stateIn: i === currentSelection,
            id: child.props.id,
          };
          const newChild = React.cloneElement(child, {
            ...newProps,
          });
          return <li key={child.props.id}>{newChild}</li>;
        })}
      </ul>
    </div>
  );
};

ToggleBoxRadioGroup.propTypes = {
  selected: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  children: PropTypes.arrayOf(PropTypes.node).isRequired,
  className: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  allowDeselect: PropTypes.bool,
};

ToggleBoxRadioGroup.defaultProps = {
  className: '',
  allowDeselect: false,
};
