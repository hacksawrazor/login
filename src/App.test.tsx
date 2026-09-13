import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('three', () => {
  class MockObject3D {
    rotation = { x: 0, y: 0 };
    position = { set: jest.fn() };
  }

  class MockGeometry {
    setAttribute = jest.fn();
  }

  class MockMaterial {}

  class MockRenderer {
    domElement = document.createElement('canvas');
    setSize = jest.fn();
    setPixelRatio = jest.fn();
    render = jest.fn();
  }

  class MockScene {
    add = jest.fn();
  }

  class MockGroup extends MockObject3D {
    add = jest.fn();
  }

  class MockCamera extends MockObject3D {
    aspect = 1;
    updateProjectionMatrix = jest.fn();
  }

  return {
    AdditiveBlending: 2,
    BufferAttribute: class {},
    BufferGeometry: MockGeometry,
    DodecahedronGeometry: MockGeometry,
    Group: MockGroup,
    IcosahedronGeometry: MockGeometry,
    Mesh: MockObject3D,
    MeshBasicMaterial: MockMaterial,
    OctahedronGeometry: MockGeometry,
    PerspectiveCamera: MockCamera,
    Points: MockObject3D,
    PointsMaterial: MockMaterial,
    Scene: MockScene,
    WebGLRenderer: MockRenderer,
  };
});

describe('login screen', () => {
  it('renders the welcome heading and sign-in form', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: 'Welcome back' })).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
  });
});
