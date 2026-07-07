import { Text, Section, Hr, Link } from "@react-email/components";
import EmailLayout from "./components/EmailLayout";
import { formatDateStr } from "@/lib/formatDate";

interface RentalInquiryOpsProps {
  data: {
    id?: string;
    firstName: string;
    lastName: string;
    phone?: string;
    email: string;
    eventDate?: string;
    location?: string;
    selectedItems?: string[];
    quantities?: Record<string, number>;
    selectedAddOns?: string[];
    howDidYouHear?: string;
    howDidYouHearOther?: string;
    notes?: string;
  };
}

export default function RentalInquiryOps({ data }: RentalInquiryOpsProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://picnicpotential.com";
  const adminLink = data.id ? `${siteUrl}/admin/submissions/rental/${data.id}` : null;

  return (
    <EmailLayout preview={`New rental inquiry from ${data.firstName} ${data.lastName}`}>
      <Text style={heading}>New Rental Inquiry</Text>

      {adminLink && (
        <Text style={adminLinkStyle}>
          <Link href={adminLink} style={linkStyle}>View in Admin Dashboard</Link>
        </Text>
      )}

      <Text style={sectionTitle}>Contact Information</Text>
      <Section style={detailBox}>
        <Text style={row}><strong>Name:</strong> {data.firstName} {data.lastName}</Text>
        <Text style={row}><strong>Email:</strong> {data.email}</Text>
        {data.phone && <Text style={row}><strong>Phone:</strong> {data.phone}</Text>}
      </Section>

      <Text style={sectionTitle}>Event Details</Text>
      <Section style={detailBox}>
        {data.eventDate && <Text style={row}><strong>Event Date:</strong> {formatDateStr(data.eventDate)}</Text>}
        {data.location && <Text style={row}><strong>Location:</strong> {data.location}</Text>}
      </Section>

      <Text style={sectionTitle}>Requested Items</Text>
      <Section style={detailBox}>
        {data.selectedItems && data.selectedItems.length > 0 ? (
          data.selectedItems.map((item, i) => {
            const qty = data.quantities?.[item];
            return (
              <Text key={i} style={listItem}>&#8226; {item}{qty && qty > 1 ? ` ×${qty}` : ""}</Text>
            );
          })
        ) : (
          <Text style={row}>No items selected</Text>
        )}
        {data.selectedAddOns && data.selectedAddOns.length > 0 && (
          <>
            <Text style={{ ...row, marginTop: "8px" }}><strong>Add-ons:</strong></Text>
            {data.selectedAddOns.map((addon, i) => (
              <Text key={i} style={listItem}>&#8226; {addon}</Text>
            ))}
          </>
        )}
      </Section>

      <Hr style={divider} />
      <Section style={detailBox}>
        {data.howDidYouHear && (
          <Text style={row}>
            <strong>How did you hear about us:</strong> {data.howDidYouHear}
            {data.howDidYouHearOther ? ` — ${data.howDidYouHearOther}` : ""}
          </Text>
        )}
      </Section>

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

const heading: React.CSSProperties = { fontSize: "22px", fontWeight: 600, color: "#2C2C2C", margin: "0 0 8px" };
const adminLinkStyle: React.CSSProperties = { margin: "0 0 24px" };
const linkStyle: React.CSSProperties = { color: "#E8B86D", fontWeight: 600, fontSize: "14px" };
const sectionTitle: React.CSSProperties = { fontSize: "13px", fontWeight: 600, color: "#6B6B6B", textTransform: "uppercase" as const, letterSpacing: "0.5px", margin: "20px 0 8px" };
const detailBox: React.CSSProperties = { backgroundColor: "#f9f7f4", padding: "12px 16px", borderRadius: "4px" };
const row: React.CSSProperties = { fontSize: "14px", color: "#2C2C2C", margin: "0 0 4px", lineHeight: "1.5" };
const listItem: React.CSSProperties = { fontSize: "14px", color: "#2C2C2C", margin: "0 0 2px", lineHeight: "1.5", paddingLeft: "12px" };
const divider: React.CSSProperties = { borderColor: "#e0dcd7", margin: "20px 0" };
const notesBox: React.CSSProperties = { backgroundColor: "#f9f7f4", padding: "12px 16px", borderRadius: "4px", borderLeft: "4px solid #B8D4C8" };
const notesText: React.CSSProperties = { fontSize: "14px", color: "#2C2C2C", lineHeight: "1.6", margin: 0, whiteSpace: "pre-wrap" as const };
