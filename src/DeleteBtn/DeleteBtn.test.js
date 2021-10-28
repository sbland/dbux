import React from 'react';
import { shallow, mount } from 'enzyme';
import DeleteBtn from './DeleteBtn';

const handleConfirmedDelete = jest.fn();
const defaultProps = {
  handleConfirmedDelete,
  object: 'Item',
  className: 'demoClass',
  disabled: false,
  PopupPanel: ({children}) => children
};

describe('DeleteBtn', () => {
  it('Renders', () => {
    shallow(<DeleteBtn {...defaultProps} />);
  });
  it('Matches Snapshot', () => {
    const component = shallow(<DeleteBtn {...defaultProps} />);
    const tree = component.debug();
    expect(tree).toMatchSnapshot();
  });
  describe('Unit Tests', () => {
    let component;
    beforeEach(() => {
      component = mount(<DeleteBtn {...defaultProps} />);
    });
    describe('are you sure process', () => {
      const clickDeleteBtn = (c) => {
        const deleteBtn = c.find('.deleteBtn');
        deleteBtn.simulate('click');
      };
      test('should open are you sure panel when delete button pressed', () => {
        let areYouSurePanel = component.find(PopupPanel);
        expect(areYouSurePanel.props().isOpen).toEqual(false);
        clickDeleteBtn(component);
        areYouSurePanel = component.find(PopupPanel);
        expect(areYouSurePanel.props().isOpen).toEqual(true);
      });
      test('should call confirm delete id we click accept button in are you sure panel', () => {
        clickDeleteBtn(component);
        let areYouSurePanel = component.find(PopupPanel);
        const areYouSureAcceptBtn = areYouSurePanel.find('.areYouSureAccept');
        areYouSureAcceptBtn.simulate('click');
        areYouSurePanel = component.find(PopupPanel);
        expect(areYouSurePanel.props().isOpen).toEqual(false);
        expect(handleConfirmedDelete).toHaveBeenCalledWith();
      });
    });
  });
});
