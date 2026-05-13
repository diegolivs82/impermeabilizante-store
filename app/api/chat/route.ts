export async function POST() {
  return Response.json({ message: "Chat no disponible" }, { status: 503 });
}
