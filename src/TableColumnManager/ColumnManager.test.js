import { renderHook } from '@testing-library/react-hooks';
import { demoHeadingsData } from './demoData';
import useColumnWidthManager from './ColumnManager';

const DEMO_HEADINGS = demoHeadingsData;

const defaultProps = {
  headingsDataList: DEMO_HEADINGS,
};
describe('useColumnWidthManager', () => {
  test('should work', async () => {
    const { result } = renderHook(() => useColumnWidthManager(defaultProps));
    expect(result.current).toMatchSnapshot();
  });

  test('should prepare input data', () => {
    const { result } = renderHook(() =>
      useColumnWidthManager({
        headingsDataList: DEMO_HEADINGS,
        btnColumnBtnCount: 1,
      })
    );
    expect(result.current).toMatchSnapshot();
  });
  // TODO: For some reason this causes a memory leak
  test.skip('should allow auto column width', () => {
    const { result } = renderHook(() =>
      useColumnWidthManager({
        headingsDataList: DEMO_HEADINGS,
        autoWidth: true,
        containerRef: {
          current: {
            // clientWidth: 1000,
          },
        },
      })
    );
    expect(result.current).toMatchSnapshot();
  });
  test('should update table width if input columns changes', async () => {
    const { result, rerender } = renderHook((props) => useColumnWidthManager(props), {
      initialProps: defaultProps,
    });
    const newHeadingsData = DEMO_HEADINGS.slice(1);
    expect(result.current.columnWidths.length).toEqual(18);
    expect(result.current.tableWidth).toEqual(1927);
    rerender({ ...defaultProps, headingsDataList: newHeadingsData });
    expect(result.current.columnWidths.length).toEqual(17);
    expect(result.current.tableWidth).toEqual(1886);
  });
});
