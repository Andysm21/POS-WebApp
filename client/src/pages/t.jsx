import React, { useRef } from "react";
import * as ReactToPrintModule from 'react-to-print';
const ReactToPrint = ReactToPrintModule.default;
const ComponentToPrint = React.forwardRef((props, ref) => (
  <div ref={ref}>Hello, this is the content to print!</div>
));

export default function TestPrint() {
  const ref = useRef();
  return (
    <div>
      <ComponentToPrint ref={ref} />
      <ReactToPrint
        trigger={() => <button>Print</button>}
        content={() => ref.current}
      />
    </div>
  );
}