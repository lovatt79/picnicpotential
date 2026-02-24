import { Text, Section, Hr, Link } from "@react-email/components";
import EmailLayout from "./components/EmailLayout";

interface WeddingSuiteOpsProps {
  data: {
    id?: string;
    firstName: string;
    lastName: string;
    phone?: string;
    email: string;
    coupleName1?: string;
    coupleName2?: string;
    venueName?: string;
    venueAddress?: string;
    venueContactName?: string;
    venueContactEmail?: string;
    venueContactPhone?: string;
    eventDate?: string;
    arrivalTime?: string;
    suiteAccessTime?: string;
    peopleCount?: string;
    package?: string;
    foodOptions?: Array<{ label: string; quantity?: number }>;
    addonOptions?: string[];
    giftOptions?: string[];
    swapRequest?: string;
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

function renderFoodOptions(
  label: string,
  items?: Array<{ label: string; quantity?: number }>
) {
  if (!items || items.length === 0) {
    return <Text style={row}><strong>{label}:</strong> None selected</Text>;
  }
  return (
    <>
      <Text style={row}><strong>{label}:</strong></Text>
      {items.map((item, i) => (
        <Text key={i} style={listItem}>
          &#8226; {item.label}{item.quantity ? ` (x${item.quantity})` : ""}
        </Text>
      ))}
    </>
  );
}

export default function WeddingSuiteOps({ data }: WeddingSuiteOpsProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://picnicpotential.com";
  const adminLink = data.id
    ? `${siteUrl}/admin/submissions/wedding-suite/${data.id}`
    : null;

  return (
    <EmailLayout preview={`New wedding suite request from ${data.firstName} ${data.lastName}`}>
      <Text style={heading}>New Wedding Suite Request</Text>

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
        <Text style={row}>
          <strong>Name:</strong> {data.firstName} {data.lastName}
        </Text>
        <Text style={row}>
          <strong>Email:</strong> {data.email}
        </Text>
        {data.phone && (
          <Text style={row}>
            <strong>Phone:</strong> {data.phone}
          </Text>
        )}
      </Section>

      {/* Couple */}
      <Text style={sectionTitle}>The Couple</Text>
      <Section style={detailBox}>
        {data.coupleName1 && (
          <Text style={row}>
            <strong>Partner 1:</strong> {data.coupleName1}
          </Text>
        )}
        {data.coupleName2 && (
          <Text style={row}>
            <strong>Partner 2:</strong> {data.coupleName2}
          </Text>
        )}
      </Section>

      {/* Venue */}
      <Text style={sectionTitle}>Venue Details</Text>
      <Section style={detailBox}>
        {data.venueName && (
          <Text style={row}>
            <strong>Venue:</strong> {data.venueName}
          </Text>
        )}
        {data.venueAddress && (
          <Text style={row}>
            <strong>Address:</strong> {data.venueAddress}
          </Text>
        )}
        {data.venueContactName && (
          <Text style={row}>
            <strong>Venue Contact:</strong> {data.venueContactName}
          </Text>
        )}
        {data.venueContactEmail && (
          <Text style={row}>
            <strong>Venue Email:</strong> {data.venueContactEmail}
          </Text>
        )}
        {data.venueContactPhone && (
          <Text style={row}>
            <strong>Venue Phone:</strong> {data.venueContactPhone}
          </Text>
        )}
      </Section>

      {/* Timing */}
      <Text style={sectionTitle}>Timing</Text>
      <Section style={detailBox}>
        {data.eventDate && (
          <Text style={row}>
            <strong>Event Date:</strong> {data.eventDate}
          </Text>
        )}
        {data.arrivalTime && (
          <Text style={row}>
            <strong>Arrival Time:</strong> {data.arrivalTime}
          </Text>
        )}
        {data.suiteAccessTime && (
          <Text style={row}>
            <strong>Suite Access Time:</strong> {data.suiteAccessTime}
          </Text>
        )}
        {data.peopleCount && (
          <Text style={row}>
            <strong>Number of People:</strong> {data.peopleCount}
          </Text>
        )}
      </Section>

      {/* Package & Selections */}
      <Text style={sectionTitle}>Package &amp; Selections</Text>
      <Section style={detailBox}>
        {data.package && (
          <Text style={row}>
            <strong>Package:</strong> {data.package}
          </Text>
        )}
        {renderFoodOptions("Food & Drinks", data.foodOptions)}
        {renderList("Add-ons", data.addonOptions)}
        {renderList("Gifts", data.giftOptions)}
        {data.swapRequest && (
          <Text style={row}>
            <strong>Swap Request:</strong> {data.swapRequest}
          </Text>
        )}
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
