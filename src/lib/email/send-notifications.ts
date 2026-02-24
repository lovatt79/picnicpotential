import { createElement } from "react";
import { sendEmail, OPS_EMAIL } from "./resend";

// Template imports
import ServiceRequestConfirmation from "./templates/service-request-confirmation";
import ServiceRequestOps from "./templates/service-request-ops";
import ProposalConfirmation from "./templates/proposal-confirmation";
import ProposalOps from "./templates/proposal-ops";
import WeddingSuiteConfirmation from "./templates/wedding-suite-confirmation";
import WeddingSuiteOps from "./templates/wedding-suite-ops";
import HintConfirmation from "./templates/hint-confirmation";
import HintOps from "./templates/hint-ops";

export type FormType = "service-request" | "proposal" | "wedding-suite" | "hint";

interface EmailPair {
  subject: string;
  react: React.ReactElement;
}

export async function sendFormNotifications(
  formType: FormType,
  data: Record<string, unknown>,
  submitterEmail: string,
  submitterName: string,
): Promise<void> {
  let confirmation: EmailPair;
  let ops: EmailPair;

  switch (formType) {
    case "service-request":
      confirmation = {
        subject: "We received your picnic request!",
        react: createElement(ServiceRequestConfirmation, { data: data as never }),
      };
      ops = {
        subject: `New Service Request from ${submitterName}`,
        react: createElement(ServiceRequestOps, { data: data as never }),
      };
      break;

    case "proposal":
      confirmation = {
        subject: "We received your proposal request!",
        react: createElement(ProposalConfirmation, { data: data as never }),
      };
      ops = {
        subject: `New Proposal Request from ${submitterName}`,
        react: createElement(ProposalOps, { data: data as never }),
      };
      break;

    case "wedding-suite":
      confirmation = {
        subject: "We received your wedding suite request!",
        react: createElement(WeddingSuiteConfirmation, { data: data as never }),
      };
      ops = {
        subject: `New Wedding Suite Request from ${submitterName}`,
        react: createElement(WeddingSuiteOps, { data: data as never }),
      };
      break;

    case "hint":
      confirmation = {
        subject: "Your hint has been sent!",
        react: createElement(HintConfirmation, { data: data as never }),
      };
      ops = {
        subject: `New Hint from ${submitterName}`,
        react: createElement(HintOps, { data: data as never }),
      };
      break;
  }

  // Fire both concurrently — one failure doesn't block the other
  await Promise.allSettled([
    sendEmail({ to: submitterEmail, subject: confirmation.subject, react: confirmation.react }),
    sendEmail({ to: OPS_EMAIL, subject: ops.subject, react: ops.react }),
  ]);
}
