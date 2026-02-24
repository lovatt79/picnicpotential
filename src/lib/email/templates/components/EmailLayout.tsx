import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Hr,
  Link,
  Preview,
} from "@react-email/components";
import type { ReactNode } from "react";

interface EmailLayoutProps {
  preview: string;
  children: ReactNode;
}

// Brand colors from globals.css
const colors = {
  cream: "#FFF9F5",
  gold: "#E8B86D",
  charcoal: "#2C2C2C",
  warmGray: "#6B6B6B",
  sage: "#B8D4C8",
};

export default function EmailLayout({ preview, children }: EmailLayoutProps) {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={body}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Text style={logoText}>Picnic Potential</Text>
            <Text style={tagline}>
              Memorable picnic &amp; event experiences in Sonoma County
            </Text>
            <Hr style={goldLine} />
          </Section>

          {/* Content */}
          <Section style={content}>{children}</Section>

          {/* Footer */}
          <Section style={footer}>
            <Hr style={footerLine} />
            <Text style={footerText}>Picnic Potential</Text>
            <Text style={footerText}>Sonoma County, California</Text>
            <Text style={footerLinks}>
              <Link href="mailto:Info@picnicpotential.com" style={footerLink}>
                Info@picnicpotential.com
              </Link>
              {" | "}
              <Link
                href="https://www.instagram.com/picnic.potential/"
                style={footerLink}
              >
                Instagram
              </Link>
              {" | "}
              <Link
                href="https://www.pinterest.com/PicnicPotential/"
                style={footerLink}
              >
                Pinterest
              </Link>
              {" | "}
              <Link
                href="https://www.facebook.com/picnicpotential"
                style={footerLink}
              >
                Facebook
              </Link>
            </Text>
            <Text style={copyright}>
              &copy; {new Date().getFullYear()} Picnic Potential. All rights
              reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// --- Styles ---

const body: React.CSSProperties = {
  backgroundColor: "#f4f1ed",
  fontFamily:
    "'Georgia', 'Times New Roman', serif",
  margin: 0,
  padding: 0,
};

const container: React.CSSProperties = {
  maxWidth: "600px",
  margin: "0 auto",
  backgroundColor: colors.cream,
};

const header: React.CSSProperties = {
  padding: "40px 32px 0",
  textAlign: "center" as const,
};

const logoText: React.CSSProperties = {
  fontSize: "28px",
  fontFamily: "'Georgia', 'Times New Roman', serif",
  color: colors.charcoal,
  margin: "0 0 4px",
  fontWeight: 400,
};

const tagline: React.CSSProperties = {
  fontSize: "13px",
  color: colors.warmGray,
  margin: "0 0 24px",
};

const goldLine: React.CSSProperties = {
  borderColor: colors.gold,
  borderWidth: "2px",
  margin: 0,
};

const content: React.CSSProperties = {
  padding: "32px",
};

const footer: React.CSSProperties = {
  padding: "0 32px 32px",
  textAlign: "center" as const,
};

const footerLine: React.CSSProperties = {
  borderColor: "#e0dcd7",
  margin: "0 0 24px",
};

const footerText: React.CSSProperties = {
  fontSize: "13px",
  color: colors.warmGray,
  margin: "0 0 2px",
};

const footerLinks: React.CSSProperties = {
  fontSize: "12px",
  color: colors.warmGray,
  margin: "12px 0 0",
};

const footerLink: React.CSSProperties = {
  color: colors.gold,
  textDecoration: "underline",
};

const copyright: React.CSSProperties = {
  fontSize: "11px",
  color: "#aaa",
  margin: "16px 0 0",
};
