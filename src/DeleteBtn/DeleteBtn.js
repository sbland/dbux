import React, { useState, useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';

const DeleteBtn = ({ handleConfirmedDelete, object, className, disabled, notes, PopupPanel }) => {
  const [requestDelete, setRequestDelete] = useState(false);
  const [areYouSure, setAreYouSure] = useState(false);

  useEffect(() => {
    if (areYouSure && requestDelete) {
      handleConfirmedDelete();
      setAreYouSure(false);
      setRequestDelete(false);
    }
  }, [areYouSure, requestDelete, handleConfirmedDelete]);

  return (
    <>
      <PopupPanel isOpen={requestDelete && !areYouSure} handleClose={() => setRequestDelete(false)}>
        <div>
          <h1>Are You Sure?</h1>
          <div>
            <button
              type="button"
              className="areYouSureCancel button-one"
              onClick={() => setRequestDelete(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="areYouSureAccept button-two"
              onClick={() => setAreYouSure(true)}
            >
              Delete {object}
            </button>
          </div>
          {notes && <div>{notes}</div>}
        </div>
      </PopupPanel>
      <button
        disabled={disabled}
        onClick={() => setRequestDelete(true)}
        type="button"
        className={`deleteBtn ${className}`}
      >
          <span className="emoji" role="img" aria-label="Delete">
            🗑️
          </span>
      </button>
    </>
  );
};

DeleteBtn.propTypes = {
  handleConfirmedDelete: PropTypes.func.isRequired,
  object: PropTypes.string.isRequired,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  notes: PropTypes.string,
};

DeleteBtn.defaultProps = {
  className: 'button-one',
  disabled: false,
  notes: '',
};

export default DeleteBtn;
