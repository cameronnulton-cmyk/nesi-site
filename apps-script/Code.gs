/**
 * NESI consultation form -> email.
 *
 * Reference copy of the Google Apps Script that receives the website form.
 * The LIVE script runs in the owner's Google account (script.google.com), not in
 * this repo. If you change the live script, update this copy too, and vice versa.
 *
 * What it does:
 *   1. The website form POSTs name/company/phone/email/details here.
 *   2. Anything with the hidden "_gotcha" field filled in is dropped (spam trap).
 *   3. An email is sent to NOTIFY_TO, from the sales@ alias when it is set up as a
 *      "Send mail as" address, with Reply-To set to the visitor's email.
 *   4. Mail a person sends to themselves skips the Gmail inbox, so the script moves
 *      the thread into the inbox and marks it unread.
 *
 * Deploying (see README.md): Deploy > Manage deployments > edit (pencil) > Version:
 * "New version" > Deploy. Keep the SAME deployment so the /exec URL does not change.
 * Creating a brand-new deployment gives a new URL that must be pasted into the
 * <form action="..."> in index.html.
 *
 * NOTE: the subject below still says "quote request" (the form used to ask for
 * quotes). Change SUBJECT_PREFIX to match the new "consultation" wording if
 * desired; the inbox-fix search in step 4 uses the same prefix, so it stays in sync.
 */

var NOTIFY_TO = 'cameron.nulton@asafabrication.com';   // who receives submissions
var FROM_ADDRESS = 'sales@nesiintegration.com';         // shown as the sender
var SUBJECT_PREFIX = 'NESI quote request from ';

function doPost(e) {
  var p = (e && e.parameter) || {};

  // Spam trap: real visitors never see this field.
  if (p._gotcha) {
    return ContentService.createTextOutput('ok');
  }

  var name = p.name || 'unknown';
  var body = [
    'Name: ' + (p.name || ''),
    'Company: ' + (p.company || ''),
    'Email: ' + (p.email || ''),
    'Phone: ' + (p.phone || ''),
    'Details: ' + (p.details || '')
  ].join('\n');

  var options = { name: 'NESI Website', replyTo: p.email || '' };
  // Only use the sales@ sender if it is a verified "Send mail as" alias on this account.
  if (GmailApp.getAliases().indexOf(FROM_ADDRESS) !== -1) {
    options.from = FROM_ADDRESS;
  }
  GmailApp.sendEmail(NOTIFY_TO, SUBJECT_PREFIX + name, body, options);

  // Step 4: self-sent mail skips the inbox, so pull it back in.
  try {
    Utilities.sleep(4000);
    GmailApp.search('subject:"' + SUBJECT_PREFIX.trim() + '" newer_than:1h').forEach(function (t) {
      t.moveToInbox();
      t.markUnread();
    });
  } catch (err) { /* delivery already succeeded; inbox move is best-effort */ }

  return ContentService.createTextOutput('ok');
}

/**
 * Run this from the Apps Script editor (Run > testForm) to send a sample email and
 * to grant the script its Gmail permissions the first time. Running doPost directly
 * in the editor fails with "Cannot read properties of undefined (reading
 * 'parameter')" because there is no web request; that is expected.
 */
function testForm() {
  doPost({ parameter: {
    name: 'Test Person', company: 'Test Co', email: 'test@example.com',
    phone: '555-0100', details: 'Test submission from the editor.'
  }});
}
