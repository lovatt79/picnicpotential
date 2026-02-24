import { Text, Section } from "@react-email/components";
import EmailLayout from "./components/EmailLayout";

interface ProposalConfirmationProps {
  data: {
    firstName: string;
    proposeeName?: string;
    proposalDate1?: string;
    location?: string;
    package?: string;
  };
}

export default function ProposalConfirmation({
  data,
}: ProposalConfirmationProps) {
  return (
    <EmailLayout preview={`Thank you, ${data.firstName}! We can't wait to help make your proposal unforgettable.`}>
      <Text style={greeting}>Hi {data.firstName},</Text>

      <Text style={paragraph}>
        Thank you for submitting your proposal request! We can&apos;t wait to
        help create an unforgettable moment. Our team will review your details
        and reach out within 1-2 business days.
      </Text>

      <Section style={summaryBox}>
        <Text style={summaryTitle}>Your Request Summary</Text>
        {data.proposeeName && (
          <Text style={summaryRow}>
            <strong>Proposee:</strong> {data.proposeeName}
          </Text>
        )}
        {data.proposalDate1 && (
          <Text style={summaryRow}>
            <strong>Preferred Date:</strong> {data.proposalDate1}
          </Text>
        )}
        {data.location && (
          <Text style={summaryRow}>
            <strong>Location:</strong> {data.location}
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
