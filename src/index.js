import React from 'react';
import initFullStory from './fullstory-script';
import initMockFullStory from './mock-fullstory-script';

const canUseDOM = !!(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
);

const includeFullStory =
  process.env.NODE_ENV !== 'test' ? initFullStory : initMockFullStory;

export const getWindowFullStory = () => window[window['_fs_namespace']];

export const FullStoryAPI = (fn, ...args) => {
  if (canUseDOM && getWindowFullStory()) {
    return getWindowFullStory()[fn].apply(null, args);
  }

  return false;
};

export default class FullStory extends React.Component {
  constructor(props) {
    super(props);

    const { org, debug, host, namespace } = props;

    if (!org || !canUseDOM) {
      return;
    }

    if (!getWindowFullStory()) {
      window['_fs_debug'] = debug || false;
      window['_fs_host'] = host || 'fullstory.com';
      window['_fs_org'] = org;
      window['_fs_namespace'] = namespace || 'FS';

      includeFullStory();
    }
  }

  shouldComponentUpdate() {
    return false;
  }

  componentWillUnmount() {
    if (!canUseDOM || !getWindowFullStory()) return false;

    getWindowFullStory().shutdown();

    delete getWindowFullStory();
  }

  render() {
    return false;
  }
}
