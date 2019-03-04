import React from 'react';
import { render } from 'react-dom';
import CountUp from '../../src';

const App = () => (
 <CountUp start={1234567} type='money' />
);
render(<App />, document.getElementById("root"));
