"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hr = exports.Button = exports.Heading = exports.Text = exports.Section = exports.Container = exports.Body = exports.Head = exports.Html = void 0;
exports.default = VerificationEmail;
const react_1 = __importDefault(require("react"));
const Html = ({ children }) => (react_1.default.createElement("html", null, children));
exports.Html = Html;
const Head = () => react_1.default.createElement("head", null);
exports.Head = Head;
const Body = ({ children, style }) => (react_1.default.createElement("body", { style: style }, children));
exports.Body = Body;
const Container = ({ children, style }) => (react_1.default.createElement("div", { style: style }, children));
exports.Container = Container;
const Section = ({ children, style }) => (react_1.default.createElement("section", { style: style }, children));
exports.Section = Section;
const Text = ({ children, style }) => (react_1.default.createElement("p", { style: style }, children));
exports.Text = Text;
const Heading = ({ children, style }) => (react_1.default.createElement("h1", { style: style }, children));
exports.Heading = Heading;
const Button = ({ children, style }) => (react_1.default.createElement("button", { style: style }, children));
exports.Button = Button;
const Hr = ({ style }) => react_1.default.createElement("hr", { style: style });
exports.Hr = Hr;
function VerificationEmail({ username, otp, }) {
    return (react_1.default.createElement(exports.Html, null,
        react_1.default.createElement(exports.Head, null),
        react_1.default.createElement(exports.Body, { style: {
                backgroundColor: "#F9F9FF",
                fontFamily: "Arial, sans-serif",
                padding: "20px",
            } },
            react_1.default.createElement(exports.Container, { style: {
                    maxWidth: "450px",
                    margin: "0 auto",
                    backgroundColor: "#ffffff",
                    borderRadius: "16px",
                    padding: "32px",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                } },
                react_1.default.createElement(exports.Section, { style: {
                        textAlign: "center",
                    } },
                    react_1.default.createElement("div", { style: {
                            width: "60px",
                            height: "60px",
                            backgroundColor: "#3525CD",
                            color: "white",
                            borderRadius: "16px",
                            margin: "0 auto",
                            lineHeight: "60px",
                            fontSize: "28px",
                            fontWeight: "bold",
                        } }, "\u21C4"),
                    react_1.default.createElement(exports.Heading, { style: {
                            color: "#3525CD",
                            fontSize: "30px",
                            marginTop: "20px",
                            marginBottom: "5px",
                        } }, "SyncChat"),
                    react_1.default.createElement(exports.Text, { style: {
                            color: "#6B7280",
                            fontSize: "14px",
                        } }, "Secure communication made simple.")),
                react_1.default.createElement(exports.Hr, { style: {
                        borderColor: "#E5E7EB",
                        margin: "25px 0",
                    } }),
                react_1.default.createElement(exports.Section, null,
                    react_1.default.createElement(exports.Heading, { style: {
                            fontSize: "22px",
                            color: "#111827",
                        } }, "Verify your email"),
                    react_1.default.createElement(exports.Text, { style: {
                            color: "#4B5563",
                            fontSize: "15px",
                        } },
                        "Hello ",
                        username,
                        ","),
                    react_1.default.createElement(exports.Text, { style: {
                            color: "#4B5563",
                            fontSize: "15px",
                        } }, "Thanks for joining SyncChat. Use the verification code below to complete your account setup."),
                    react_1.default.createElement(exports.Section, { style: {
                            textAlign: "center",
                            margin: "30px 0",
                        } },
                        react_1.default.createElement("div", { style: {
                                display: "inline-block",
                                backgroundColor: "#F3F4FF",
                                color: "#3525CD",
                                fontSize: "32px",
                                fontWeight: "700",
                                letterSpacing: "12px",
                                padding: "15px 25px",
                                borderRadius: "12px",
                            } }, otp)),
                    react_1.default.createElement(exports.Text, { style: {
                            color: "#6B7280",
                            fontSize: "13px",
                        } }, "This verification code will expire soon. If you did not create a SyncChat account, you can ignore this email.")),
                react_1.default.createElement(exports.Hr, { style: {
                        borderColor: "#E5E7EB",
                        margin: "25px 0",
                    } }),
                react_1.default.createElement(exports.Section, { style: {
                        textAlign: "center",
                    } },
                    react_1.default.createElement(exports.Text, { style: {
                            color: "#9CA3AF",
                            fontSize: "12px",
                        } },
                        "\u00A9 ",
                        new Date().getFullYear(),
                        " SyncChat. All rights reserved."))))));
}
