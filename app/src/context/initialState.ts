import { State } from '../interfaces/Interfaces';

// This is the state that will be set for a new project or when the user resets the state of their project
export const initialState: State = {
  name: '',
  isLoggedIn: false,
  components: [
    {
      id: 1,
      name: 'index',
      style: {},
      code: '<div>Drag in a component or HTML element into the canvas!</div>',
      children: []
    }
  ],
  projectType: 'Next.js',
  rootComponents: [1],
  canvasFocus: { componentId: 1, childId: null },
  nextComponentId: 2,
  nextChildId: 1
};

export default initialState;
