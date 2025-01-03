// import express, { Request, Response } from "express";
// import { preFlight } from "../../src/utils/middleware";

// describe('preFlight', () => {
//   const app = express();
//   app.get("/", preFlight, () => {
//     expect(true).toEqual(false);
//   })
//   app.listen(3000, () => {
//     console.log("Server is running on port 3000");
//   });

//   const mockRequest = {
//       params: {},
//       headers: {}
//   } as Request;

//   const mockResponse = {
//       status: jest.fn(() => ({
//       send: jest.fn(),
//       })),
//   } as unknown as Response;

//   const next = jest.fn();

//   it('returns false and sends 400 if username parameter is missing', () => {
//       app.get("/", preFlight, () => {
//         expect(true).toEqual(false);
//       })
      

//   });

//   it('returns false and sends 403 if request is not allowed', () => {
//       mockRequest.params.username = 'blacklistedUser';

//       preFlight(mockRequest, mockResponse, next);
//       expect(mockResponse.status).toHaveBeenCalledWith(403);
//   });
// });
