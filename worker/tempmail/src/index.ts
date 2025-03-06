import postalMime from "postal-mime"

type Email = {
  subject: string,
  body: string
  text: string
  from: string
  to: string
}

function uuidv4() {
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
    (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
  );
}

export default {
  async email(message, env, ctx) {
    const email = await postalMime.parse(message.raw)
    const data = {
      body: email.html ?? "",
      text: email.text ?? "",
      subject: email.subject ?? "",
      from: email.from.address ?? "",
      to: email.to?.[0].address ?? "",
    }
    const id = uuidv4()
    const promise = env.DB.prepare('insert into emails (id, body, text, "from", "to", created_at, subject) values (?, ?, ?, ?, ?, ?, ?)').bind(id, data.body, data.text, data.from, data.to, Date.now(), data.subject).run()
    ctx.waitUntil(promise)
  }
} satisfies ExportedHandler<Env>;