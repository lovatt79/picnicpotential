-- Populate FAQs with actual content
-- First, clear existing FAQs to avoid duplicates
DELETE FROM faqs;

-- Insert new FAQs
INSERT INTO faqs (question, answer, sort_order, is_published) VALUES
(
  'How can I secure a reservation?',
  'Go to the packages page and click on the standard icon to be directed to our Picnic Request Form. Upon receipt of your picnic request form we will review all of the provided information and respond with pricing and details based on your selections. If there is something you are interested in but don''t see please add it to your notes.',
  1,
  true
),
(
  'What is your Rescheduling and Cancellation Policy?',
  'We understand things come up but our picnics and events take a significant amount of planning and preparation so we are happy to reschedule but we must receive notice a minimum of one week from the date of your event or picnic. The rescheduled date must take place within 1 year of the originally scheduled date. Please note that vendor policies, including deposits and cancellations, may differ and the client may be responsible for replacement costs for the new date.',
  2,
  true
),
(
  'What if rain is in the forecast?',
  'Due to the high quality of our floor coverings, whether rug, blanket or quilt, we cannot set up on damp or wet ground. One week prior to the picnic, if rain is in the forecast you are able to reschedule or we are happy to move into an indoor or alternate space that you have arranged. For parties of 6 or less we are also happy to offer our bubble tent at a minimal additional charge when possible. If you would like to reschedule you must email Info@picnicpotential.com with your event date and details. We will attempt to notify all vendors as quickly as possible to avoid any additional fees or charges. In the event that you want to "wait and see" we are happy to arrive on the day of and set up but if it is too wet, begins to rain, etc we will not be able to set up and no refund will be issued.',
  3,
  true
),
(
  'Can we bring our own food?',
  'Absolutely as long as outside food is allowed at the location you choose. Please note that wineries often provide their own food and do not allow outside food. Outside alcohol is not permitted at winery locations and/or most public locations.',
  4,
  true
),
(
  'Can we leave early?',
  'Yes, but you must first notify Picnic Potential and wait for us to arrive as you are responsible for all picnic supplies for the duration of your picnic.',
  5,
  true
),
(
  'What if we want to extend our picnic time?',
  'You can add hours during the reservation process or you can add them the day of. Additional hours are subject to availability and must be added at least 30 minutes prior the end of your picnic to avoid the increased per hour charges of $50/hour.',
  6,
  true
),
(
  'Do we need a permit?',
  'Please note that some locations may require a permit and we encourage you to research whether or not one is needed. If you do not obtain a permit we will still do the set up but if it is not allowed and or we are asked to leave by whatever local park authority you will not receive a refund. If we receive a citation for the setup the cost of said permit will be the responsibility of and invoiced to the client post event date. Payment of your deposit signifies you have read this information and understand our policy.',
  7,
  true
),
(
  'What if there is damage or loss?',
  'Any items that are damaged, lost or missing will be the responsibility the client and invoiced post event. For spills, stains or damage we will first attempt to clean the item. If an item needs professional cleaning the cost of cleaning will be the responsibility of the client. If an item is lost or missing the replacement cost and a sourcing fee will be invoiced post event. Please note that in some cases we will add a refundable cleaning fee to the reservation and it will be refunded after the event. Umbrella Disclosure-Please note that if you order or we provide complimentary umbrellas you are responsible for any damage caused by standard use, wind or other weather related factors or guest activities. This includes any damage to the picnic, cushions, tables that may be caused by spills, the umbrella knocking over due to wind, etc. If you do not wish to assume this risk or responsibility please let us know at set up and we will remove umbrellas accordingly.',
  8,
  true
),
(
  'Do you do beach set ups?',
  'Yes but due to parking and needing close vehicle access we typically only set up at Doran Beach. Beach locations will have an additional non refundable cleaning fee and this is to remove the sand from our supplies. This fee will be determined based on the size of the group.',
  9,
  true
),
(
  'How much notice is needed to book a picnic?',
  'Our preference is 2 weeks but who are we to stop a last minute picnic or party? So, fill out the form and we will reach out to see if we can accommodate your requested date and time.',
  10,
  true
),
(
  'Can I bring my pet?',
  'We respect the love of a fur baby and welcome them! However, please note that we require a non refundable $50 cleaning fee for all pets to be used for cleaning, hair removal, and any accidents that may occur. Any excessive accidents or damage will be billed to the client accordingly. Please note that if you bring a pet with you we must receive the above mentioned deposit before we will turn the picnic over to you.',
  11,
  true
);
