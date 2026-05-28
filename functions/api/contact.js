const jsonHeaders = {
  "Content-Type": "application/json",
};

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: jsonHeaders,
  });
}

function clean(value) {
  return String(value || "").trim();
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

async function sendEmail(env, payload) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Email provider rejected the request.");
  }

  return response.json();
}

export async function onRequestPost({ request, env }) {
  if (!env.RESEND_API_KEY) {
    return jsonResponse({ error: "Email service is not configured yet." }, 503);
  }

  const data = await request.json().catch(() => null);

  if (!data) {
    return jsonResponse({ error: "Invalid request body." }, 400);
  }

  const name = clean(data.name);
  const email = clean(data.email);
  const phone = clean(data.phone);
  const projectType = clean(data.projectType);
  const message = clean(data.message);

  if (!name || !email || !projectType || !message || !isEmail(email)) {
    return jsonResponse({ error: "Please complete all required fields." }, 400);
  }

  const toAddress = env.CONTACT_TO || "hello@mlondolozi.dev";
  const fromAddress = env.CONTACT_FROM || "Mlondolozi.dev <hello@mlondolozi.dev>";
  const submittedAt = new Date().toISOString();
  const enquiryText = [
    "New portfolio enquiry",
    "",
    `Name: ${name}`,
    `Email: ${email}`,
    `Phone: ${phone || "Not provided"}`,
    `Project type: ${projectType}`,
    `Submitted: ${submittedAt}`,
    "",
    "Message:",
    message,
  ].join("\n");

  const autoResponseText = [
    `Hi ${name},`,
    "",
    "Thanks for reaching out through Mlondolozi.dev. I received your message and will respond as soon as possible.",
    "",
    "For anything urgent, you can call or WhatsApp me on +27 68 140 2763.",
    "",
    "Regards,",
    "Mlondolozi Zondi",
  ].join("\n");

  await Promise.all([
    sendEmail(env, {
      from: fromAddress,
      to: [toAddress],
      reply_to: email,
      subject: `Portfolio enquiry from ${name}`,
      text: enquiryText,
    }),
    sendEmail(env, {
      from: fromAddress,
      to: [email],
      reply_to: toAddress,
      subject: "Thanks for contacting Mlondolozi.dev",
      text: autoResponseText,
    }),
  ]);

  return jsonResponse({ ok: true });
}

export async function onRequestOptions() {
  return jsonResponse({ ok: true });
}
