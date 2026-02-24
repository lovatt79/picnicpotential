import { Text, Section, Link } from "@react-email/components";
import EmailLayout from "./components/EmailLayout";

interface HintOpsProps {
  data: {
    id?: string;
    senderName: string;
    senderEmail: string;
    recipientName?: string;
    recipientEmail?: string;
    occasion?: string;
    message?: string;
  };
}

export default function HintOps({ data }: HintOpsProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://picnicpotential.com";
  const adminLink = data.id ? `${siteUrl}/admin/submissions/${data.id}` : null;

  return (
    <EmailLayout preview={`New hint from ${data.senderName}`}>
      <Text style={heading}>New Hint Received</Text>

      {adminLink && (
        <Text style={adminLinkStyle}>
          <Link href={adminLink} style={linkStyle}>
            View in Admin Dashboard
          </Link>
        </Text>
      )}

      {/* Sender Info */}
      <Text style={sectionTitle}>From</Text>
      <Section style={detailBox}>
        <Text style={row}><strong>Name:</strong> {data.senderName}</Text>
        <Text style={row}><strong>Email:</strong> {data.senderEmail}</Text>
      </Section>

      {/* Recipient Info */}
      <Text style={sectionTitle}>Hint Recipient</Text>
      <Section style={detailBox}>
        {data.recipientName && <Text style={row}><strong>Name:</strong> {data.recipientName}</Text>}
        {data.recipientEmail && <Text style={row}><strong>Email:</strong> {data.recipientEmail}</Text>}
        {data.occasion && <Text style={row}><strong>Occasion:</strong> {data.occasion}</Text>}
      </Section>

      {/* Message */}
      {data.message && (
        <>
          <Text style={sectionTitle}>Personal Message</Text>
          <Section style={messageBox}>
            <Text style={messageText}>{data.message}</Text>
          </Section>
        </>
      )}
    </EmailLayout>
  );
}

const heading: React.CSSProperties = {
  fontSize: "22px",
  fontWeight: 600,
  color: "#2C2C2C",
  margin: "0 0 8px",
};

const adminLinkStyle: React.CSSProperties = {
  margin: "0 0 24px",
};

const linkStyle: React.CSSProperties = {
  color: "#E8B86D",
  fontWeight: 600,
  fontSize: "14px",
};

const sectionTitle: React.CSSProperties = {
  fontSize: "13px",
  fontWeight: 600,
  color: "#6B6B6B",
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
  margin: "20px 0 8px",
};

const detailBox: React.CSSProperties = {
  backgroundColor: "#f9f7f4",
  padding: "12px 16px",
  borderRadius: "4px",
};

const row: React.CSSProperties = {
  fontSize: "14px",
  color: "#2C2C2C",
  margin: "0 0 4px",
  lineHeight: "1.5",
};

const messageBox: React.CSSProperties = {
  backgroundColor: "#f9f7f4",
  padding: "12px 16px",
  borderRadius: "4px",
  borderLeft: "4px solid #B8D4C8",
};

const messageText: React.CSSProperties = {
  fontSize: "14px",
  color: "#2C2C2C",
  lineHeight: "1.6",
  margin: 0,
  whiteSpace: "pre-wrap" as const,
  fontStyle: "italic" as const,
};
