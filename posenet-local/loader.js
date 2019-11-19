import * as posenet from "/vendors/posenet.js";

const BASE_URL = '/models/';

const checkpoints = {
  1.01: {
    url: BASE_URL + 'mobilenet_v1_101/',
    architecture: posenet.mobileNetArchitectures[100]
  },
  1.0: {
    url: BASE_URL + 'mobilenet_v1_100/',
    architecture: posenet.mobileNetArchitectures[100]
  },
  0.75: {
    url: BASE_URL + 'mobilenet_v1_075/',
    architecture: posenet.mobileNetArchitectures[75]
  },
  0.5: {
    url: BASE_URL + 'mobilenet_v1_050/',
    architecture: posenet.mobileNetArchitectures[50]
  }
};

async function loadModel(multiplier) {
  const mobileNetModel = await loadMobileNetModel(multiplier);

  return new posenet.PoseNet(mobileNetModel);
}

async function loadMobileNetModel(multiplier) {
  const checkpoint = checkpoints[multiplier];

  const checkpointLoader = new posenet.CheckpointLoader(checkpoint.url);

  const variables = await checkpointLoader.getAllVariables();

  return new posenet.MobileNet(variables, checkpoint.architecture);
}
