import { shallow } from 'enzyme';
import React from 'react';
import App from '../app';

describe('App', () => {
  it('is rendered', () => {
    const component = shallow(<App />);
    expect(component.text()).toBe('Hello world!');
  });
});
