import "@testing-library/jest-dom";
import { TextEncoder } from "util";

global.TextEncoder = TextEncoder;

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
  useLocation: () => ({ pathname: "/" }),
}));

const mNotification = jest.fn();
Object.defineProperty(global, "Notification", {
  value: mNotification,
});

const staticMembers = {
  requestPermission: jest.fn().mockImplementation(() => {
    console.log("reached here");
    return "granted";
  }),
  permission: "granted",
};

Object.assign(global.Notification, staticMembers);
