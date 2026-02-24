import { Text, Section } from "@react-email/components";
import EmailLayout from "./components/EmailLayout";

interface WeddingSuiteConfirmationProps {
  data: {
    firstName: string;
    coupleName1?: string;
    coupleName2?: string;
    venueName?: string;
    eventDate?: string;
    package?: string;
  };
}

export default function WeddingSuiteConfirmation({
  data,
}: WeddingSuiteConfirmationProps) {
  const coupleNames =
    data.coupleName1 && data.coupleName2
      ? `${data.coupleName1} & ${data.coupleName2}`
      : data.coupleName1 || data.coupleName2 || null;

  return (
    <EmailLayout preview={`Thank you, ${data.firstName}! We're so excited to help with your special day.`}>
      <Text style={greeting}>Hi {data.firstName},</Text>

      <Text style={paragraph}>
        Thank you for submitting your wedding suite request! We&apos;re so
        excited to help make your getting-ready experience beautiful and
        memorable. Our team will review your details and reach out within 1-2
        business days.
      </Text>

      <Section style={summaryBox}>
        <Text style={summaryTitle}>Your Request Summary</Text>
        {coupleNames && (
          <Text style={summaryRow}>
            <strong>Couple:</strong> {coupleNames}
          </Text>
        )}
        {data.venueName && (
          <Text style={summaryRow}>
            <strong>Venue:</strong> {data.venueName}
          </Text>
        )}
        {data.eventDate && (
          <Text style={summaryRow}>
            <strong>Event Date:</strong> {data.eventDate}
          </Text>
        )}
        {data.package && (
          <Text style={summaryRow}>
            <strong>Package:</strong> {data.package}
          </Text>
        )}
      </Section>

      <Text style={paragraph}>
        Please note that reservations are not secured until a deposit has been
        received. We&apos;ll go over all the details and next steps when we
        connect!
      </Text>

      <Text style={paragraph}>
        If you have any questions in the meantime, feel free to email us at{" "}
        <strong>Info@picnicpotential.com</strong>.
      </Text>

      <Text style={signoff}>
        Warmly,
        <br />
        The Picnic Potential Team
      </Text>
    </EmailLayout>
  );
}

const greeting: React.CSSProperties = {
  fontSize: "18px",
  color: "#2C2C2C",
  margin: "0 0 16px",
};

const paragraph: React.CSSProperties = {
  fontSize: "15px",
  lineHeight: "1.6",
  color: "#2C2C2C",
  margin: "0 0 16px",
};

const summaryBox: React.CSSProperties = {
  backgroundColor: "#f9f7f4",
  borderLeft: "4px solid #E8B86D",
  padding: "16px 20px",
  margin: "24px 0",
  borderRadius: "0 4px 4px 0",
};

const summaryTitle: React.CSSProperties = {
  fontSize: "14px",
  fontWeight: 600,
  color: "#6B6B6B",
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
  margin: "0 0 12px",
};

const summaryRow: React.CSSProperties = {
  fontSize: "14px",
  color: "#2C2C2C",
  margin: "0 0 6px",
  lineHeight: "1.5",
};

const signoff: React.CSSProperties = {
  fontSize: "15px",
  color: "#2C2C2C",
  marginTop: "24px",
  lineHeight: "1.6",
};
