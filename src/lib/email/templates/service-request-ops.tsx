import { Text, Section, Hr, Link } from "@react-email/components";
import EmailLayout from "./components/EmailLayout";

interface ServiceRequestOpsProps {
  data: {
    id?: string;
    firstName: string;
    lastName: string;
    phone?: string;
    email: string;
    eventDate?: string;
    backupDate?: string;
    eventType?: string;
    eventTime?: string;
    additionalTime?: string;
    city?: string;
    exactLocation?: string;
    groupSize?: string;
    guestNames?: string;
    occasion?: string;
    colorChoice1?: string;
    colorChoice1Other?: string;
    colorChoice2?: string;
    colorChoice2Other?: string;
    foodOptions?: string[];
    dessertOptions?: string[];
    dessertOther?: string;
    addOns?: string[];
    howDidYouHear?: string;
    howDidYouHearOther?: string;
    referredBy?: string;
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

export default function ServiceRequestOps({ data }: ServiceRequestOpsProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://picnicpotential.com";
  const adminLink = data.id ? `${siteUrl}/admin/submissions/${data.id}` : null;

  return (
    <EmailLayout preview={`New service request from ${data.firstName} ${data.lastName}`}>
      <Text style={heading}>New Service Request</Text>

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

      {/* Event Details */}
      <Text style={sectionTitle}>Event Details</Text>
      <Section style={detailBox}>
        {data.eventType && <Text style={row}><strong>Event Type:</strong> {data.eventType}</Text>}
        {data.eventDate && <Text style={row}><strong>Event Date:</strong> {data.eventDate}</Text>}
        {data.backupDate && <Text style={row}><strong>Backup Date:</strong> {data.backupDate}</Text>}
        {data.eventTime && <Text style={row}><strong>Event Time:</strong> {data.eventTime}</Text>}
        {data.additionalTime && <Text style={row}><strong>Additional Time:</strong> {data.additionalTime}</Text>}
        {data.occasion && <Text style={row}><strong>Occasion:</strong> {data.occasion}</Text>}
      </Section>

      {/* Location & Guests */}
      <Text style={sectionTitle}>Location &amp; Guests</Text>
      <Section style={detailBox}>
        {data.city && <Text style={row}><strong>City:</strong> {data.city}</Text>}
        {data.exactLocation && <Text style={row}><strong>Exact Location:</strong> {data.exactLocation}</Text>}
        {data.groupSize && <Text style={row}><strong>Group Size:</strong> {data.groupSize}</Text>}
        {data.guestNames && <Text style={row}><strong>Guest Names:</strong> {data.guestNames}</Text>}
      </Section>

      {/* Style */}
      {(data.colorChoice1 || data.colorChoice2) && (
        <>
          <Text style={sectionTitle}>Style &amp; Colors</Text>
          <Section style={detailBox}>
            {data.colorChoice1 && (
              <Text style={row}>
                <strong>Color Choice 1:</strong> {data.colorChoice1}
                {data.colorChoice1Other ? ` (${data.colorChoice1Other})` : ""}
              </Text>
            )}
            {data.colorChoice2 && (
              <Text style={row}>
                <strong>Color Choice 2:</strong> {data.colorChoice2}
                {data.colorChoice2Other ? ` (${data.colorChoice2Other})` : ""}
              </Text>
            )}
          </Section>
        </>
      )}

      {/* Selections */}
      <Text style={sectionTitle}>Selections</Text>
      <Section style={detailBox}>
        {renderList("Food", data.foodOptions)}
        {renderList("Desserts", data.dessertOptions)}
        {data.dessertOther && <Text style={row}><strong>Dessert Other:</strong> {data.dessertOther}</Text>}
        {renderList("Add-ons", data.addOns)}
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
        {data.referredBy && <Text style={row}><strong>Referred by:</strong> {data.referredBy}</Text>}
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
