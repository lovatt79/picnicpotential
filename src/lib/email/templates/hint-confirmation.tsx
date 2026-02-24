import { Text, Section } from "@react-email/components";
import EmailLayout from "./components/EmailLayout";

interface HintConfirmationProps {
  data: {
    senderName: string;
    recipientName?: string;
    occasion?: string;
  };
}

export default function HintConfirmation({ data }: HintConfirmationProps) {
  return (
    <EmailLayout preview={`Thanks for sending a hint to ${data.recipientName || "someone special"}!`}>
      <Text style={greeting}>Hi {data.senderName},</Text>

      <Text style={paragraph}>
        Thanks for sending a hint about Picnic Potential! We love helping people
        discover our experiences.
      </Text>

      <Section style={summaryBox}>
        <Text style={summaryTitle}>Your Hint Details</Text>
        {data.recipientName && (
          <Text style={summaryRow}>
            <strong>Sent to:</strong> {data.recipientName}
          </Text>
        )}
        {data.occasion && (
          <Text style={summaryRow}>
            <strong>Occasion:</strong> {data.occasion}
          </Text>
        )}
      </Section>

      <Text style={paragraph}>
        Our team has received your hint and will follow up. We&apos;ll make sure
        {data.recipientName ? ` ${data.recipientName}` : " they"} know about the
        amazing picnic experiences we offer!
      </Text>

      <Text style={paragraph}>
        If you have any questions, feel free to email us at{" "}
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
