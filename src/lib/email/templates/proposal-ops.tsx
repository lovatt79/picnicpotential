import { Text, Section, Hr, Link } from "@react-email/components";
import EmailLayout from "./components/EmailLayout";

interface ProposalOpsProps {
  data: {
    id?: string;
    firstName: string;
    lastName: string;
    phone?: string;
    email: string;
    proposeeName?: string;
    proposalDate1?: string;
    proposalDate2?: string;
    proposalTime?: string;
    location?: string;
    colors?: string;
    package?: string;
    addonOptions?: string[];
    foodOptions?: string[];
    howDidYouHear?: string;
    howDidYouHearOther?: string;
    notes?: string;
  };
}

function renderList(label: string, items?: string[]) {
  if (!items || items.length === 0) {
    return <Text style={row}><strong>{label}:</strong> None selected</Text>;
  }
  return (
    <>
      <Text style={row}><strong>{label}:</strong></Text>
      {items.map((item, i) => (
        <Text key={i} style={listItem}>&#8226; {item}</Text>
      ))}
    </>
  );
}

export default function ProposalOps({ data }: ProposalOpsProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://picnicpotential.com";
  const adminLink = data.id ? `${siteUrl}/admin/submissions/proposal/${data.id}` : null;

  return (
    <EmailLayout preview={`New proposal request from ${data.firstName} ${data.lastName}`}>
      <Text style={heading}>New Proposal Request</Text>

      {adminLink && (
        <Text style={adminLinkStyle}>
          <Link href={adminLink} style={linkStyle}>
            View in Admin Dashboard
          </Link>
        </Text>
      )}

      {/* Contact Info */}
      <Text style={sectionTitle}>Contact Information</Text>
      <Section style={detailBox}>
        <Text style={row}><strong>Name:</strong> {data.firstName} {data.lastName}</Text>
        <Text style={row}><strong>Email:</strong> {data.email}</Text>
        {data.phone && <Text style={row}><strong>Phone:</strong> {data.phone}</Text>}
      </Section>

      {/* Proposal Details */}
      <Text style={sectionTitle}>Proposal Details</Text>
      <Section style={detailBox}>
        {data.proposeeName && <Text style={row}><strong>Proposee:</strong> {data.proposeeName}</Text>}
        {data.proposalDate1 && <Text style={row}><strong>Preferred Date:</strong> {data.proposalDate1}</Text>}
        {data.proposalDate2 && <Text style={row}><strong>Backup Date:</strong> {data.proposalDate2}</Text>}
        {data.proposalTime && <Text style={row}><strong>Time:</strong> {data.proposalTime}</Text>}
        {data.location && <Text style={row}><strong>Location:</strong> {data.location}</Text>}
        {data.colors && <Text style={row}><strong>Colors:</strong> {data.colors}</Text>}
      </Section>

      {/* Package & Selections */}
      <Text style={sectionTitle}>Package &amp; Selections</Text>
      <Section style={detailBox}>
        {data.package && <Text style={row}><strong>Package:</strong> {data.package}</Text>}
        {renderList("Add-ons", data.addonOptions)}
        {renderList("Food", data.foodOptions)}
      </Section>

      {/* Attribution */}
      <Hr style={divider} />
      <Section style={detailBox}>
        {data.howDidYouHear && (
          <Text style={row}>
            <strong>How did you hear about us:</strong> {data.howDidYouHear}
            {data.howDidYouHearOther ? ` - ${data.howDidYouHearOther}` : ""}
          </Text>
        )}
      </Section>

      {/* Notes */}
      {data.notes && (
        <>
          <Text style={sectionTitle}>Notes</Text>
          <Section style={notesBox}>
            <Text style={notesText}>{data.notes}</Text>
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

const listItem: React.CSSProperties = {
  fontSize: "14px",
  color: "#2C2C2C",
  margin: "0 0 2px",
  lineHeight: "1.5",
  paddingLeft: "12px",
};

const divider: React.CSSProperties = {
  borderColor: "#e0dcd7",
  margin: "20px 0",
};

const notesBox: React.CSSProperties = {
  backgroundColor: "#f9f7f4",
  padding: "12px 16px",
  borderRadius: "4px",
  borderLeft: "4px solid #B8D4C8",
};

const notesText: React.CSSProperties = {
  fontSize: "14px",
  color: "#2C2C2C",
  lineHeight: "1.6",
  margin: 0,
  whiteSpace: "pre-wrap" as const,
};
