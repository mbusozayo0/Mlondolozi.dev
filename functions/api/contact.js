const jsonHeaders = {
  "Content-Type": "application/json",
};

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: jsonHeaders,
  });
}

function errorResponse(message, status = 500, details = "") {
  return jsonResponse(
    {
      error: message,
      details,
    },
    status,
  );
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
    throw new Error(`Resend ${response.status}: ${errorText || "Email provider rejected the request."}`);
  }

  return response.json();
}

export async function onRequestPost({ request, env }) {
  try {
    if (!env.RESEND_API_KEY) {
      return errorResponse("Email service is not configured yet.", 503, "Missing RESEND_API_KEY.");
    }

    const contentType = request.headers.get("content-type") || "";
    const data = contentType.includes("application/json")
      ? await request.json().catch(() => null)
      : Object.fromEntries(await request.formData().catch(() => new FormData()));

    if (!data) {
      return errorResponse("Invalid request body.", 400);
    }

    const name = clean(data.name);
    const email = clean(data.email);
    const phone = clean(data.phone);
    const projectType = clean(data.projectType);
    const message = clean(data.message);

    if (!name || !email || !projectType || !message || !isEmail(email)) {
      return errorResponse("Please complete all required fields.", 400);
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

    await sendEmail(env, {
      from: fromAddress,
      to: [toAddress],
      reply_to: email,
      subject: `Portfolio enquiry from ${name}`,
      text: enquiryText,
    });

    try {
      await sendEmail(env, {
        from: fromAddress,
        to: [email],
        reply_to: toAddress,
        subject: "Thanks for contacting Mlondolozi.dev",
        text: autoResponseText,
      });
    } catch (error) {
      return jsonResponse({
        ok: true,
        autoResponseSent: false,
        warning:
          error instanceof Error
            ? `Your message was sent, but the auto-response failed. ${error.message}`
            : "Your message was sent, but the auto-response failed.",
      });
    }

    return jsonResponse({ ok: true, autoResponseSent: true });
  } catch (error) {
    return errorResponse(
      "Message could not be sent.",
      500,
      error instanceof Error ? error.message : "Unknown server error.",
    );
  }
}

export async function onRequestGet({ env }) {
  return jsonResponse({
    ok: true,
    route: "/api/contact",
    resendConfigured: Boolean(env.RESEND_API_KEY),
    contactTo: env.CONTACT_TO || "hello@mlondolozi.dev",
    contactFrom: env.CONTACT_FROM || "Mlondolozi.dev <hello@mlondolozi.dev>",
  });
}

export async function onRequestOptions() {
  return jsonResponse({ ok: true });
}
