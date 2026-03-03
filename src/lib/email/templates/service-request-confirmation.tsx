import { Text, Section } from "@react-email/components";
import EmailLayout from "./components/EmailLayout";

interface ServiceRequestConfirmationProps {
  data: {
    firstName: string;
    eventDate?: string;
    backupDate?: string;
    eventType?: string;
    location?: string;
    groupSize?: string;
  };
}

export default function ServiceRequestConfirmation({
  data,
}: ServiceRequestConfirmationProps) {
  return (
    <EmailLayout preview={`Thank you, ${data.firstName}! We're excited to start planning your event.`}>
      <Text style={greeting}>Hi {data.firstName},</Text>

      <Text style={paragraph}>
        Thank you for submitting your picnic request! We&apos;re so excited to
        start planning your experience. Our team will review your details and
        reach out within 1-2 business days.
      </Text>

      <Section style={summaryBox}>
        <Text style={summaryTitle}>Your Request Summary</Text>
        {data.eventType && (
          <Text style={summaryRow}>
            <strong>Event Type:</strong> {data.eventType}
          </Text>
        )}
        {data.eventDate && (
          <Text style={summaryRow}>
            <strong>Event Date:</strong> {data.eventDate}
          </Text>
        )}
        {data.backupDate && (
          <Text style={summaryRow}>
            <strong>Backup Date:</strong> {data.backupDate}
          </Text>
        )}
        {data.location && (
          <Text style={summaryRow}>
            <strong>Location:</strong> {data.location}
          </Text>
        )}
        {data.groupSize && (
          <Text style={summaryRow}>
            <strong>Group Size:</strong> {data.groupSize}
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
