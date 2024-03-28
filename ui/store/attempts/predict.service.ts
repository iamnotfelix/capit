import { Prediction } from "../../src/models";
import axiosService from "../../src/utils/axios";

export const getPredictions = () => {
  const query = `{
    predictions { 
      id 
      results 
    }
  }`;
  return axiosService
    .post(`predict/graphql`, JSON.stringify({ query: query }))
    .then((response) => {
      const data: Prediction[] = response.data.data.predictions;
      return data;
    });
  // .catch((err) => {
  //   console.log(err);
  //   // throw Error(err);
  // });
};

export const addPrediction = (imageBase64: string) => {
  const mutation = `mutation AddPrediction($image: String) {
    addPrediction(image: $image) {
      prediction {
        id
        results
      }
    }
  }`;
  return axiosService
    .post(`predict/graphql`, {
      query: JSON.stringify({ mutation, variables: imageBase64 }),
    })
    .then((response) => {
      console.log(response);
      console.log(response.data);
    })
    .catch((err) => {
      // console.log(err);
      throw Error(err);
    });
};
