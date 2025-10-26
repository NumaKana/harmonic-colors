/**
 * CameraReset - Reset camera to default settings for single view
 */

import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { OrthographicCamera } from 'three';

const CameraReset = () => {
  const { camera } = useThree();

  useEffect(() => {
    const cam = camera as OrthographicCamera;
    if (cam) {
      // Reset to default orthographic camera settings
      cam.left = -1;
      cam.right = 1;
      cam.top = 1;
      cam.bottom = -1;
      cam.position.set(0, 0, 5);
      cam.updateProjectionMatrix();
    }
  }, [camera]);

  return null;
};

export default CameraReset;
