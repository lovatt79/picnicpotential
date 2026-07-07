import { Text, Section } from "@react-email/components";
import EmailLayout from "./components/EmailLayout";
import { formatDateStr } from "@/lib/formatDate";

interface RentalInquiryConfirmationProps {
  data: {
    firstName: string;
    eventDate?: string;
    location?: string;
    selectedItems?: string[];
  };
}

export default function RentalInquiryConfirmation({ data }: RentalInquiryConfirmationProps) {
  return (
    <EmailLayout preview={`Thank you, ${data.firstName}! We received your rental inquiry.`}>
      <Text style={greeting}>Hi {data.firstName},</Text>

      <Text style={paragraph}>
        Thank you for your rental inquiry! We&apos;ve received your details and will be in touch
        within 1–2 business days to confirm availability and pricing.
      </Text>

      <Section style={summaryBox}>
        <Text style={summaryTitle}>Your Inquiry Summary</Text>
        {data.eventDate && (
          <Text style={summaryRow}>
            <strong>Event Date:</strong> {formatDateStr(data.eventDate)}
          </Text>
        )}
        {data.location && (
          <Text style={summaryRow}>
            <strong>Location:</strong> {data.location}
          </Text>
        )}
        {data.selectedItems && data.selectedItems.length > 0 && (
          <Text style={summaryRow}>
            <strong>Items Requested:</strong> {data.selectedItems.join(", ")}
          </Text>
        )}
      </Section>

      <Text style={paragraph}>
        Please note that rentals are not confirmed until a deposit has been received. We&apos;ll
        cover all the details when we connect!
      </Text>

      <Text style={paragraph}>
        Questions in the meantime? Email us at <strong>Info@picnicpotential.com</strong>.
      </Text>

      <Text style={signoff}>
        Warmly,
        <br />
        The Picnic Potential Team
      </Text>
    </EmailLayout>
  );
}

const greeting: React.CSSProperties = { fontSize: "18px", color: "#2C2C2C", margin: "0 0 16px" };
const paragraph: React.CSSProperties = { fontSize: "15px", lineHeight: "1.6", color: "#2C2C2C", margin: "0 0 16px" };
const summaryBox: React.CSSProperties = { backgroundColor: "#f9f7f4", borderLeft: "4px solid #E8B86D", padding: "16px 20px", margin: "24px 0", borderRadius: "0 4px 4px 0" };
const summaryTitle: React.CSSProperties = { fontSize: "14px", fontWeight: 600, color: "#6B6B6B", textTransform: "uppercase" as const, letterSpacing: "0.5px", margin: "0 0 12px" };
const summaryRow: React.CSSProperties = { fontSize: "14px", color: "#2C2C2C", margin: "0 0 6px", lineHeight: "1.5" };
const signoff: React.CSSProperties = { fontSize: "15px", color: "#2C2C2C", marginTop: "24px", lineHeight: "1.6" };
