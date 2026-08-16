import React from "react";


type CompProps = {
  style?: React.CSSProperties;
  children?: React.ReactNode;
};

export const Html: React.FC<CompProps> = ({ children }) => (
  <html>{children}</html>
);
export const Head: React.FC = () => <head />;
export const Body: React.FC<CompProps> = ({ children, style }) => (
  <body style={style as React.CSSProperties}>{children}</body>
);
export const Container: React.FC<CompProps> = ({ children, style }) => (
  <div style={style}>{children}</div>
);
export const Section: React.FC<CompProps> = ({ children, style }) => (
  <section style={style}>{children}</section>
);
export const Text: React.FC<CompProps> = ({ children, style }) => (
  <p style={style}>{children}</p>
);
export const Heading: React.FC<CompProps> = ({ children, style }) => (
  <h1 style={style}>{children}</h1>
);
export const Button: React.FC<CompProps> = ({ children, style }) => (
  <button style={style}>{children}</button>
);
export const Hr: React.FC<CompProps> = ({ style }) => <hr style={style} />;

interface VerificationEmailProps {
  username: string;
  otp: string;
}

export default function VerificationEmail({
  username,
  otp,
}: VerificationEmailProps) {
  return (
    <Html>
      <Head />

      <Body
        style={{
          backgroundColor: "#F9F9FF",
          fontFamily: "Arial, sans-serif",
          padding: "20px",
        }}
      >
        <Container
          style={{
            maxWidth: "450px",
            margin: "0 auto",
            backgroundColor: "#ffffff",
            borderRadius: "16px",
            padding: "32px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          }}
        >

          {/* Logo */}
          <Section
            style={{
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: "60px",
                height: "60px",
                backgroundColor: "#3525CD",
                color: "white",
                borderRadius: "16px",
                margin: "0 auto",
                lineHeight: "60px",
                fontSize: "28px",
                fontWeight: "bold",
              }}
            >
              ⇄
            </div>

            <Heading
              style={{
                color: "#3525CD",
                fontSize: "30px",
                marginTop: "20px",
                marginBottom: "5px",
              }}
            >
              SyncChat
            </Heading>

            <Text
              style={{
                color: "#6B7280",
                fontSize: "14px",
              }}
            >
              Secure communication made simple.
            </Text>
          </Section>


          <Hr
            style={{
              borderColor: "#E5E7EB",
              margin: "25px 0",
            }}
          />


          {/* Content */}
          <Section>

            <Heading
              style={{
                fontSize: "22px",
                color: "#111827",
              }}
            >
              Verify your email
            </Heading>


            <Text
              style={{
                color: "#4B5563",
                fontSize: "15px",
              }}
            >
              Hello {username},
            </Text>


            <Text
              style={{
                color: "#4B5563",
                fontSize: "15px",
              }}
            >
              Thanks for joining SyncChat. Use the verification code below
              to complete your account setup.
            </Text>


            {/* OTP Box */}
            <Section
              style={{
                textAlign: "center",
                margin: "30px 0",
              }}
            >
              <div
                style={{
                  display: "inline-block",
                  backgroundColor: "#F3F4FF",
                  color: "#3525CD",
                  fontSize: "32px",
                  fontWeight: "700",
                  letterSpacing: "12px",
                  padding: "15px 25px",
                  borderRadius: "12px",
                }}
              >
                {otp}
              </div>
            </Section>


            <Text
              style={{
                color: "#6B7280",
                fontSize: "13px",
              }}
            >
              This verification code will expire soon. If you did not create
              a SyncChat account, you can ignore this email.
            </Text>

          </Section>


          <Hr
            style={{
              borderColor: "#E5E7EB",
              margin: "25px 0",
            }}
          />


          {/* Footer */}
          <Section
            style={{
              textAlign: "center",
            }}
          >
            <Text
              style={{
                color: "#9CA3AF",
                fontSize: "12px",
              }}
            >
              © {new Date().getFullYear()} SyncChat. All rights reserved.
            </Text>
          </Section>


        </Container>
      </Body>
    </Html>
  );
}